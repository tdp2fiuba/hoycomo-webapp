(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu', ['ng', 'ngAnimate', 'ngMessages', 'toastr'])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('menu', {
                url: '/menu',
                title: 'Mi Menú',
                templateUrl: 'app/pages/menu/menu.html',
                sidebarMeta: {
                    order: 0
                }
            });
    }

})();