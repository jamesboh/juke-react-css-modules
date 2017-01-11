'use strict';
/* eslint-disable global-require */

module.exports = function (app) {

  // setValue and getValue are merely alias
  // for app.set and app.get used in the less
  // common way of setting application variables.
  app.setValue = app.set.bind(app);

  app.getValue = function (path) {
      return app.get(path);
  };

  require('./app-variables')(app);

  // Logging middleware, set as application
  // variable inside of server/app/configure/app-variables.js
  app.use(app.getValue('log'));

  require('./static-middleware')(app);
  require('./parsing-middleware')(app);

};
