(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pedidos')
        .controller('PedidoCtrl', PedidoCtrl);

    /** @ngInject */
    function PedidoCtrl($stateParams, mailMessages) {
        var vm = this;
        vm.mail = mailMessages.getMessageById($stateParams.id);
        vm.label = $stateParams.label;
    }

})();
