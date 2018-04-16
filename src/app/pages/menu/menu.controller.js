(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu')
        .controller('MenuController', MenuController)
        .directive("fileinput", ['$parse', function($parse) {
            return {
                scope: {
                    fileinput: "=",
                    filepreviews: "="
                },
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileinput);
                    var isMultiple = attrs.multiple;
                    var modelSetter = model.assign;
                    element.bind("change", function(changeEvent) {
                        var values = [];
                        angular.forEach(element[0].files, function (item) {
                            values.push(item);
                        });
                        scope.$apply(function () {
                            if (isMultiple) {
                                modelSetter(scope, values);
                            } else {
                                modelSetter(scope, values[0]);
                            }
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
        $scope.menu = [];
        $scope.noItems = true;
        $scope.newItemFormActive = false;

        $scope.isSubmitted = false;
        $scope.itemName = null;
        $scope.itemPrice = null;
        $scope.itemDiscount = null;
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

        $scope.showNewItemForm = function (show) {
            $scope.newItemFormActive = show;
        };

        $scope.resetNewItemForm = function () {
            $scope.filepreviews = [];
            document.getElementById("newMenuItemForm").reset();
        };

        $scope.retrieveMenu = function () {
            let self = this;
            MenuService.getItems()
                .then(function (res) {
                    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                        self.noItems = false;
                        self.menu = res.data;
                    }
                })
                .catch(function (err) {
                    self.noItems = true;
                    if (err.data) {
                        self.toastOptions.msg = err.data.message;
                    } else {
                        self.toastOptions.msg = "Hubo un error contactándose con el servidor. Intente nuevamente..."
                    }
                    angular.extend(toastrConfig, self.toastOptions);
                    toastr["error"](self.toastOptions.msg, self.toastOptions.title);
                });
        };

        $scope.handleSubmit = function () {
            var self = this;
            self.isSubmitted = true;
            self.toastOptions.msg = null;

            var item = {
                name: self.itemName,
                price: self.itemPrice,
                discount: self.itemDiscount | 0,
                pictures: self.filepreviews
            };

            MenuService.addItem(item)
                .then(function (res) {
                    self.isSubmitted = false;
                    self.resetNewItemForm();

                    self.noItems = false;
                    self.retrieveMenu();
                    self.showNewItemForm(false);
                })
                .catch(function (err) {
                    self.isSubmitted = false;
                    self.resetNewItemForm();

                    self.showNewItemForm(false);
                    if (err.data) {
                        self.toastOptions.msg = err.data.message;
                    } else {
                        self.toastOptions.msg = "Hubo un error contactándose con el servidor. Intente nuevamente..."
                    }
                    angular.extend(toastrConfig, self.toastOptions);
                    toastr["error"](self.toastOptions.msg, self.toastOptions.title);
                });
        };

        $scope.retrieveMenu();
    }

})();