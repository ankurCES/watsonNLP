(function() {
    'use strict';

    angular
        .module('app')
        .service('keyword', keyword);

    keyword.$inject = ['$q', '$http', '$rootScope'];

    function keyword($q, $http, $rootScope) {

      var getKeys = function (keywordArray) {
        var deferred = $q.defer();

        var keys = [];

        angular.forEach(keywordArray, function (keywordObj, key) {
          if(parseFloat(keywordObj.relevance) > 0.70){
            keys.push(keywordObj.text);
          }
        });

        deferred.resolve(keys);

        return deferred.promise;
      };

      return {
        getKeys: getKeys
      };
    }
})();
