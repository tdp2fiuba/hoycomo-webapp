(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pedidos')
        .controller('PedidosController', PedidosController);

    /** @ngInject */
    function PedidosController($scope, $window, toastr, toastrConfig, PedidosService) {
        $scope.loading = true;
        $scope.emptyMessage = "No hay ningún pedido para tu comercio";
        $scope.orders = [];

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
            return _state;
        }

        function processDishes(order) {
            let dishes = "";

            let orderDishes = {};
            order.dishes.forEach(function (dish) {
                orderDishes[dish.id] = dish;
            });


            order.items.forEach(function (item) {
                let dish = orderDishes[item.id];
                dishes += item.quantity + " " + dish.name;

                if (item.garnishes) dishes += " c/" + item.garnishes;

                if (item.description) dishes += " (" + item.description + ")";
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
                        time: processDate(new Date(order.register_timestamp)), //parse this
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



















        $scope.metricsTableData = [
            {
                image: 'app/browsers/chrome.svg',
                browser: 'Google Chrome',
                visits: '10,392',
                isVisitsUp: true,
                purchases: '4,214',
                isPurchasesUp: true,
                percent: '45%',
                isPercentUp: true
            },
            {
                image: 'app/browsers/firefox.svg',
                browser: 'Mozilla Firefox',
                visits: '7,873',
                isVisitsUp: true,
                purchases: '3,031',
                isPurchasesUp: false,
                percent: '28%',
                isPercentUp: true
            },
            {
                image: 'app/browsers/ie.svg',
                browser: 'Internet Explorer',
                visits: '5,890',
                isVisitsUp: false,
                purchases: '2,102',
                isPurchasesUp: false,
                percent: '17%',
                isPercentUp: false
            },
            {
                image: 'app/browsers/safari.svg',
                browser: 'Safari',
                visits: '4,001',
                isVisitsUp: false,
                purchases: '1,001',
                isPurchasesUp: false,
                percent: '14%',
                isPercentUp: true
            },
            {
                image: 'app/browsers/opera.svg',
                browser: 'Opera',
                visits: '1,833',
                isVisitsUp: true,
                purchases: '83',
                isPurchasesUp: true,
                percent: '5%',
                isPercentUp: false
            }
        ];
    }

})();