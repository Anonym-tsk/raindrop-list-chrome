(function(document) {
  'use strict';

  var BASE_URL = 'http://raindrop.io';

  function getCollections(successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) {
        return;
      }
      if (xhr.status != 200 || !xhr.responseText) {
        errorCallback(xhr);
        return;
      }

      var response = JSON.parse(xhr.responseText);
      if (!response['result']) {
        errorCallback(xhr, response);
        return;
      }

      successCallback(response['items']);
    };
    xhr.open('GET', BASE_URL + '/api/collections', true);
    xhr.send();
  }

  function renderCollection(image, title) {
    var $container = document.querySelector('#collections');
    var $collection = document.createElement('div');
    $collection.classList.add('collection');
    var $image = document.createElement('img');
    $image.src = image;
    var $title = document.createElement('h3');
    $title.innerText = title;
    $collection.appendChild($image);
    $collection.appendChild($title);
    $container.appendChild($collection);
  }

  getCollections(
    function(collections) {
      for (var i = 0, l = collections.length; i < l; i++) {
        renderCollection(BASE_URL + collections[i]['cover'][0], collections[i]['title']);
      }
    },
    function() {
      console.warn(arguments);
    }
  );
})(window.document);