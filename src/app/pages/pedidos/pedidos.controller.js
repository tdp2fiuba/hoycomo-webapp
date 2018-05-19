(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pedidos')
        .controller('PedidosController', PedidosController);

    /** @ngInject */
    function PedidosController($scope, $window, toastr, toastrConfig, PedidosService, $filter, $uibModal) {
        $scope.loading = true;
        $scope.emptyMessage = "No hay ningún pedido para tu comercio";
        $scope.orders = [];

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

        $scope.states = [
            { id: 1, status: "TAKEN", text: "Aceptado" },
            { id: 2, status: "PREPARATION", text: "En Preparación" },
            { id: 3, status: "DISPATCHED", text: "Despachado" },
            { id: 4, status: "DELIVERED", text: "Entregado" },
            { id: -1, status: "CANCELLED", text: "Cancelado" },
        ];

        $scope.renderNextState = function (currentStateId) {
            if (currentStateId === -1 || currentStateId === 4) {
                return "";
            }
            return "Pasar a " + this.states.find(function (state) { return state.id === currentStateId + 1; }).text;
        }

        $scope.manageCancel = function (order) {
            var modalInstance = $uibModal.open({
                templateUrl: '/app/pages/pedidos/pedido.modal.html',
                controller: 'PedidoModalCtrl',
                controllerAs: 'ctrl',
                resolve: {
                  oldState: function () {
                      return "";
                  },
                  newState: function () {
                      return "Cancelado";
                  }
                }
            });

            modalInstance.result.then(function () {
                order.processingCancelation = true;
                PedidosService.updateState(order.id, "CANCELLED").then(function () {
                    order.state = processState([{ state: "CANCELLED" }]);
                    order.processingCancelation = false
                }).catch(function (err) {
                    var message = "Hubo un error cancelando el pedido"
                    if (err.data && err.data.message) {
                        message = err.data.message;
                    }
                    toastr["error"](message, "Error cancelando el pedido");
                    order.processingCancelation = true;
                })
            })
        }

        $scope.manageTransition = function (order) {
            var currentStateId = order.state.id;
            var oldState = $scope.states.find(function (state) { return state.id === currentStateId; })
            var newState = $scope.states.find(function (state) { return state.id === (currentStateId + 1); });
            var modalInstance = $uibModal.open({
                templateUrl: '/app/pages/pedidos/pedido.modal.html',
                controller: 'PedidoModalCtrl',
                controllerAs: 'ctrl',
                resolve: {
                  oldState: function () {
                      return oldState.text;
                  },
                  newState: function () {
                      return newState.text;
                  }
                }
            });

            modalInstance.result.then(function () {
                order.processingTransition = true;
                PedidosService.updateState(order.id, newState.status).then(function () {
                    order.state = processState([{ state: newState.status }]);
                    order.processingTransition = false
                }).catch(function (err) {
                    var message = "Hubo un error actualizando el estado"
                    if (err.data && err.data.message) {
                        message = err.data.message;
                    }
                    toastr["error"](message, "Error actualizando el estado");
                    order.processingTransition = false
                })
            })
        }

        $scope.showStatus = function(order) {
            var selected = [];
            if (order.state) {
                selected = $filter('filter')($scope.states, {status: order.state.state});
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        function processState(states) {
            let _state = {
                label: 'warning',
                name: 'Aceptado'
            };
            let state = states[states.length - 1];
            if (!state){
                return _state;

            }
            switch(state.state) {
                case 'TAKEN':
                    _state.label = 'info';
                    _state.name = 'Aceptado';
                    break;
                case 'PREPARATION':
                    _state.label = 'warning';
                    _state.name = 'En preparación';
                    break;
                case 'DISPATCHED':
                    _state.label = 'success';
                    _state.name = 'Despachado';
                    break;
                case 'DELIVERED':
                    _state.label = 'success';
                    _state.name = 'Entregado';
                    break;
                case 'CANCELLED':
                    _state.label = 'danger';
                    _state.name = 'Cancelado';
                    break;
            }
            _state.id = $scope.states.find(function (item) { return item.status === state.state; }).id;
            _state.state = state.state;
            return _state;
        }

        function processDishes(order) {
            let dishes = "";

            let orderDishes = order.dishes;

            order.items.forEach(function (item, index) {
                let dish = orderDishes[item.id];
                dishes += item.quantity + " " + dish.name;

                if (item.garnish) dishes += " c/" + item.garnish;

                if (item.comments) dishes += " (" + item.comments + ")";

                if (index !== order.items.length - 1) {
                    dishes += "\n";
                }
            });

            return dishes;
        }

        function processDate(date) {
            let delta = Math.round((+new Date - date) / 1000);

            let minute = 60,
                hour = minute * 60,
                day = hour * 24,
                week = day * 7;

            let fuzzy;

            if (delta < 30) {
                fuzzy = 'Justo ahora';
            } else if (delta < minute) {
                fuzzy = 'Hace ' + delta + ' segundos';
            } else if (delta < 2 * minute) {
                fuzzy = 'Hace un minuto'
            } else if (delta < hour) {
                fuzzy = 'Hace ' + Math.floor(delta / minute) + ' minutos';
            } else if (Math.floor(delta / hour) == 1) {
                fuzzy = 'Hace 1 hora'
            } else if (delta < day) {
                fuzzy = 'Hace ' + Math.floor(delta / hour) + ' horas';
            } else if (delta < day * 2) {
                fuzzy = 'Ayer';
            //} else if (delta < week) {
            //    fuzzy = 'hace' + Math.floor(delta / day) + ' días';
            } else {
                fuzzy = 'Hace ' + Math.floor(delta / day) + ' días';
            }

            return fuzzy;
        }

        function getOrders() {
            $scope.loading = true;
            PedidosService.getOrders()
            .then(_orders => {
                if (!_orders || !Array.isArray(_orders)){
                    $scope.emptyMessage = "Error interno al cargar los pedidos";
                    return;
                }

                if (_orders.length <= 0 ){
                    $scope.emptyMessage = "No hay ningún pedido para tu comercio";
                    return;
                }
                $scope.orders = [];
                _orders.forEach(function (order) {

                    $scope.orders.push({
                        id:order.id,
                        relativeTime: processDate(new Date(order.register_timestamp)), //parse this
                        time: new Date(order.register_timestamp).toLocaleString(),
                        address: order.address.name,
                        dishes: processDishes(order),
                        client: {name : order.user.first_name + " " + order.user.last_name, avatar: order.user.avatar},
                        notes: order.description,
                        price: order.price,
                        payMethod: "Efectivo",
                        state: processState(order.states),
                    });
                })
            })
            .catch(err => {
                console.log(err);
                $scope.emptyMessage = "Error interno al cargar los pedidos";
            })
            .then( function(){
                $scope.loading = false;
            })
        }
        getOrders();
    }

})();