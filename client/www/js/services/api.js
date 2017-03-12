(function() {
    'use strict';

    angular
        .module('app')
        .service('api', api);

    api.$inject = ['$q', '$http', '$rootScope'];

    function api($q, $http, $rootScope) {
        var get = function(url, params) {
          var deferred = $q.defer();

          $http({
            url: url,
            method: 'GET',
            params: params
          }).then(function(response) {

            deferred.resolve(response);
          }, function(error) {
            deferred.reject(error);
          });

          return deferred.promise;
        };

        var post = function(url, params) {
          var deferred = $q.defer();

          var headers = {
            "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
          };

          $http({
            url: url,
            method: 'POST',
            headers: headers,
            data: $.param({searchQuery: params.text})
          }).then(function(response) {
            deferred.resolve(response);
          }, function(error) {
            deferred.reject(error);
          });

          return deferred.promise;
        };

        var zomatoPost = function(url, params) {
          var deferred = $q.defer();

          var headers = {
            "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
          };

          $http({
            url: url,
            method: 'POST',
            headers: headers,
            data: $.param({
              entity_id : 7,
              entity_type : "",
              q : params.q,
              cuisines : params.cuisines,
              establishment_type : "",
              category : params.category
            })
          }).then(function(response) {
            deferred.resolve(response);
          }, function(error) {
            deferred.reject(error);
          });

          return deferred.promise;
        };


        var zomatoBaseUrl = 'http://127.0.0.1:3000/zomatoSearch';

        var watsonBaseUrl = 'http://127.0.0.1:8080/analyse';

        return {
          zomatoBaseUrl: zomatoBaseUrl,
          watsonBaseUrl: watsonBaseUrl,
          get: get,
          post: post,
          zomatoPost: zomatoPost
        };
    }
})();
