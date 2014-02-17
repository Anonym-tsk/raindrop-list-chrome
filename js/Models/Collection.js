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
    /**
     * @type {Array}
     * @private
     */
    this._raindrops = [];
    /**
     * @type {number}
     * @private
     */
    this._id = +id;
    /**
     * @type {string}
     * @private
     */
    this._title = title || '';
    /**
     * @type {?string}
     * @private
     */
    this._cover = config.formatLink(cover);
    /**
     * @type {number}
     * @private
     */
    this._count = count || this._raindrops.length;
    /**
     * @type {boolean}
     * @private
     */
    this._isPublic = !!isPublic;
    /**
     * @type {?HTMLElement}
     * @private
     */
    this._rendered = null;
  }

  /**
   * Onclick method
   */
  Collection.prototype.onClick = function() {};

  /**
   * Get all loaded raindrops
   * @param {function} callback
   */
  Collection.prototype.getItems = function(callback) {
    if (this._raindrops.length > 0 || !this._count) {
      callback.call(this, this._raindrops);
      return;
    }
    this.getNextItems(callback);
  };

  /**
   * Get raindrops for next page
   * @param {function} callback
   */
  Collection.prototype.getNextItems = function(callback) {
    if (this._raindrops.length < this._count) {
      var page = Math.floor(this._raindrops.length / 20);
      var request = new Request('GET', '/api/raindrops/' + this._id + '?page=' + page);
      request.onSuccess = (function(items) {
        var chunk = [];
        for (var i = 0, l = items.length; i < l; i++) {
          var item = items[i];
          var raindrop = new Raindrop(item['_id'], item['title'], item['excerpt'], item['domain'], item['link'], item['cover']);
          chunk.push(raindrop);
          this._raindrops.push(raindrop);
        }
        callback.call(this, chunk);
      }).bind(this);
      request.execute();
    }
  };

  /**
   * Render collection
   * @return {HTMLElement}
   */
  Collection.prototype.render = function() {
    if (this._rendered !== null) {
      return this._rendered;
    }

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
    $count.textContent = config.formatNumericString(this._count, 'element1', 'element3', 'element5');

    $item.appendChild($image);
    $item.appendChild($title);
    $item.appendChild($count);

    $item.addEventListener('click', function(e) {
      e.preventDefault();
      this.onClick();
    }.bind(this), false);

    this._rendered = $item;
    return this._rendered;
  };

  return Collection;
});
