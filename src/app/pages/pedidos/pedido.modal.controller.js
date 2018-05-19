(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pedidos')
        .controller('PedidoModalCtrl', PedidoModalCtrl);

    function PedidoModalCtrl($scope) {
        this.oldState = $scope.$resolve.oldState;
        this.newState = $scope.$resolve.newState;
        if (this.newState === "Cancelado") {
            this.cancelled = true;
            this.okClass = "danger";
        } else {
            this.cancelled = false;
            this.okClass = "primary";
        }
        this.ok = function () {
            $scope.$close();
        }

        this.cancel = function () {
            $scope.$dismiss();
        }
    };

})();