'use strict';

angular.module('bookingSystemApp')
  .factory('Devices', function($firebase, fbURL, device_table) {
    return new Firebase(fbURL + device_table);
  });
