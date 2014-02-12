require(['domReady', 'config', 'Models/Collection', 'Models/Request'], function(domReady, config, Collection, Request) {
  'use strict';

  var raindropClickHandler = function() {
    chrome.tabs.create({url: this._link});
  };

  var collectionClickHandler = function() {
    this.getItems(function(items) {
      var $container = document.querySelector('#raindrops');
      $container.innerHTML = '';
      items.forEach(function(raindrop) {
        raindrop.onClick(raindropClickHandler);
        $container.appendChild(raindrop.render());
      });
    });
  };

  domReady(function() {
    // Get collections list
    var request = new Request('GET', config.baseURI + '/api/collections');
    request.onSuccess(function(items) {
      var $container = document.querySelector('#collections');
      $container.innerHTML = '';
      items.forEach(function(item, index) {
        var collection = new Collection(item['_id'], item['title'], item['count'], item['cover'] ? config.baseURI + item['cover'][0] : null, item['public']);
        collection.onClick(collectionClickHandler);
        $container.appendChild(collection.render());
        if (!index) {
          collectionClickHandler.call(collection);
        }
      });
    });
    request.onError(function() {
      console.error(arguments);
    });
    request.execute();
  });
});