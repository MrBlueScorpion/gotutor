'use strict';

define(function(require) {

  return ['$cookieStore', function($cookieStore) {
    var _user, _accessToken;

    if (!_.isUndefined($cookieStore.get('session.user'))) {
      _user = JSON.parse($cookieStore.get('session.user'));
    }

    if (!_.isUndefined($cookieStore.get('session.accessToken'))) {
      _accessToken = JSON.parse($cookieStore.get('session.accessToken'));
    }


    var getUser = function() {
      return _user;
    };

    var setUser = function(user) {
      _user = user;
      $cookieStore.put('session.user', JSON.stringify(user))
    };

    var getAccessToken = function() {
      return _accessToken;
    };

    var setAccessToken = function(token) {
      _accessToken = token;
      $cookieStore.put('session.accessToken', token);
    };

    var destroy = function() {
      setUser(null);
      setAccessToken(null);
    };

    return {
      getUser : getUser,
      setUser : setUser,
      getAccessToken : getAccessToken,
      setAccessToken : setAccessToken,
      destroy : destroy
    }
  }];
});