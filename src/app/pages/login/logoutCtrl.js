(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('LogoutCtrl', LogoutCtrl);

    function LogoutCtrl($scope, credentialsService) {
        $scope.logout = function () {
            credentialsService.logout();
        }
    }
})();