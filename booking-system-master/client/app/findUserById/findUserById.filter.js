'use strict';

angular.module('bookingSystemApp')
  .filter('findUserById', function (Users, $firebaseObject) {
    return function (input) {
      var userObject = $firebaseObject(Users.findById(input));
      return userObject;
    };
  });
