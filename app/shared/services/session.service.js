'use strict';

module.exports = ['$q', function($q) {
  var id, userId, sessionId;
  var create = function(sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };

  var destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };


  return {
    create : create,
    destroy: destroy
  }
}];