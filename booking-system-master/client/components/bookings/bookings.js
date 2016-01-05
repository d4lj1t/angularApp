'use strict';

angular.module('bookingSystemApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('bookings', {
                url: '/bookings/:deviceId',
                templateUrl: 'app/bookings/bookings.html',
                controller: 'BookingsCtrl'
            },
            {
                url: '/bookings/partial/:deviceId',
                templateUrl: 'app/bookings/bookingsModal.html'
            });
    });
