(function() {
    'use strict';
    
    angular.module('BlurAdmin.pages.pedidos').provider('PedidosService', function () {

        this.$get = function ($http, credentialsService, SERVER_URL) {

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

        
            return {
                getOrders: getOrders
            };
        };
    });

})();