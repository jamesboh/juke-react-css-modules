'use strict';

var bodyParser = require('body-parser');

module.exports = function (app) {

  // Parse our POST and PUT bodies.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

};
