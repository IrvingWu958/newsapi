const URL = "http://localhost:5000/";

window.onload = function (){
    getArticles('cnn');
    getArticles('fox');
    getArticles('all');
    wordCloud();
}

// control the function of toolbar. 1 is for Google News main page, 2 is for Search
display(1);
function display(num) {
    let bodyNum = document.getElementById('body' + num);
    let anotherBody = document.getElementById('body' + (3 - num));
    let btn1 = document.getElementById('btn1');
    let btn2 = document.getElementById('btn2');
    let btn3 = document.getElementById('btn3');
    let btn4 = document.getElementById('btn4');
    bodyNum.style.display = "";
    anotherBody.style.display = 'none';
    if (num == 1) {
        btn1.style.backgroundColor = "#5c5757";
        btn1.style.color = "white";
        btn2.style.backgroundColor = "#e3e3da";
        btn2.style.color = "black";
    } else {
        btn4.style.backgroundColor = "#5c5757";
        btn4.style.color = "white";
        btn3.style.backgroundColor = "#e3e3da";
        btn3.style.color = "black";
        defaultSrc();
    }
}

// ------------------------------------------------ Toolbar ----------------------------------------------
// set the default color of toolbar and get the hover effect
let originC = "";
let originB = "";
function changeClr(cur) {
    originC = cur.style.color;
    originB = cur.style.backgroundColor;
    cur.style.color = "white";
    cur.style.backgroundColor = "darkseagreen";
}
function returnClr(cur) {
    cur.style.color = originC;
    cur.style.backgroundColor = originB;
}

// ------------------------------------------------ Articles Getter ----------------------------------------------
getArticles('cnn');
getArticles('fox');
getArticles('all');

// get the specified articles from a media
function getArticles(newsName) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL + 'news/' + newsName, true);
    xhr.onload = function(e) {
        if(this.status == 200||this.status == 304){
            let response = JSON.parse(this.response);
            if (newsName == 'all') {
                carouselT(response);
            } else  {
                makeCardsT(newsName,response);
            }
        }
    };
    xhr.send();
}

function getArticlesArrT(newsName, num, jsonFile) {
    let arr = [];
    let articlesArray;
    articlesArray = jsonFile[newsName+'Articles'];
    if (articlesArray.length == 0) return arr;
    if (articlesArray.length < num) num = articlesArray.length;
    for (let i=0; i<num;i++) {
        arr.push(articlesArray[i]);
    }
    return arr;
}

// ------------------------------------------------ CNN/FOX News Card ----------------------------------------------
function makeCardsT(newsName, jsonFile) {
    let cards = document.getElementsByClassName("card-" + newsName);
    let links = document.getElementsByClassName(newsName + "-link");
    let articlesArr = getArticlesArrT(newsName, 4, jsonFile);
    for (let i=0;i<4;i++) {
        cards[i].children[0].setAttribute('src',articlesArr[i]['urlToImage']);
        cards[i].children[1].children[0].innerHTML = articlesArr[i]['title'];
        cards[i].children[1].children[1].innerHTML = articlesArr[i]['description'];
        links[i].setAttribute('href', articlesArr[i]['url']);
    }
}

// ------------------------------------------------ Carousel ----------------------------------------------
function carouselT(jsonFile) {
    let articlesArr = getArticlesArrT('all', 5, jsonFile);
    console.log(articlesArr);
    let img = document.getElementById('carousel-img');
    let link = document.getElementById('carousel-link');
    let words = document.getElementsByClassName('img-word');
    let title = words[0].children[0].children[0];
    let content = words[0].children[1];
    let cnt = 0;
    img.setAttribute('src', articlesArr[cnt]['urlToImage']);
    link.setAttribute('href', articlesArr[cnt]['url']);
    title.innerHTML = articlesArr[cnt]['title'];
    content.innerHTML = articlesArr[cnt]['description'];
    setInterval(function () {
        cnt++;
        cnt %= 5;
        img.setAttribute('src', articlesArr[cnt]['urlToImage']);
        link.setAttribute('href', articlesArr[cnt]['url']);
        title.innerHTML = articlesArr[cnt]['title'];
        content.innerHTML = articlesArr[cnt]['description'];
    }, 2000);
}

// ================================================ Search.js =================================================

// ------------------------------------------------ Default Date ----------------------------------------------
function setDefaultDate() {
    let today = new Date();
    let oneWkBefore = new Date(today - 7*24*3600*1000);
    let day1 = "";
    let day2 = "";
    let month1 = "";
    let month2 = "";
    if(today.getMonth()<10){
        month2 = "0"+(today.getMonth()+1);
    } else {
        month2 = today.getMonth()+1;
    }
    if(oneWkBefore.getMonth()<10){
        month1 = "0"+(oneWkBefore.getMonth()+1);
    } else {
        month1 = oneWkBefore.getMonth()+1;
    }
    if(today.getDate()<10){
        day2 = "0"+today.getDate();
    } else {
        day2 = today.getDate();
    }
    if(oneWkBefore.getDate()<10){
        day1 = "0"+oneWkBefore.getDate();
    } else {
        day1 = oneWkBefore.getDate();
    }
    let dateToday = today.getFullYear() + "-" + month2 + "-" + day2;
    let dateOneWk = oneWkBefore.getFullYear() + "-" + month1 + "-" + day1;
    document.getElementById('end-time').setAttribute('value', dateToday.toString());
    document.getElementById('start-time').setAttribute('value', dateOneWk.toString());
}

