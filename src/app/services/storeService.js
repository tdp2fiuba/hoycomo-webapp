(function () {
    'use strict';

    angular.module('BlurAdmin').service('storeService', storeService);

    function storeService($http) {
        var parseToFormData = function (store) {
            var formData = new FormData();
            formData.append('store[name]', store.name);
            formData.append('store[availability]', store.availability);
            formData.append('store[avatar]', store.avatar);
            return formData
        }
        var saveProfile = function (store) {
            return $http({
                method: 'PUT',
                url: 'https://hoycomo-server.herokuapp.com/api/store/' + store.id,
                data: parseToFormData(store)
            })
        }

        return {
            saveProfile: saveProfile
        }
    }
})();
