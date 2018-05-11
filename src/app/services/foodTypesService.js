(function () {
    'use strict';

    angular.module('BlurAdmin').service('foodTypesService', foodTypesService);

    function foodTypesService($http,SERVER_URL) {
        var getAll = function () {
            return $http({
                method: 'GET',
                //url: SERVER_URL + '/api/foodTypes/',
                url: 'https://hoycomo-server.herokuapp.com/api/foodTypes/',
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