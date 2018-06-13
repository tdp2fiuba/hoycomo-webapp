(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reports')
        .controller('leadTimeController', leadTimeController);

    /** @ngInject */
    function leadTimeController($scope, $window, toastr, toastrConfig, Server, $filter, $uibModal) {
        $scope.loading = true;
        $scope.emptyMessage = "No hay tiempos de espera promedio disponibles";
        $scope.leadTime = [];

        $scope.date = {
            start: new Date(2018, 2, 1, 0, 0),
            end: new Date()
        };

        $scope.datepickerOption = {
            showWeeks: false,
            datepickerMode: 'month',
            //minMode: 'month'
        };

        $scope.toastOptions = {
            autoDismiss: false,
            positionClass: 'toast-top-right',
            type: 'error',
            timeOut: '3000',
            extendedTimeOut: '3000',
            closeButton: true,
            tapToDismiss: true,
            progressBar: false,
            newestOnTop: true,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false,
            allowHtml: true
        };


        function getLeadTime() {
            $scope.loading = true;
            var start = $scope.date.start.toString();
            var end = $scope.date.end.toString();
            Server.getLeadTime(start,end,function (res) {
                if (!res.success){
                    toastr.error(res.error, 'Error al cargar las comisiones');
                    $scope.loading = false;
                    return;
                }

                $scope.leadTime = res.leadTime;

                $scope.loading = false;
            });
        }

        $scope.getLeadTime = getLeadTime;

        getLeadTime();
    }

})();