app.controller('LoginCtrl', function($scope) {
    $scope.isSubmitted = false;

    $scope.handleSubmit = function () {
        alert("Submitted");
        $scope.isSubmitted = true;
    }
})