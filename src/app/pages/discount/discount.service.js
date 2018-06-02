(function() {
    'use strict';

    angular.module('BlurAdmin.pages.discount').provider('DiscountService', function () {

        this.$get = function ($http, credentialsService, SERVER_URL) {
            function getDiscount() {
                let storeId = credentialsService.getUser();
                const url = SERVER_URL + '/api/store/' + storeId;
                return $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': 'Bearer ' + credentialsService.getToken(),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    return Promise.resolve(response.data.discount ? response.data.discount : 0);
                });
            }

            function updateDiscount(discount) {
                let storeId = credentialsService.getUser();
                const url = SERVER_URL + '/api/store/' + storeId + '/discount';
                return $http({
                    method: 'PUT',
                    url: url,
                    data: { discount: discount },
                    headers: {
                        'Authorization': 'Bearer ' + credentialsService.getToken(),
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    return Promise.resolve(response.data.discount);
                })
            }

            function deleteDiscount() {
                return updateDiscount(0);
            }

            return {
                getDiscount: getDiscount,
                updateDiscount: updateDiscount,
                deleteDiscount: deleteDiscount
            };
        };
    });

})();