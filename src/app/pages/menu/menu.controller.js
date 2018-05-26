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
    function MenuController($scope, $window, toastr, toastrConfig, MenuService, $uibModal) {
        $scope.menu = [];
        $scope.noItems = true;
        $scope.newItemFormActive = false;

        $scope.isSubmitted = false;
        $scope.itemName = null;
        $scope.itemDescription = null;
        $scope.itemPrice = null;
        $scope.itemDiscount = null;
        $scope.filepreviews = [];
        $scope.itemGarnishes = null;
        $scope.suitableForCeliac = false;
        $scope.suitableForDiabetic = false;
        $scope.suitableForVegan = false;
        $scope.suitableForVegetarian = false;
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

        $scope.setFormScope = function (form) {
            $scope.formScope = form;
        };
        $scope.resetNewItemForm = function () {
            $scope.filepreviews = [];
            $scope.formScope.itemName = null;
            $scope.formScope.itemDescription = null;
            $scope.formScope.itemPrice = null;
            $scope.formScope.itemDiscount = null;
            $scope.formScope.suitableForCeliac = false;
            $scope.formScope.suitableForDiabetic = false;
            $scope.formScope.suitableForVegan = false;
            $scope.formScope.suitableForVegetarian = false;
            $scope.formScope.newMenuItemForm.$setPristine();
            $scope.formScope.newMenuItemForm.$setUntouched();
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
                description: self.itemDescription,
                price: self.itemPrice,
                discount: self.itemDiscount | 0,
                pictures: self.filepreviews.map(base64File => {
                    return {
                        type: base64File.split(',')[0].match(/\/(.*);/)[1],
                        data: base64File
                    }
                }),
                garnishes: self.itemGarnishes ? self.itemGarnishes.split(",") : [],
                celiac: self.suitableForCeliac,
                diabetic: self.suitableForDiabetic,
                vegan: self.suitableForVegan,
                vegetarian: self.suitableForVegetarian
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

        $scope.switchItem = function (disable,item) {
            const modalInstance = $uibModal.open({
                templateUrl: '/app/pages/menu/dishStatus.modal.html',
                controller: 'DishStatusModalCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    disable: disable
                }
            });

            modalInstance.result.then(function () {
                item.processingTransition = true;
                MenuService.switchItem(disable,item.id)
                    .then(() => {
                        item.processingTransition = false;
                        item.disable = disable;
                        toastr.success("El plato fue " + (disable ? "desactivado" : "activado"));
                    })
                    .catch((err) => {
                        console.log(err);
                        let message = "Hubo un error, intenta más tarde";
                        if (err.data && err.data.message) {
                            message = err.data.message;
                        }
                        toastr["error"](message, "Error cambiando el estado del plato");
                        item.processingTransition = false;
                    });
            })
        };

        $scope.retrieveMenu();
    }

})();