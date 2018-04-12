(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu')
        .controller('MenuController', MenuController);

    /** @ngInject */
    function MenuController($scope, $window, toastr, toastrConfig, MenuService) {
        $scope.isSubmitted = false;
        $scope.itemName = null;
        $scope.itemPrice = null;
        $scope.itemDiscount = 0;
        $scope.itemPictures = [];
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

            var item = {
                name: $scope.itemName,
                price: $scope.itemPrice,
                discount: $scope.itemDiscount,
                pictures: $scope.itemPictures
            };
            MenuService.addItem(item)
                .then(function (res) {
                    $scope.isSubmitted = false;
                    $window.location.href = $window.location.origin + "/";
                })
                .catch(function (err) {
                    $scope.isSubmitted = false;
                    if (err.data) {
                        $scope.toastOptions.msg = err.data.message;
                    } else {
                        $scope.toastOptions.msg = "Hubo un error contactándose con el servidor. Intente nuevamente..."
                    }
                    angular.extend(toastrConfig, $scope.toastOptions);
                    toastr["error"]($scope.toastOptions.msg, $scope.toastOptions.title);
                });
        }
    }

})();