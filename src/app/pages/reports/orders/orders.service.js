(function() {
    'use strict';

    angular.module('BlurAdmin.pages.reports').provider('OrderReportsService', function () {

        this.$get = function ($http, credentialsService, SERVER_URL) {
            const getOrdersPerDay = function (start, end) {

                if (!start || !end){
                    return Promise.resolve({success: false, error:"Debe ingresar ambas fechas"});
                }

                const url = SERVER_URL + '/api/stats/orders';
                return $http({
                    method: 'GET',
                    url: url,
                    params: {start_date:start,end_date:end},
                    headers: {
                        'Authorization': 'Bearer ' + credentialsService.getToken(),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    return Promise.resolve({success: true, orders: response.data});
                });
            };

            return {
                getOrdersPerDay: getOrdersPerDay
            };
        };
    });

})();