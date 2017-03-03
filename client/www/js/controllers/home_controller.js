(function() {
  'use strict';

  angular.module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope','api'];

  function HomeController($scope, api) {

    var watsonParams = {
    	text: ""
    };

    var url = api.watsonBaseUrl;

    $scope.search = function () {
      watsonParams.text = $scope.nlpSearch;

      api.post(url, watsonParams).then(function (result) {
        console.log(result);
      },function (error) {
        console.log("Error");
      });

    };

  }

}());
