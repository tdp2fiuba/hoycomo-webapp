(function() {
    'use strict';
    
    angular.module('BlurAdmin.pages.menu').provider('MenuService', function () {

        this.$get = function ($http) {

            const BASE_URL = 'https://hoycomo-server.herokuapp.com/api';

            const getItems = function () {
                let storeId = 1;    // TODO: Retrieve actual storeId from credentialsService.

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
                let storeId = 1;    // TODO: Retrieve actual storeId from credentialsService.

                menuItem.store_id = storeId;
                let data = {
                    dish: menuItem,
                    pictures: menuItem.pictures     // TODO: This should be inside dish object.
                };

                const url = BASE_URL + '/dish';
                return $http({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: data
                });
            };
        
            return {
                getItems: getItems,
                addItem: addItem
            };
        };
    });

})();