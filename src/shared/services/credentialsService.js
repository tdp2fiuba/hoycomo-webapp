(function() {
    'use strict';
    
    angular.module('sharedServices').provider('credentialsService', function () {

        this.$get = function ($http, $cookies, $window) {
            var userCredentials = $cookies.get('hoyComoComercioUser');

            if (!userCredentials) {
                
                // $window.location.href = $window.location.origin + "/auth.html";
            }

            var login = function (credentials) {
                return $http({
                        method: 'POST',
                        url: 'https://hoycomo-server.herokuapp.com/api/login',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: credentials
                    })
            }

            var saveProfileCookie = function (profile) {
                $cookies.putObject('hoyComoComercioUser', profile);
            }

            var getUser = function (profile) {
                return $cookies.getObject('hoyComoComercioUser');
            }
        
            return {
                login: login,
                saveProfileCookie: saveProfileCookie,
                getUser: getUser
            }
        }
    });

})();