define(['config', 'Models/Request', 'Models/Raindrop'], function(config, Request, Raindrop) {
  'use strict';

  /**
   * Collection class
   * @param {number} id
   * @param {string=} title
   * @param {number=} count
   * @param {string=} cover
   * @param {boolean=} isPublic
   * @constructor
   */
  function Collection(id, title, count, cover, isPublic) {
    this._raindrops = [];
    this._id = +id;
    this._title = title || '';
    this._cover = config.formatLink(cover);
    this._count = count || this._raindrops.length;
    this._isPublic = !!isPublic;
    this._onClick = null;
    this._rendered = null;
  }

  /**
   * Set onclick callback
   * @param {function} callback
   */
  Collection.prototype.onClick = function(callback) {
    this._onClick = callback;
  };

  /**
   * Get raindrops
   * @param {function} callback
   */
  Collection.prototype.getItems = function(callback) {
    if (this._raindrops.length > 0 || !this._count) {
      callback.call(this, this._raindrops);
      return;
    }

    var request = new Request('GET', '/api/raindrops/' + this._id);
    request.onSuccess(function(items) {
      for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
        this._raindrops.push(new Raindrop(item['_id'], item['title'], item['excerpt'], item['domain'], item['link'], item['cover']));
      }
      callback.call(this, this._raindrops);
    }.bind(this));
    request.onError(function() {
      console.error(arguments);
    });
    request.execute();
    // TODO: Показать загрузчик при старте, спрятать при финише
  };

  /**
   * Render collection
   * @return {HTMLElement}
   */
  Collection.prototype.render = function() {
    if (!this._rendered) {
      var $item = document.createElement('li');
      $item.classList.add('collection');

      var $image = document.createElement('div');
      $image.classList.add('cover');
      if (this._cover) {
        $image.style.backgroundImage = 'url(' + this._cover + ')';
      }

      var $title = document.createElement('h3');
      $title.classList.add('title');
      $title.classList.add('nowrap');
      $title.textContent = this._title;
      $title.title = this._title;

      var $count = document.createElement('div');
      $count.classList.add('count');
      if (this._isPublic) {
        $count.classList.add('public');
      }
      $count.textContent = this._count + ' ' + config.formatNumericString(this._count, 'элемент', 'элемента', 'элементов');

      $item.appendChild($image);
      $item.appendChild($title);
      $item.appendChild($count);

      $item.addEventListener('click', function(e) {
        e.preventDefault();
        this._onClick();
      }.bind(this), false);

      this._rendered = $item;
    }
    return this._rendered;
  };

  return Collection;
});
