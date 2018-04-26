(function () {
    'use strict';

    angular.module('BlurAdmin').service('storeService', storeService);

    function storeService($http) {
        var saveProfile = function (store) {
            return $http({
                method: 'PUT',
                url: 'https://hoycomo-server.herokuapp.com/api/store/' + store.id,
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
                url: 'https://hoycomo-server.herokuapp.com/api/store/' + store_id,
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
