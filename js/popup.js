require(['domReady', 'config', 'Models/Collection', 'Models/Request'], function(domReady, config, Collection, Request) {
  'use strict';

  Collection.prototype.onClick = function() {
    var active = document.querySelector('.collection.active');
    if (this._rendered == active) return;
    active && active.classList.remove('active');
    this._rendered.classList.add('active');

    this.getItems(function(items) {
      var $container = document.querySelector('#raindrops');
      $container.classList.remove('empty');
      $container.innerHTML = '';
      if (!items.length) {
        $container.classList.add('empty');
      }
      else items.forEach(function(raindrop) {
        $container.appendChild(raindrop.render());
      });
    });
  };

  domReady(function() {
    // Auth button
    document.querySelector('#login').addEventListener('click', function() {
      chrome.tabs.create({url: config.formatLink('/account')});
    }, false);

    // Get collections list
    var request = new Request('GET', '/api/collections');
    request.onSuccess = function(items) {
      var $container = document.querySelector('#collections');
      $container.innerHTML = '';
      items.forEach(function(item, index) {
        var collection = new Collection(item['_id'], item['title'], item['count'], item['cover'] ? config.formatLink(item['cover'][0]) : null, item['public']);
        $container.appendChild(collection.render());
        if (!index) {
          // TODO: Сохранять текущую коллекцию и показывать при открытии её
          collection.onClick.call(collection);
        }
      });
    };
    request.execute();
    // TODO: Показать загрузчик при старте, спрятать при финише
  });
});
