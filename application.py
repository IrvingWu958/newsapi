from newsapi import NewsApiClient
from newsapi import newsapi_exception
from flask import Flask
from flask import request
import json
import func
from flask_cors import *

application = Flask(__name__)
CORS(application)
# Initialize Python client
newsApi = NewsApiClient(api_key='afcb728aa3c747d097198d7011c61607')


@application.route('/', methods=['GET'])
def home():
    return application.send_static_file('index.html')


@application.route('/news/cnn', methods=['GET'])
def cnn():
    data = func.fetch_data('cnn')
    cnn_articles = func.filter_articles(data)
    json_file = {
        "cnnArticles": cnn_articles
    }
    return json.dumps(json_file)


@application.route('/news/fox', methods=['GET'])
def fox():
    data = func.fetch_data('fox-news')
    fox_articles = func.filter_articles(data)
    json_file = {
        "foxArticles": fox_articles
    }
    return json.dumps(json_file)


@application.route('/news/all', methods=['GET'])
def all_top_headlines():
    data = func.fetch_data()
    all_articles = func.filter_articles(data)
    # print(all_articles)
    json_file = {
        "allArticles": all_articles
    }
    return json.dumps(json_file)


@application.route('/search', methods=['POST'])
def search_news():
    data = request.get_json()
    keyword = data['keyword'].lower()
    from_param = data['startTime'].lower()
    to = data['endTime']
    source_sea = data['source'].lower()
    try:
        everything = func.get_everything(keyword, from_param, to, source_sea)
        everything = func.filter_articles(everything)
        json_file = {
            "allArticles": everything
        }
        return json.dumps(json_file)
    except newsapi_exception.NewsAPIException as msg:
        msg = msg.get_message()
        error_msg = msg
        json_file = {
            "errorMsg": error_msg
        }
        return json.dumps(json_file)


@application.route('/source', methods=['GET', 'POST'])
def source():
    if request.method == 'GET':
        try:
            source_all = func.get_source()
            source_def = func.filter_source(source_all)
            print(source_all)
            json_file = {
                "source": source_def
            }
            return json.dumps(json_file)
        except Exception as msg:
            error_msg = msg['message']
            json_file = {
                "source": "",
                "errorMsg": error_msg
            }
            return json.dumps(json_file)
    else:
        try:
            data = request.get_json()
            category = data['category'].lower()
            source_upd = func.filter_source(func.get_source(category=category))
            print(source_upd)
            json_file = {
                "source": source_upd
            }
            return json.dumps(json_file)
        except Exception as msg:
            error_msg = msg['message']
            json_file = {
                "source": "",
                "errorMsg": error_msg
            }
            return json.dumps(json_file)


@application.route('/wordcloud')
def word_cloud():
    func.word_freq()
    json_file = {
        "wordsArr": func.word_freq()
    }
    return json.dumps(json_file)


if __name__ == '__main__':
    application.run(debug=True)
