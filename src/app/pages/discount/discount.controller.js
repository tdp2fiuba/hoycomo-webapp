(function () {
    'use strict';

    angular.module('BlurAdmin.pages.discount')
        .controller('DiscountController', DiscountController);

    /** @ngInject */
    function DiscountController($scope, $window, toastr, toastrConfig, DiscountService, $filter, $uibModal) {
        $scope.loading = true;
        $scope.emptyMessage = "Error al cargar el descuento";
        $scope.discount = null;
        $scope.processing = false;

        $scope.toastOptions = {
            autoDismiss: false,
            positionClass: 'toast-top-right',
            type: 'error',
            timeOut: '3000',
            extendedTimeOut: '3000',
            closeButton: true,
            tapToDismiss: true,
            progressBar: false,
            newestOnTop: true,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false,
            allowHtml: true
        };

        $scope.updateStoreDiscount = function () {
            const newDiscount = parseFloat($("#discount").val());
            if (isNaN(newDiscount) || newDiscount < 0 || newDiscount > 100){
                toastr["error"]("Debe ingresar un numero de 0 a 100", "Descuento inválido");
                return;
            }
            $scope.processing = true;
            DiscountService.updateDiscount(newDiscount)
                .then(discount => {
                    toastr.success("", "Descuento actualizado!");
                    $scope.discount = discount;
                    $scope.processing = false;
                })
                .catch(err => {
                    console.log(err);
                    toastr["error"]("Intente nuevamente más tarde", "Error");
                    $scope.processing = false;
                })
        };

        $scope.deleteDiscount = function () {
            if ($scope.discount != 0){
                DiscountService.deleteDiscount()
                    .then(discount => {
                        toastr.success("", "Descuento borrado!");
                        $scope.discount = discount;
                    })
                    .catch(err => {
                        console.log(err);
                        toastr["error"]("Intente nuevamente más tarde", "Error");
                    })
            } else {
                toastr.success("", "Descuento borrado!");
            }
        };

        $scope.deleteStoreDiscount = function () {
            $uibModal.open({
                animation: true,
                template: '<div class="modal-content">\n' +
                '    <div class="modal-header">\n' +
                '        <button type="button" class="close" ng-click="$dismiss()" aria-label="Close">\n' +
                '            <em class="ion-ios-close-empty sn-link-close"></em>\n' +
                '        </button>\n' +
                '        <h4 class="modal-title" id="myModalLabel">¿Borrar descuento?</h4>\n' +
                '    </div>\n' +
                '    <div class="modal-body">\n' +
                '    </div>\n' +
                '    <div class="modal-footer">\n' +
                '        <button type="button" class="btn btn-primary" ng-click="deleteDiscount();$dismiss()">Aceptar</button>\n' +
                '        <button type="button" class="btn btn-primary" ng-click="$dismiss()">Cancelar</button>\n' +
                '    </div>\n' +
                '</div>',
                size: 'md',
                scope: $scope
            });
        };

        function getDiscount() {
            $scope.loading = true;
            DiscountService.getDiscount()
                .then(discount => {
                    if (discount == undefined){
                        $scope.emptyMessage = "Error al cargar el descuento";
                        return;
                    }

                    $scope.discount = discount;
                })
                .catch(err => {
                    console.log(err);
                    $scope.emptyMessage = "Error interno al cargar el descuento del comercio";
                })
                .then( function(){
                    $scope.loading = false;
                })
        }
        getDiscount();
    }

})();