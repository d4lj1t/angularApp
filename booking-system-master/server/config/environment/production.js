'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            9000,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://hof:tesla@ds031711.mongolab.com:31711/device-lab'
  }
};