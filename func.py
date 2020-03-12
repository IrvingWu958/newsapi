from newsapi import NewsApiClient
from newsapi import newsapi_exception

newsApi = NewsApiClient(api_key='afcb728aa3c747d097198d7011c61607')


def fetch_data(news_name='all'):
    if news_name == 'all':
        return newsApi.get_top_headlines(language='en', page_size=30)
    else:
        return newsApi.get_top_headlines(sources=news_name, language='en')


def get_everything(keyword, start_time, end_time, source="all"):
    if source == 'all':
        everything = newsApi.get_everything(q=keyword,
                                            from_param=start_time,
                                            to=end_time,
                                            language='en',
                                            page_size=30,
                                            sort_by="publishedAt")

    else:
        everything = newsApi.get_everything(q=keyword,
                                            sources=source,
                                            from_param=start_time,
                                            to=end_time,
                                            language='en',
                                            page_size=30,
                                            sort_by="publishedAt")
    return everything


def get_source(category=""):
    if category:
        source = newsApi.get_sources(language='en', country='us', category=category)
    else:
        source = newsApi.get_sources(language='en', country='us')
    return source


def filter_articles(data):
    articles_arr = []
    all_articles = data
    for articles in all_articles['articles']:
        flag = False
        for key in articles:
            if key == 'source':
                for i in key:
                    if i == '' or i == 'null':
                        flag = True
                        break
            if articles[key] is None or articles[key] == 'null' or articles[key] == "":
                flag = True
        if not flag:
            articles_arr.append(articles)
    return articles_arr


def filter_source(data):
    source_arr = []
    all_articles = data
    for articles in all_articles['sources']:
        flag = False
        for key in articles:
            if articles[key] is None or articles[key] == 'null' or articles[key] == "":
                flag = True
        if not flag:
            source_arr.append(articles)
    return source_arr


def open_stop(filename):
    stop_set = set()
    with open(filename) as fp:
        line = fp.readline()
        while line:
            stop_set.add(line.strip('\n'))
            line = fp.readline()
    fp.close()
    return stop_set


def word_freq():
    all_articles = filter_articles(fetch_data('all'))
    titles = [article['title'] for article in all_articles]
    freq_map = {}
    stop_words = open_stop('static/stopwords_en.txt')
    for ele in titles:
        words = ele.split()
        for word in words:
            word = word.lower().strip(':')
            if word not in stop_words and (word != '-' and word != '|'):
                if word in freq_map:
                    freq_map[word] += 1
                else:
                    freq_map[word] = 1
    output = sorted(freq_map.items(), key=lambda item: item[1], reverse=True)[0: 30]
    freq = [item[1] for item in output]
    freq_max = max(freq)
    freq_min = min(freq)
    output = [{'word': item[0], 'size': (int((item[1] - freq_min) / (freq_max - freq_min))) * 20 + 15}
              for item in output]
    print(output)
    return output
