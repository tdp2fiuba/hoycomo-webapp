(function() {
    'use strict';
    
    angular.module('BlurAdmin').provider('credentialsService', function () {

        this.$get = function ($http, $cookies) {
            var userCredentials = $cookies.get('hoyComoComercioUser');

            var login = function (credentials) {
                return $http({
                        method: 'POST',
                        url: 'http://localhost:8080/api/login',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: credentials
                    })
            }
        
            return {
                login: login,
                isLoggedIn: !!userCredentials
            }
        }
    });

})();