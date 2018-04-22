(function () {
    'use strict';

    angular.module('BlurAdmin').service('foodTypesService', foodTypesService);

    function foodTypesService($http) {
        var getAll = function () {
            return $http({
                method: 'GET',
                url: 'http://localhost:8080/api/foodTypes/',
                // url: 'https://hoycomo-server.herokuapp.com/api/foodTypes/',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }

        return {
            getAll: getAll
        };
    }
})();