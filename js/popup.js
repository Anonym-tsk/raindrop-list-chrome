(function(document) {
  'use strict';

  var BASE_URL = 'http://raindrop.io';

  function createImageLink(link, defaultLink) {
    defaultLink = defaultLink || 'icons/19.png';
    link = link || defaultLink;
    if (link[0] === '/') {
      return BASE_URL + link;
    }
    return link;
  }

  function formatNumericString(number, title1, title3, title5) {
    var cases = [title5, title1, title3, title3, title3, title5];
    return (number % 100 > 4 && number % 100 < 20) ? title5 : cases[(number % 10 < 5) ? number % 10 : 5];
  }

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

  function getRaindrops(collectionId, successCallback, errorCallback) {
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
    xhr.open('GET', BASE_URL + '/api/raindrops/' + (+collectionId), true);
    xhr.send();
  }

  function renderCollection(data) {
    var $container = document.querySelector('#collections');
    var $item = document.createElement('li');
    $item.classList.add('collection');

    var $image = document.createElement('div');
    $image.classList.add('cover');
    if (data['cover'][0]) {
      var img = data['cover'][0][0] === '/' ? BASE_URL + data['cover'][0] : data['cover'][0];
      $image.style.backgroundImage = 'url(' + img + ')';
    }

    var $title = document.createElement('h3');
    $title.classList.add('title');
    $title.classList.add('nowrap');
    $title.textContent = data['title'];
    $title.title = data['title'];

    var $count = document.createElement('div');
    $count.classList.add('count');
    if (data['public']) $count.classList.add('public');
    $count.textContent = data['count'] + ' ' + formatNumericString(data['count'], 'элемент', 'элемента', 'элементов');

    $item.appendChild($image);
    $item.appendChild($title);
    $item.appendChild($count);
    $container.appendChild($item);
  }

  function renderRaindrop(data) {
    var $container = document.querySelector('#raindrops');
    var $item = document.createElement('div');
    $item.classList.add('raindrop');

    var $image = document.createElement('div');
    $image.classList.add('cover');
    if (data['cover']) {
      var img = data['cover'][0] === '/' ? BASE_URL + data['cover'] : data['cover'];
      $image.style.backgroundImage = 'url(' + img + ')';
    }

    var $title = document.createElement('h2');
    $title.classList.add('title');
    $title.classList.add('nowrap');
    $title.textContent = data['title'];
    $title.title = data['title'];

    var $info = document.createElement('div');
    $info.classList.add('info');
    $info.classList.add('nowrap');
    $info.textContent = data['domain'];

    var $description = document.createElement('div');
    $description.classList.add('description');
    $description.classList.add('nowrap');
    $description.title = data['excerpt'];
    $description.textContent = data['excerpt'];

    $item.appendChild($image);
    $item.appendChild($title);
    $item.appendChild($info);
    $item.appendChild($description);
    $container.appendChild($item);
  }

  getCollections(
    function(collections) {
      for (var i = 0, l = collections.length; i < l; i++) {
        renderCollection(collections[i]);
      }
      getRaindrops(collections[0]['_id'],
        function(raindrops) {
          for (var j = 0, k = raindrops.length; j < k; j++) {
            renderRaindrop(raindrops[j]);
          }
        },
        function() {
          console.warn(arguments);
        }
      );
    },
    function() {
      console.warn(arguments);
    }
  );
})(window.document);