'use strict';

describe('Service: bookings', function () {

  // load the service's module
  beforeEach(module('bookingSystemApp'));

  // instantiate service
  var bookings;
  beforeEach(inject(function (_bookings_) {
    bookings = _bookings_;
  }));

  it('should do something', function () {
    expect(!!bookings).toBe(true);
  });

});
