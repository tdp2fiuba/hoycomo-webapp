(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reports', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('reports', {
                url: '/reportes',
                template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'Reportes',
                sidebarMeta: {
                    icon: 'ion-stats-bars',
                    order: 800,
                },
            })
            .state('reports.leadTime', {
                url: '/tiempoEspera',
                templateUrl: 'app/pages/reports/leadTime/leadTime.html',
                title: 'Tiempo de espera',
                controller: 'leadTimeController',
                sidebarMeta: {
                    order: 0,
                },
            });
    }
})();
