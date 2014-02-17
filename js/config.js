define(function() {
  'use strict';

  return {
    baseURI: 'http://raindrop.io',
    formatNumericString: function(number, title1, title3, title5) {
      var cases = [title5, title1, title3, title3, title3, title5];
      var title = (number % 100 > 4 && number % 100 < 20) ? title5 : cases[(number % 10 < 5) ? number % 10 : 5];
      return chrome.i18n.getMessage(title, [number]);
    },
    formatLink: function(link) {
      if (!link) {
        return null;
      }
      return link[0] === '/' ? this.baseURI + link : link;
    }
  };
});
