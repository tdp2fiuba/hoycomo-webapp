(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pedidos')
        .controller('PedidosController', PedidosController);

    /** @ngInject */
    function PedidosController($scope, $window, toastr, toastrConfig, PedidosService, $filter, $uibModal) {
        $scope.loading = true;
        $scope.emptyMessage = "No hay ningún pedido para tu comercio";
        $scope.orders = [];
        $scope.states = [
            { id: 1, status: "TAKEN", text: "Aceptado" },
            { id: 2, status: "PREPARATION", text: "En Preparación" },
            { id: 3, status: "SENT", text: "Despachado" },
            { id: 4, status: "DELIVERED", text: "Entregado" },
            { id: 5, status: "CANCELLED", text: "Cancelado" },
        ];

        $scope.renderNextState = function (currentStateId) {
            return "Pasar a " + this.states.find(function (state) { return state.id === currentStateId + 1; }).text;
        }

        $scope.manageTransition = function (order) {
            var currentStateId = order.state.id;
            var oldState = $scope.states.find(function (state) { return state.id === currentStateId; }).text;
            var newState = $scope.states.find(function (state) { return state.id === (currentStateId + 1); }).text;
            var modalInstance = $uibModal.open({
                templateUrl: '/app/pages/pedidos/pedido.modal.html',
                controller: 'PedidoModalCtrl',
                controllerAs: 'ctrl',
                resolve: {
                  oldState: function () {
                      return oldState;
                  },
                  newState: function () {
                      return newState;
                  }
                }
            });

            modalInstance.result.then(function () {
                order.processingTransition = true;
            }).catch(function () {
                
            })
        }

        $scope.changeState = function() {
            
            this.rowform.$hide();
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
                    _state.label = 'warning';
                    _state.name = 'Aceptado';
                    break;
                case 'PREPARATION':
                    _state.label = 'info';
                    _state.name = 'En preparación';
                    break;
                case 'DISPATCHED':
                    _state.label = 'info';
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