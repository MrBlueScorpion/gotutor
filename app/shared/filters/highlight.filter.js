'use strict';

module.exports = ['$sce', function($sce) {
  return function (text, subject, location) {
    if (subject)
      text = text.replace(new RegExp('('+subject+')', 'gi'),
      '<strong><span class="text-danger">$1</span></strong>');

    if (location)
      text = text.replace(new RegExp('('+location+')', 'gi'),
        '<strong><span class="text-danger">$1</span></strong>');

    return $sce.trustAsHtml(text);
  }
}];