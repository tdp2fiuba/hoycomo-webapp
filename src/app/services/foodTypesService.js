(function () {
    'use strict';

    angular.module('BlurAdmin').service('foodTypesService', foodTypesService);

    function foodTypesService($http) {
        var getAll = function () {
            return $http({
                method: 'GET',
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