(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu', [])
        .config(routeConfig)
        //.constant('SERVER_URL','https://hoycomo-server.herokuapp.com');
        .constant('SERVER_URL','http://localhost:8080');

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('menu', {
                url: '/menu',
                title: 'Mi Menú',
                templateUrl: 'app/pages/menu/menu.html',
                controller: 'MenuController',
                provider: 'MenuController',
                sidebarMeta: {
                    icon: 'ion-pizza',
                    order: 1
                }
            });
    }

})();