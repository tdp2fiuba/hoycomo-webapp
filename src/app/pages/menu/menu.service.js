(function() {
    'use strict';
    
    angular.module('BlurAdmin.pages.menu').provider('MenuService', function () {

        this.$get = function ($http) {

            // TODO: Delete this static array.
            let menu = [];

            const getItems = function () {
                console.error("REPLACE WITH CALL TO API FOR RETRIEVING MENU");
                // TODO: Implement call to API.
                return Promise.resolve(menu);
            };

            const addItem = function (menuItem) {
                console.error("REPLACE WITH CALL TO API FOR SAVING NEW ITEM IN MENU");
                // TODO: Implement call to API.
                menu.push(menuItem);
                return Promise.resolve(menuItem);

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
                getItems: getItems,
                addItem: addItem
            };
        };
    });

})();