setDefaultDate();

// ------------------------------------------------ Source Getter ----------------------------------------------
var map = {};
function createSrc(jsonFile) {
    let mySelect = document.getElementById('select-src');
    let html = "";
    let len = jsonFile.length;
    mySelect.innerHTML = html;
    html = html + '<option>All</option>';
    if (len > 10) len = 10;
    for (let i=0;i<len;i++) {
        html = html + '<option>' + jsonFile[i]['name'] + '</option>';
    }
    mySelect.innerHTML = html;
}

// for mapping the relationship between Name and Id
function mapIdName(jsonFile) {
    let map = {};
    let len = jsonFile.length;
    if (len > 10) len = 10;
    for (let i=0;i<len;i++){
        if (! map.hasOwnProperty(jsonFile[i]['name'])) {
            map[jsonFile[i]['name']] = jsonFile[i]['id'];
        }
    }
    return map;
}

// obtain the default source when category is all
function defaultSrc() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL + 'source', true);
    xhr.onload = function(e) {
        if(this.status == 200||this.status == 304){
                let jsonFileS = JSON.parse(xhr.response);
                // console.log(jsonFileS);
                createSrc(jsonFileS['source']);
                map = mapIdName(jsonFileS['source']);
                // console.log(map);
        }
    };
    xhr.send();
}

// obtain corresponding source when category is changed
function updateSrc() {
    let xhr = new XMLHttpRequest();
    let mySelect = document.getElementById('select-cat');
    let index = mySelect.selectedIndex;
    let category = mySelect.options[index].value;
    if (category == "All") {
        defaultSrc();
        return;
    }
    let upFile = {
        "category": category
    }
    xhr.open('POST', URL +'source', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(upFile));
    xhr.onload = function(e) {
        if(this.status == 200||this.status == 304){
                let response = JSON.parse(xhr.response);
                console.log(response);
                createSrc(response['source']);
                map = mapIdName(response['source']);
                console.log(map);
        }
    };

}

// ------------------------------------------------ Clear Button ----------------------------------------------
function clearContent() {
    let cardBody = document.getElementById('card-body');
    cardBody.innerHTML = "<p></p>";
}

// ------------------------------------------------ Date Error Check ----------------------------------------------
function dateError(startTime, endTime) {
     startTime = startTime.replace(/\-/g,'/');
     endTime = endTime.replace(/\-/g,'/');
     let dateS = Date.parse(startTime);
     let dateE = Date.parse(endTime);
     if (dateE < dateS) {
         return true;
     }
     return false;
}

// ------------------------------------------------ Return Search Results ----------------------------------------------
let articlesArr = [];
let descriptionWord = [];

function uploadData() {
    let xhr = new XMLHttpRequest();
    // obtain 'source' from document
    let mySelect = document.getElementById('select-src');
    let index = mySelect.selectedIndex;
    let source = mySelect.options[index].value;
    if (source == 'All') {
        source = 'All';
    } else {
        source = map[source];
    }
    // obtain 'keyword' from document
    let keyword = document.getElementById('keyword').value;
    if (keyword == "") return;
    // obtain 'time' from document
    let startTime = document.getElementById('start-time').value;
    let endTime = document.getElementById('end-time').value;
    if (dateError(startTime, endTime)){
        alert("Incorrect Time");
        return;
    }
    let upFile = {
        "keyword": keyword,
        "source": source,
        "startTime": startTime,
        "endTime": endTime
    };
    xhr.open('POST', URL + 'search', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(upFile));
    xhr.onload = function () {
        if(this.status == 200||this.status == 304){
            let response = JSON.parse(xhr.response);
            articlesArr = getResponseData(response);
            console.log(articlesArr);
            for (let i=0;i<articlesArr.length;i++) {
                let de = articlesArr[i]['description'].slice(0,71);
                for (let j=de.length-1;j>=0;j--) {
                    if (de[j] == " ") {
                        descriptionWord.push(de.slice(0, j));
                        break;
                    }
                }
            }
            displayResults(0, 5, true, articlesArr);
        }
    }
}

function getResponseData(jsonFile) {
    // check error if returned json file only contains errorMsg
    if (jsonFile.hasOwnProperty('errorMsg')) alert(jsonFile["errorMsg"]);
    return  getArticlesArrT('all', 15,  jsonFile);
}

