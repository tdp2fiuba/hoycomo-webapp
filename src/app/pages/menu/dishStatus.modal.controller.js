(function () {
    'use strict';

    angular.module('BlurAdmin.pages.menu')
        .controller('DishStatusModalCtrl', DishStatusModalCtrl);

    function DishStatusModalCtrl($scope) {
        this.disable = $scope.$resolve.disable;

        this.ok = function () {
            $scope.$close();
        };

        this.cancel = function () {
            $scope.$dismiss();
        };
    }

})();