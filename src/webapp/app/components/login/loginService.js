app.service('loginService', function($http) {
    var login = function (credentials) {
        return $http({
                method: 'POST',
                url: 'http://localhost:5000/api/login',
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