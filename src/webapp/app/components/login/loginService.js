app.service('loginService', function($http) {
    var login = function (credentials) {
        return $http({
                method: 'POST',
                url: 'http://localhost:8080/api/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: credentials
            })
    }

    return {
        login: login
    }
});