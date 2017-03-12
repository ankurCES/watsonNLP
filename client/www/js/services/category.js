(function() {
    'use strict';

    angular
        .module('app')
        .service('category', category);

    category.$inject = ['$q', '$http', '$rootScope'];

    function category($q, $http, $rootScope) {

      var categories = [
        {
          "categories": {
            "id": 1,
            "name": "Delivery",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 2,
            "name": "Dine-out",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 3,
            "name": "Nightlife",
            "alcohol": true,
            "food": true,
            "dance": true
          }
        },
        {
          "categories": {
            "id": 4,
            "name": "Catching-up",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 5,
            "name": "Takeaway",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 6,
            "name": "Cafes",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 7,
            "name": "Daily Menus",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 8,
            "name": "Breakfast",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 9,
            "name": "Lunch",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 10,
            "name": "Dinner",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 11,
            "name": "Pubs & Bars",
            "alcohol": true,
            "food": true,
            "dance": true
          }
        },
        {
          "categories": {
            "id": 12,
            "name": "Premium Delivery",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 13,
            "name": "Pocket Friendly Delivery",
            "alcohol": false,
            "food": true,
            "dance": false
          }
        },
        {
          "categories": {
            "id": 14,
            "name": "Clubs & Lounges",
            "alcohol": true,
            "food": true,
            "dance": true
          }
        }
      ];

      var getCategoryIdsByMap = function (mappingObj) {
        var deferred = $q.defer();

        var matchingIds = [];
        angular.forEach(categories, function (categoryObj, key) {
          var category = categoryObj.categories;

          if(mappingObj.alcohol || (mappingObj.dance && mappingObj.drink)){
            if(category.alcohol === true || category.dance === true){
              matchingIds.push(category.id);
            }
          }else if( !mappingObj.alcohol && !mappingObj.dance && mappingObj.food){
            if(category.alcohol === mappingObj.alcohol || category.food === mappingObj.food){
              matchingIds.push(category.id);
            }
          }
        });

        deferred.resolve(matchingIds);

        return deferred.promise;
      };

      return {
        getCategoryIdsByMap: getCategoryIdsByMap
      };
    }
})();
