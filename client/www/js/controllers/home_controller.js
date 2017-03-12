(function() {
  'use strict';

  angular.module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope','api', 'cuisine', 'mapper', 'category', 'keyword', '$timeout'];

  function HomeController($scope, api, cuisine, mapper, category, keyword, $timeout) {

    var watsonParams = {
    	text: ""
    };

    $scope.isSearched = false;

    var zomatoParams = {
      q : "",
      cuisines : "",
      category : ""
    };

    var url = api.watsonBaseUrl;

    var zomatoUrl = api.zomatoBaseUrl;

    $scope.loadingText = "";

    $scope.search = function () {

      watsonParams.text = $scope.nlpSearch;

      api.post(url, watsonParams).then(function (result) {
        console.log(result);
        var categories = result.data.categories;
        var concepts = result.data.concepts;
        var keywords = result.data.keywords;

        var emotions = result.data.emotions;

        var messages = [
          "Let's make your mood better.",
          "Let's elevate your mood.",
          "Let's see if we can make you happy."
        ];

        if( (parseFloat(emotions.joy) > parseFloat(emotions.anger)) && (parseFloat(emotions.joy) > parseFloat(emotions.disgust)) && (parseFloat(emotions.joy) > parseFloat(emotions.sadness))){
          $scope.loadingText = "You seem to be in a good mood.\nLet's make it better.";
        }

        if( (parseFloat(emotions.sadness) > parseFloat(emotions.joy)) || (parseFloat(emotions.anger) > parseFloat(emotions.joy)) || (parseFloat(emotions.disgust) > parseFloat(emotions.joy))){
          $scope.loadingText = messages[Math.floor(Math.random()*messages.length)];
        }
        $scope.isLoading = true;
        keyword.getKeys(keywords).then(function(keyList){
          mapper.getKeys(categories).then(function(mapObj){
            console.log(mapObj);
            var categoryIds = [];
            var cuisineIds = [];

            if(mapObj.cuisine === true){

              category.getCategoryIdsByMap(mapObj).then(function(idList){
                categoryIds = idList;
                cuisine.getCuisineIdsByKeyword(mapObj.cuisine_name).then(function(cuisineIdList) {
                  cuisineIds = cuisineIdList;
                  console.log(categoryIds);
                  console.log(cuisineIds);

                  zomatoParams.category = categoryIds.toString();
                  zomatoParams.cuisines = cuisineIds.toString();
                  zomatoParams.q = keyList.toString();
                  if(mapObj.dance === true){
                    zomatoParams.q = "Pubbing";
                  }else if(categoryIds.length === 3 && categoryIds.indexOf(3) > -1 && categoryIds.indexOf(11) > -1 && categoryIds.indexOf(14) > -1 ){
                    zomatoParams.q = "Pubs";
                  }
                  api.zomatoPost(zomatoUrl, zomatoParams).then(function (result) {
                    $scope.isSearched = true;
                    $scope.restaurantList = result.data.restaurants;
                    zomatoParams = {
                      q : "",
                      cuisines : "",
                      category : ""
                    };
                    console.log(result);
                    $timeout(function () {
                      $scope.isLoading = false;
                      $scope.loadingText = "";
                    }, 5000);
                  }, function(error) {
                    console.log(error);
                    $timeout(function () {
                      $scope.isLoading = false;
                      $scope.loadingText = "";
                    }, 5000);
                  });
                });
              });
            }else{
              category.getCategoryIdsByMap(mapObj).then(function(idList){
                categoryIds = idList;
                console.log(categoryIds);
                zomatoParams.category = categoryIds.toString();

                if(mapObj.dance === true){
                  zomatoParams.q = "Pubbing";
                }else if(categoryIds.length === 3 && categoryIds.indexOf(3) > -1 && categoryIds.indexOf(11) > -1 && categoryIds.indexOf(14) > -1 ){
                  zomatoParams.q += "Pubs";
                }else{
                  zomatoParams.q += ", "+keyList.toString();
                }

                api.zomatoPost(zomatoUrl, zomatoParams).then(function (result) {
                  console.log(result);
                  zomatoParams = {
                    q : "",
                    cuisines : "",
                    category : ""
                  };
                  $scope.isSearched = true;
                  $scope.restaurantList = result.data.restaurants;

                  $timeout(function () {
                    $scope.isLoading = false;
                    $scope.loadingText = "";
                  }, 5000);
                }, function(error) {
                  console.log(error);

                  $timeout(function () {
                    $scope.isLoading = false;
                    $scope.loadingText = "";
                  }, 5000);
                });
              });
            }

          });
        });

      },function (error) {
        console.log("Error");

        $timeout(function () {
          $scope.isLoading = false;
        }, 3000);
      });

    };

  }

}());
