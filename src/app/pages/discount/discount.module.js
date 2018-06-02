(function () {
    'use strict';

    angular.module('BlurAdmin.pages.discount', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('discount', {
                url: '/discount',
                title: 'Promociones',
                templateUrl: 'app/pages/discount/discount.html',
                controller: 'DiscountController',
                provider: 'DiscountController',
                sidebarMeta: {
                    icon: 'ion-ios-toggle',
                    order: 1
                }
            });
    }

})();