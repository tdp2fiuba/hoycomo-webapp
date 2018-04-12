(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu')
        .controller('MenuController', MenuController);

    /** @ngInject */
    function MenuController($scope, toastr, toastrConfig) {
        $scope.isSubmitted = false;
        $scope.itemName = null;
        $scope.itemPrice = null;
        $scope.toastOptions = {
            autoDismiss: false,
            positionClass: 'toast-top-left',
            type: 'error',
            timeOut: '2000',
            extendedTimeOut: '2000',
            allowHtml: false,
            closeButton: false,
            tapToDismiss: true,
            progressBar: false,
            newestOnTop: true,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false,
            title: "Error en la carga del nuevo ítem para el menú"
        };

        $scope.handleSubmit = function () {
            $scope.isSubmitted = true;
            $scope.toastOptions.msg = null;

            // TODO: Implement!
        }
    }

})();