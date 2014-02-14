define(['config'], function(config) {
  'use strict';

  /**
   * AJAX Request class
   * @param {'GET'|'POST'|'PUT'|'DELETE'|'OPTIONS'|'PATCH'} method
   * @param {string} url
   * @param {String|ArrayBuffer|Blob|HTMLDocument|FormData=} data
   * @param {number=} timeout
   * @constructor
   */
  function Request(method, url, data, timeout) {
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
     * @type {number}
     * @private
     */
    this._timeout = +timeout || 5000;
  }

  /**
   * Success handler
   * @param {*} args
   */
  Request.prototype.onSuccess = function(args) {};

  /**
   * Error handler
   */
  Request.prototype.onError = function() {
    console.error(arguments);
  };

  /**
   * Execute request
   */
  Request.prototype.execute = function() {
    var xhr = new XMLHttpRequest();
    var xhrTimeout = null;

    document.body.classList.add('loading');
    document.body.classList.remove('error');
    document.body.classList.remove('auth');

    xhr.onreadystatechange = (function() {
      if (xhr.readyState != 4) return;

      clearTimeout(xhrTimeout);
      document.body.classList.remove('loading');

      if (xhr.status != 200 || !xhr.responseText) {
        document.body.classList.add('error');
        this.onError(xhr);
        return;
      }

      var response = JSON.parse(xhr.responseText);
      if (response.hasOwnProperty('auth') && !response['auth']) {
        document.body.classList.add('auth');
        return;
      }

      if (!response['result']) {
        document.body.classList.add('error');
        this.onError(xhr, response);
        return;
      }

      this.onSuccess(response['items']);
    }).bind(this);

    xhr.open(this._method, config.formatLink(this._url), true);
    xhr.send(this._data);
    xhrTimeout = setTimeout(xhr.abort.bind(xhr), this._timeout);
  };

  return Request;
});
