(function() {
    'use strict';
    
    angular.module('sharedServices').provider('MenuService', function () {

        this.$get = function ($http) {
            var addItem = function (menuItem) {
                console.error("REPLACE WITH CALL TO API");
                /*
                return $http({
                        method: 'POST',
                        url: 'http://localhost:8080/api/menu',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: menuItem
                });
                */
            };
        
            return {
                addItem: addItem
            };
        };
    });

})();