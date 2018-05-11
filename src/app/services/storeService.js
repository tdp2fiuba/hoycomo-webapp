(function () {
    'use strict';

    angular.module('BlurAdmin').service('storeService', storeService);

    function storeService($http, SERVER_URL) {
        var saveProfile = function (store) {
            return $http({
                method: 'PUT',
                url: SERVER_URL +'/api/store/' + store.id,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { 
                    name: store.name, 
                    availability: store.availability, 
                    avatar: { data: store.avatar, type: store.avatarType },
                    foodTypes: store.foodTypes.map(function (item) { return item.id }) 
                }
            })
        }

        var getStore = function (store_id) {
            return $http({
                method: 'GET',
                url: SERVER_URL + '/api/store/' + store_id,
                headers: {
                    'Content-Type': 'application/json'
                },
            })
        }

        return {
            saveProfile: saveProfile,
            getStore: getStore
        }
    }
})();
