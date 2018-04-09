angular.module('BlurAdmin.login')
    .controller('LoginCtrl', function ($scope, credentialsService) {
        var self = this;
        self.isSubmitted = false;
        $scope.user = "Whatwhat";
        self.password = null;

        self.handleSubmit = function () {
            alert("Check console");
            console.log(self.user + " " + self.password);
        }
    })