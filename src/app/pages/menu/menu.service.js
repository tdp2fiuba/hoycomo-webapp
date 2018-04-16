(function() {
    'use strict';
    
    angular.module('BlurAdmin.pages.menu').provider('MenuService', function () {

        this.$get = function ($http, credentialsService) {

            const BASE_URL = 'https://hoycomo-server.herokuapp.com/api';

            const getItems = function () {
                let storeId = credentialsService.getUser();
                const url = BASE_URL + '/dish/store/' + storeId;
                return $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            };

            const addItem = function (menuItem) {
                let storeId = credentialsService.getUser();
                menuItem.store_id = storeId;

                const url = BASE_URL + '/dish';
                return $http({
                        method: 'POST',
                        url: url,
                        headers: {
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