'use strict';

angular.module('bookingSystemApp')
  .controller('ValidateCtrl', function ($scope, socket, $stateParams,$resource) {
      var userId = $stateParams.id;
      var User = $resource('/api/users/:id/:controller', {
                id: '@_id'
            },
            {
                validate: {
                    method: 'PUT',
                    params: {
                        controller:'validate'
                    }
                },
                get: {
                    method: 'GET',
                    params: {
                        id:'@_id'
                    }
                }
            });

        $scope.user = User.get({id:userId});

        $scope.validate = function () {
            $scope.user.validated = true;

            $scope.user.$save();
        };

        $scope.notValidated = function () {
            $scope.user.validated = false;

            $scope.user.$save();
        };
  });
