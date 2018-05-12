(function() {
    'use strict';
    
    angular.module('sharedServices').provider('credentialsService', ['SERVER_URL',function () {

        this.$get = function ($http, $cookies, $window, SERVER_URL) {
            var token = $cookies.get('session_token');

            if (!token){
                console.log("Paso por credentials");
                $window.location.href = $window.location.origin + "/auth.html";
            }

            function _getStore() {
                return $cookies.getObject('store');
            }

            var getToken = function () {
                return $cookies.get('session_token');
            };

            var login = function (credentials) {
                return $http({
                        method: 'POST',
                        //url: SERVER_URL + '/api/login',
                        url: SERVER_URL + '/api/store/auth',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: credentials
                }).then (response => {
                    $cookies.put('session_token', response.data.token);
                    $cookies.putObject('store', response.data.store);
                    //Promise.resolve(response);
                })
            };

            var getStoreId = function () {
                return _getStore().id;
            };

            return {
                login: login,
                getUser: getStoreId,
                getToken: getToken
            }
        }
    }]);

})();