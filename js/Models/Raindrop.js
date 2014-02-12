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
    this._onClick = null;
    this._id = id;
    this._title = title || '';
    this._description = description || '';
    this._domain = domain || '';
    this._link = link || '';
    this._cover = cover ? config.formatImageLink(cover) : null;
    this._rendered = null;
  }

  /**
   * Set onclick callback
   * @param {function} callback
   */
  Raindrop.prototype.onClick = function(callback) {
    this._onClick = callback;
  };

  /**
   * Render raindrop
   * @returns {HTMLElement}
   */
  Raindrop.prototype.render = function() {
    if (!this._rendered) {
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
        this._onClick();
      }.bind(this), false);

      this._rendered = $item;
    }
    return this._rendered;
  };

  return Raindrop;
});