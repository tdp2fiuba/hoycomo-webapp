(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reports')
        .controller('leadTimeReportsController', ordersReportsController);

    /** @ngInject */
    function ordersReportsController($scope, $window, toastr, toastrConfig, LeadTimeReportsService, baConfig) {
        $scope.loading = true;
        $scope.emptyMessage = "No hay tiempos de espera promedio disponibles";

        $scope.leadTimePerDay = [];

        const end = new Date;
        const start = new Date(end.getFullYear(),end.getMonth() - 1, end.getDate());
        $scope.date = {
            start: start,
            end: end
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
            const start = $scope.date.start.toString();
            const end = $scope.date.end.toString();
            LeadTimeReportsService.getLeadTimePerDay(start,end)
                .then(res => {
                    if (!res.success){
                        toastr.error(res.error, 'Error al cargar los tiempos de espera promedio');
                        $scope.loading = false;
                        return;
                    }
                    $scope.leadTimePerDay = res.lead_time;

                    $scope.loading = false;
                });
        }

        $scope.getLeadTime = getLeadTime;

        $scope.loading = false;
        getLeadTime();
    }

})();