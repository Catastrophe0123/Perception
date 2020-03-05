import random
from flask import Flask, render_template, request, jsonify
from db_utils import create_connection, run_query
from utils import update_user_token, insert_user, get_user_data, get_topics_data, get_session_token, get_images, \
    get_email, get_word_percent, update_user_image, get_datetime
import ast
from flask_cors import CORS

app = Flask(
    __name__,
)
CORS(app)


@app.route("/login", methods=['POST'])
def login():
    """
    handles login
    :return: json object of login data
    """

    name, email, image = request.form["name"], request.form["email"], request.form["image"]
    data = {"name": name, "email": email, "image": image}
    query = "select * from users where email='{}'".format(email)
    conn = create_connection()
    results = run_query(conn, query)
    if len(results) == 0 or results is None:
        insert_user(data)
    else:
        update_user_token(data)
        update_user_image(data)
    return jsonify(get_user_data(email))


@app.route("/update", methods=['POST'])
def update():
    """
    handles login
    :return: json object of login data
    """
    email = request.form["email"]
    data = {"email": email}
    update_user_token(data)
    return jsonify(get_user_data(email))


@app.route("/topics", methods=['GET'])
def topics():
    """
    returns topics
    :return: json object of topic data
    """
    data = request.args
    offset = int(data["offset"])
    if "limit" in data:
        limit = data["limit"]
    else:
        limit = 10

    query = "select * from topics"
    conn = create_connection()
    results = run_query(conn, query)
    newresult = []
    for i in results:
        newresult.append(i["topic_name"])
    print(newresult)
    conn.close()
    return jsonify(get_topics_data(newresult, offset, limit))


@app.route("/images", methods=['GET'])
def images():
    """
    returns images for the topic
    :return: json object of image data
    """
    data = request.args
    user_id = data["user_id"]
    topic = data["topic"]
    session_id = get_session_token(user_id)
    data = {"code": 1, "message": "image fetched successfully", "session_id": session_id,
            "data": random.choice(get_images(topic))}
    return jsonify(data)


@app.route("/submit", methods=['POST'])
def submit():
    """
    handles user submits
    :return: json object of submit confirmation
    """

    conn = create_connection()
    data = request.json
    user_id, words_input, datetime, topic = data["user_id"], data[
        "words_input"], data["datetime"], data["topic"]
    email = get_email(user_id)
    # words = ast.literal_eval(str(words_input))
    for i, word in enumerate(words_input):
        print("topic is : ", topic[i])
        query = "INSERT into user_content(words, user_id, time,email, topic) VALUES(%s,%s,%s,%s,%s)"
        run_query(conn, query, [word, user_id,
                                datetime[i],
                                email, topic[i]])
    conn.commit()
    conn.close()
    return jsonify({"code": 1, "message": "user response saved"})


@app.route("/result", methods=['GET'])
def result():
    """
    sends results
    :return: json object with results
    """
    data = request.args
    user_id = data["user_id"]
    query = "SELECT words, topic from user_content WHERE user_id = {}".format(
        user_id)
    conn = create_connection()
    (queryResults) = run_query(conn, query)
    print(queryResults)

    # query = "SELECT * from content WHERE content_id = {}".format(content_id)
    # content = run_query(conn, query)[0]
    words = []
    topics = []
    for i in queryResults:
        words.append(i["words"])
        topics.append(i["topic"])

    word_freq = get_word_percent(queryResults)
    freq = []
    conn.commit()
    conn.close()
    return jsonify(
        {"code": 1, "message": "Stats fetched successfully", "words_stats": word_freq, "alldata": queryResults,
         "content_type": "application/json"})


@app.route("/summary", methods=['GET'])
def summary():
    """
    sends result summary
    :return: json object with results
    """
    data = request.args
    user_id, session_id = data["user_id"], data["session_id"]
    query = "SELECT user_content.content_id, words, content_url, content_type FROM user_content " \
            "INNER JOIN content ON content.content_id = user_content.content_id WHERE user_content.session_id = '" + \
        session_id + "' GROUP BY content_id"
    conn = create_connection()
    data = run_query(conn, query)
    conn.commit()
    conn.close()
    data_json = {"code": 1, "message": "Results fetched successfully", "session_id": session_id,
                 "data": data}
    return jsonify(data_json)


if __name__ == '__main__':
    app.run(port=4000, debug=True)
