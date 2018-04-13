(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu')
        .controller('MenuController', MenuController)
        .directive("fileinput", [function() {
            return {
                scope: {
                    fileinput: "=",
                    filepreview: "="
                },
                link: function(scope, element, attributes) {
                    element.bind("change", function(changeEvent) {
                        scope.fileinput = changeEvent.target.files[0];
                        var reader = new FileReader();
                        reader.onload = function(loadEvent) {
                            scope.$apply(function() {
                                scope.filepreview = loadEvent.target.result;
                            });
                        };
                        reader.readAsDataURL(scope.fileinput);
                    });
                }
            }
        }]);

    /** @ngInject */
    function MenuController($scope, $window, toastr, toastrConfig, MenuService) {
        $scope.isSubmitted = false;
        $scope.itemName = null;
        $scope.itemPrice = null;
        $scope.itemDiscount = 0;
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
            var self = this;
            self.isSubmitted = true;
            self.toastOptions.msg = null;

            var item = {
                name: self.itemName,
                price: self.itemPrice,
                discount: self.itemDiscount,
                pictures: self.filepreview
            };

            MenuService.addItem(item)
                .then(function (res) {
                    self.isSubmitted = false;
                    $window.location.href = $window.location.origin + "/";
                })
                .catch(function (err) {
                    self.isSubmitted = false;
                    if (err.data) {
                        self.toastOptions.msg = err.data.message;
                    } else {
                        self.toastOptions.msg = "Hubo un error contactándose con el servidor. Intente nuevamente..."
                    }
                    angular.extend(toastrConfig, self.toastOptions);
                    toastr["error"](self.toastOptions.msg, self.toastOptions.title);
                });
        };
    }

})();