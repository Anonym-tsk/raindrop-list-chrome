define(['config'], function(config) {
  'use strict';

  /**
   * AJAX Request class
   * @param {'GET'|'POST'|'PUT'|'DELETE'|'OPTIONS'|'PATCH'} method
   * @param {string} url
   * @param {String|ArrayBuffer|Blob|HTMLDocument|FormData=} data
   * @constructor
   */
  function Request(method, url, data) {
    /**
     * @type {'GET'|'POST'|'PUT'|'DELETE'|'OPTIONS'|'PATCH'}
     * @private
     */
    this._method = method;
    /**
     * @type {string}
     * @private
     */
    this._url = url;
    /**
     * @type {?String|ArrayBuffer|Blob|HTMLDocument|FormData}
     * @private
     */
    this._data = data || null;
    /**
     * @type {?function}
     * @private
     */
    this._onSuccess = null;
    /**
     * @type {?function}
     * @private
     */
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
      document.body.classList.remove('auth');
      if (response.hasOwnProperty('auth') && !response['auth']) {
        document.body.classList.add('auth');
        return;
      }
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
