(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pedidos')
        .controller('PedidoCtrl', PedidoCtrl);

    /** @ngInject */
    function PedidoCtrl($stateParams,$scope, PedidosService) {

        function getOrder(id){
            PedidosService.getOrder(id)
            .then( order => {
                $scope.order = order;
            })
            .catch(err => {
                console.log("eerro al traer el pedido " +err);
            })
        }

        getOrder($stateParams.id);
        console.log($scope.order);
    }

})();
