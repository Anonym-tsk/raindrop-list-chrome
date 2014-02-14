define(['config'], function(config) {
  'use strict';

  /**
   * Raindrop class
   * @param {number} id
   * @param {string=} title
   * @param {string=} description
   * @param {string=} domain
   * @param {string=} link
   * @param {string=} cover
   * @constructor
   */
  function Raindrop(id, title, description, domain, link, cover) {
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
     * @type {string}
     * @private
     */
    this._description = description || '';
    /**
     * @type {string}
     * @private
     */
    this._domain = domain || '';
    /**
     * @type {string}
     * @private
     */
    this._link = link || '';
    /**
     * @type {?string}
     * @private
     */
    this._cover = config.formatLink(cover);
    /**
     * @type {?HTMLElement}
     * @private
     */
    this._rendered = null;
  }

  /**
   * Onclick method
   */
  Raindrop.prototype.onClick = function() {
    chrome.tabs.create({url: this._link});
  };

  /**
   * Render raindrop
   * @return {HTMLElement}
   */
  Raindrop.prototype.render = function() {
    if (this._rendered !== null) {
      return this._rendered;
    }

    var $item = document.createElement('div');
    $item.classList.add('raindrop');

    var $image = document.createElement('div');
    $image.classList.add('cover');
    if (this._cover) {
      $image.style.backgroundImage = 'url(' + this._cover + ')';
    }

    var $title = document.createElement('h2');
    $title.classList.add('title');
    $title.classList.add('nowrap');
    $title.textContent = this._title;
    $title.title = this._title;

    var $info = document.createElement('div');
    $info.classList.add('info');
    $info.classList.add('nowrap');
    $info.textContent = this._domain;

    var $description = document.createElement('div');
    $description.classList.add('description');
    $description.classList.add('nowrap');
    $description.title = this._description;
    $description.textContent = this._description;

    $item.appendChild($image);
    $item.appendChild($title);
    $item.appendChild($info);
    $item.appendChild($description);

    $item.addEventListener('click', function(e) {
      e.preventDefault();
      this.onClick();
    }.bind(this), false);

    this._rendered = $item;
    return this._rendered;
  };

  return Raindrop;
});
