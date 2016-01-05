'use strict';

angular.module('bookingSystemApp')
  .factory('Bookings', function($firebase, fbURL, booking_table) {
      var bookingObject = new Firebase(fbURL + booking_table);

      var findById = function(id) {
        return new Firebase(fbURL + booking_table + '/' + id);
      };


      return {
        all: bookingObject,
        findById: findById,
        findByDeviceId: findById
      };
  });
