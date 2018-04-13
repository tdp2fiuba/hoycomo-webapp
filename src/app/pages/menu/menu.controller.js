(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu')
        .controller('MenuController', MenuController)
        .directive("fileinput", ['$parse', function($parse) {
            return {
                scope: {
                    fileinput: "=",
                    filepreviews: "=",
                    itemFiles: "="
                },
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileinput);
                    var isMultiple = attrs.multiple;
                    var modelSetter = model.assign;
                    element.bind("change", function(changeEvent) {
                        var values = [];
                        angular.forEach(element[0].files, function (item) {
                            var value = {
                                // File Name
                                name: item.name,
                                //File Size
                                size: item.size,
                                //File URL to view
                                url: URL.createObjectURL(item),
                                // File Input Value
                                _file: item
                            };
                            values.push(value);
                        });
                        scope.$apply(function () {
                            if (isMultiple) {
                                modelSetter(scope, values);
                            } else {
                                modelSetter(scope, values[0]);
                            }
                            scope.itemFiles.push(values);
                        });

                        scope.fileinput = changeEvent.target.files;
                        for (let i = 0; i < scope.fileinput.length; i++) {
                            var reader = new FileReader();
                            reader.onload = function(loadEvent) {
                                scope.$apply(function() {
                                    scope.filepreviews.push(loadEvent.target.result);
                                });
                            };
                            reader.readAsDataURL(scope.fileinput[i]);
                        }
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
        $scope.itemFiles = [];
        $scope.filepreviews = [];
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
                pictures: self.itemFiles
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