// ------------------------------------------------ Display Results ----------------------------------------------
// for creating all result cards using a loop
function addResultCards(numBegin, numEnd, array) {
    let div = document.getElementById('card-body');
    let html = div.innerHTML;
    for (let i=numBegin;i<numEnd;i++) {
        let imgSrc = array[i]['urlToImage'];
        let title = array[i]['title'];
        // let description = array[i]['description'];
        html = html + '<div class="card-ele" id="img' + i + '" onclick="displayDetails(this)"><div>' +
            '<img class="pic" src=' + imgSrc + '></div>' +
            '<div class="intro1"><h3><b>' + title + '</b></h3>' +
            '<p>' + descriptionWord[i] + '...</p></div></div>';
    }
    div.innerHTML = html;
}

// when submitting the form, display all results on page
function displayResults(numBegin, numEnd, flag, arrVal){
    let div = document.getElementById('card-body');
    if (flag) {
        div.innerHTML = "";
        let len = arrVal.length;
        console.log(arrVal);
        if (len == 0) {
            div.innerHTML = '<p style="margin:25px auto;text-align: center;"><b>No Result</b></p>';
            return;
        } else {
            if (len <= 5) {
                numEnd = len;
                addResultCards(numBegin,numEnd,arrVal);
                return;
            } else {
                addResultCards(numBegin,numEnd,arrVal);
                div.innerHTML = div.innerHTML +
                    '<button type="button" onclick="show(5,15,\'Show Less\')" ' + 'class="showBtn">Show More</button>';
            }
        }
    }
    // case 2: 5 < length < 15
    if (!flag && arrVal.length < numEnd) {
            numEnd = arrVal.length;
    }
    if (numBegin == 0 && flag == false) {
        console.log('if here')
        div.innerHTML = "";
        addResultCards(numBegin,numEnd,arrVal);
        div.innerHTML = div.innerHTML +
            '<button type="button" onclick="show(5,15,\'Show Less\')" class="showBtn">Show More</button>';
    } else if (numBegin != 0 ){
        console.log('else if here')
        addResultCards(numBegin,numEnd,arrVal);
    }
}

// when clicking show more aor show less, display more or less results
function show(numBegin, numEnd, btnValue) {
    let div = document.getElementById('card-body');
    if (btnValue == 'Show Less'){
        // document.getElementById('showMore').style.display = "none";
        let lastSecondChild = div.children[div.children.length-1];
        div.removeChild(lastSecondChild);
        displayResults(numBegin, numEnd, false, articlesArr);
        let html = div.innerHTML;
        html = html + '<button type="button" onclick="show(0,5,\'Show More\')" class="showBtn">Show Less</button>';
        div.innerHTML = html;
    } else {
        displayResults(numBegin, numEnd, false, articlesArr);
    }
}

// ------------------------------------------------ Display Detailed Cards ----------------------------------------------
// display details of clicked cards. When a card is clicked, a new detailed card will be created and the
// original one will be hidden
function displayDetails(cur) {
    // obtain the id of the clicked card
    let id = parseInt(cur.id.slice(3));
    let curCard = document.getElementById('img'+id);
    let imgSrc = articlesArr[id]['urlToImage'];
    let title = articlesArr[id]['title'];
    let author = articlesArr[id]['author'];
    let url = articlesArr[id]['url'];
    let description = articlesArr[id]['description'];
    let source = articlesArr[id]['source']['name'];
    let date = articlesArr[id]['publishedAt'].slice(5,7) + '/' + articlesArr[id]['publishedAt'].slice(8,10)+
                '/' + articlesArr[id]['publishedAt'].slice(0,4);
    let cardDetail = document.createElement('div');
    cardDetail.setAttribute('class', 'card-detail');
    cardDetail.setAttribute('id', 'img-detail' + id);
    cardDetail.innerHTML = '<div><img class="pic" src='+ imgSrc+'></div>' +
                            '<div class="intro2">' +
                                '<h3><b>' + title + '</b></h3>' +
                                '<p><b>Author: </b>' + author + '</p>'+
                                '<p><b>Source: </b>' + source + '</p>'+
                                '<p><b>Date: </b>' + date + '</p>'+
                                '<p>' + description + '</p>'+
                                '<div><a href="' + url + '" target="_blank">' +
                                '<u>See Original Post</u></a></div>' +
                                '</div>' +
                                '<div id="time-sign" onclick="collapseDetails(this)"><div>&times</div></div>';
    curCard.parentNode.insertBefore(cardDetail, curCard);
    cur.style.display = "none";
}

// when clicking the cross sign, the current card will be collapsed and its original card will be displayed
function collapseDetails(cur) {
    let id = parseInt(cur.parentNode.id.slice(10));
    let curCard = document.getElementById('img'+id);
    curCard.style.display = '';
    cur.parentNode.style.display = 'none';
}







