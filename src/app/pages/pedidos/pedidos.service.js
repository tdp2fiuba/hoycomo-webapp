(function() {
    'use strict';
    
    angular.module('BlurAdmin.pages.pedidos').provider('PedidosService', function () {

        this.$get = function ($http, credentialsService, SERVER_URL) {
            SERVER_URL = "http://localhost:8080";
            const getOrders = function () {
                let storeId = credentialsService.getUser();
                const url = SERVER_URL + '/api/order/store/' + credentialsService.getUser();
                return $http({
                    method: 'GET',
                    url: url,
                    //params: {count: 100},
                    headers: {
                        'Authorization': 'Bearer ' + credentialsService.getToken(),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    return Promise.resolve(response.data);
                });
            };

            const getOrderByID = function (id) {
                const url = SERVER_URL + '/api/order/' + id;
                return $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': 'Bearer ' + credentialsService.getToken(),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    return Promise.resolve(response.data);
                });
            };

            const updateState = function (id, state) {
                const url = SERVER_URL + '/api/order/' + id;
                return $http({
                    method: 'PUT',
                    url: url,
                    data: { state: state },
                    headers: {
                        'Authorization': 'Bearer ' + credentialsService.getToken(),
                        'Content-Type': 'application/json'
                    }
                })
            }
        
            return {
                getOrders: getOrders,
                getOrder: getOrderByID,
                updateState: updateState
            };
        };
    });

})();