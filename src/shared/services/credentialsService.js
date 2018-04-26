(function() {
    'use strict';
    
    angular.module('sharedServices').provider('credentialsService', function () {

        this.$get = function ($http, $cookies, $window) {
            var store_id = $cookies.get('store_id');

            // TODO: Implementar redirect en caso de que entre por URL sin credenciales

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

            var saveProfileCookie = function (store_id) {
                $cookies.put('store_id', store_id);
            }

            var getUser = function () {
                return $cookies.get('store_id');
            }
        
            return {
                login: login,
                saveProfileCookie: saveProfileCookie,
                getUser: getUser
            }
        }
    });

})();