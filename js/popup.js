require(['config', 'Models/Collection', 'Models/Raindrop', 'Models/Request', 'domReady!'], function(config, Collection, Raindrop, Request, document) {
  'use strict';

  var $raindrops = document.querySelector('#raindrops'),
      $collections = document.querySelector('#collections');

  var currentCollection = null;

  // Auth button
  document.querySelector('#login').addEventListener('click', function() {
    chrome.tabs.create({url: config.formatLink('/account')});
  }, false);

  // Pagination loading
  $raindrops.addEventListener('scroll', function(e) {
    if ($raindrops.scrollTop > $raindrops.scrollHeight - $raindrops.offsetHeight * 2) {
      if (!document.body.classList.contains('loading')) {
        currentCollection.getNextItems(function(items) {
          items.forEach(function(raindrop) {
            $raindrops.appendChild(raindrop.render());
          });
        });
      }
    }
  }, false);

  // Raindrop click
  Raindrop.prototype.onClick = function() {
    chrome.tabs.create({url: this._link});
  };

  // Collection click
  Collection.prototype.onClick = function() {
    if (currentCollection === this) {
      return;
    }

    currentCollection = this;
    $raindrops.scrollTop = 0;
    $raindrops.innerHTML = '';

    var active = document.querySelector('.collection.active');
    active && active.classList.remove('active');
    this._rendered.classList.add('active');

    this.getItems(function(items) {
      $raindrops.classList.remove('empty');
      if (!items.length) {
        $raindrops.classList.add('empty');
      }
      else items.forEach(function(raindrop) {
        $raindrops.appendChild(raindrop.render());
      });
    });
  };

  // Load collection list and run application
  var request = new Request('GET', '/api/collections');
  request.onSuccess = function(items) {
    $collections.innerHTML = '';
    items.forEach(function(item, index) {
      var collection = new Collection(item['_id'], item['title'], item['count'], item['cover'] ? config.formatLink(item['cover'][0]) : null, item['public']);
      $collections.appendChild(collection.render());
      if (!index) {
        // TODO: Сохранять текущую коллекцию и показывать при открытии её
        collection.onClick.call(collection);
      }
    });
  };
  request.execute();
});
