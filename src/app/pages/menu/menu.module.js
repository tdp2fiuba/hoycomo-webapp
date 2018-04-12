(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('menu', {
                url: '/menu',
                title: 'Mi Menú',
                templateUrl: 'app/pages/menu/menu.html',
                controller: 'MenuController',
                sidebarMeta: {
                    order: 0
                }
            });
    }

})();