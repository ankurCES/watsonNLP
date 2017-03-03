var express = require('express');
var app = express();
var requestHttp = require('request');
var q = require('q');
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Lets define a port we want to listen to
var PORT=8080;


var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

var options = {
    url: '',
    method: 'POST',
    headers: headers,
    form: {
      text: ''
    }
};

var KEYWORDS_URL = 'https://alchemy-language-demo.mybluemix.net/api/keywords';
var CONCEPTS_URL = 'https://alchemy-language-demo.mybluemix.net/api/concepts';
var ENTITIES_URL = 'https://alchemy-language-demo.mybluemix.net/api/entities';
var CATEGORIES_URL = 'https://alchemy-language-demo.mybluemix.net/api/taxonomy';
var SENTIMENT_URL = 'https://alchemy-language-demo.mybluemix.net/api/sentiment';
var EMOTION_URL = 'https://alchemy-language-demo.mybluemix.net/api/emotion';


//We need a function which handles requests and send response
function handleRequest(req, res, type){
  var defer = q.defer();

  if(type == 'KEY'){
    options.url = KEYWORDS_URL;
  }

  if(type == 'ENT'){
    options.url = ENTITIES_URL;
  }

  if(type == 'CON'){
    options.url = CONCEPTS_URL;
  }

  if(type == 'CAT'){
    options.url = CATEGORIES_URL;
  }

  if(type == 'EMO'){
    options.url = EMOTION_URL;
  }

  if(type == 'SNT'){
    options.url = SENTIMENT_URL;
  }

  requestHttp(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var json_body = JSON.parse(body);
          defer.resolve(json_body);
      }else{
        defer.reject(error);
      }
  });

  return defer.promise;
}

app.post('/analyse', function (req, res) {

  var searchNLP = req.body.searchQuery;
  var responseData = {
    keywords: {},
    concepts: {},
    entities: {},
    categories: {},
    emotions: {},
    sentiments: {}
  };
  var promises = [];

  options.form.text = searchNLP;

  promises.push(handleRequest(req, res, 'KEY'));
  promises.push(handleRequest(req, res, 'ENT'));
  promises.push(handleRequest(req, res, 'CON'));
  promises.push(handleRequest(req, res, 'CAT'));
  promises.push(handleRequest(req, res, 'EMO'));
  promises.push(handleRequest(req, res, 'SNT'));

  q.all(promises).then(function (response) {
    responseData.keywords = response[0].keywords;
    responseData.entities = response[1].entities;
    responseData.concepts = response[2].concepts;
    responseData.categories = response[3].taxonomy;
    responseData.emotions = response[4].docEmotions;
    responseData.sentiments = response[5].docSentiment;

    res.send(responseData);
  })
  .catch(function(error){
    res.send({error: "Error"});
  });
});

app.listen(PORT, function () {
  console.log('Example app listening on port '+PORT+'!');
});
