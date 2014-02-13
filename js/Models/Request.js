define(['config'], function(config) {
  'use strict';

  /**
   * AJAX Request class
   * @param {string} method
   * @param {string} url
   * @param {*} data
   * @constructor
   */
  function Request(method, url, data) {
    this._method = method;
    this._url = url;
    this._data = data || null;
    this._onSuccess = null;
    this._onError = null;
  }

  /**
   * Set success callback
   * @param {function} callback
   */
  Request.prototype.onSuccess = function(callback) {
    this._onSuccess = callback;
  };

  /**
   * Set error callback
   * @param {function} callback
   */
  Request.prototype.onError = function(callback) {
    this._onError = callback;
  };

  /**
   * Execute request
   */
  Request.prototype.execute = function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function() {
      if (xhr.readyState != 4) {
        return;
      }
      if (xhr.status != 200 || !xhr.responseText) {
        this._onError(xhr);
        return;
      }
      var response = JSON.parse(xhr.responseText);
      if (!response['result']) {
        this._onError(xhr, response);
        return;
      }
      this._onSuccess(response['items']);
    }).bind(this);
    xhr.open(this._method, config.formatLink(this._url), true);
    xhr.send(this._data);
  };

  return Request;
});
