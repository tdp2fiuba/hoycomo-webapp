(function() {
    'use strict';
    
    angular.module('BlurAdmin.pages.menu').provider('MenuService', function () {

        this.$get = function ($http, credentialsService, SERVER_URL) {

            const getItems = function () {
                let storeId = credentialsService.getUser();
                const url = SERVER_URL + '/api/dish/store/' + storeId;
                return $http({
                    method: 'GET',
                    url: url,
                    params: {count: 100},
                    headers: {
                        'Authorization': 'Bearer ' + credentialsService.getToken(),
                        'Content-Type': 'application/json'
                    }
                });
            };

            const addItem = function (menuItem) {
                let storeId = credentialsService.getUser();
                menuItem.store_id = storeId;

                const url = SERVER_URL + '/api/dish';
                return $http({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Authorization': 'Bearer ' + credentialsService.getToken(),
                            'Content-Type': 'application/json'
                        },
                        data: menuItem
                });
            };
        
            return {
                getItems: getItems,
                addItem: addItem
            };
        };
    });

})();