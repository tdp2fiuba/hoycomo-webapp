(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reports')
        .controller('ordersReportsController', ordersReportsController);

    /** @ngInject */
    function ordersReportsController($scope, $window, toastr, toastrConfig, OrderReportsService, baConfig) {
        $scope.loading = true;
        $scope.emptyMessage = "No hay pedidos disponibles";

        $scope.ordersPerDay = [];

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

        function getOrders() {
            $scope.loading = true;
            const start = $scope.date.start.toString();
            const end = $scope.date.end.toString();
            OrderReportsService.getOrdersPerDay(start,end)
            .then(res => {
                if (!res.success){
                    toastr.error(res.error, 'Error al cargar los pedidos');
                    $scope.loading = false;
                    return;
                }
                $scope.ordersPerDay = res.orders;

                $scope.loading = false;
            });
        }

        $scope.getOrders = getOrders;

        $scope.loading = false;
        getOrders();
    }

})();