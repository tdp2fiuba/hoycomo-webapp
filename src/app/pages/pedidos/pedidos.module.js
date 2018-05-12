(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pedidos', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('pedidos', {
                url: '/pedidos',
                title: 'Mis Pedidos',
                templateUrl: 'app/pages/pedidos/pedidos.html',
                controller: 'PedidosController',
                provider: 'PedidosController',
                sidebarMeta: {
                    icon: 'ion-android-cart',
                    order: 1
                }
            })
            .state('pedidos.pedido', {
            url: '/:id',
            templateUrl: 'app/pages/pedidos/pedido/pedido.html',
            title: 'Pedido',
            controller: "PedidoCtrl"
        });
    }

})();