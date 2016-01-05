'use strict';

angular.module('bookingSystemApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('validate', {
        url: '/validate/:id',
        templateUrl: 'app/validate/validate.html',
        controller: 'ValidateCtrl'
      });
  });