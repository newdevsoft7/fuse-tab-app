function getBaseUrl() {
  var host = window.location.host;
  if (host.indexOf('localhost') > -1) return 'http://localhost:8080/base.php';
  return '/base.php';
}

function updateFavicon() {
  var links = document.getElementsByTagName("link");
  for (let link of links) {
    if (link.rel === 'icon' && link.type === 'image/x-icon') {
      link.href = window.tenant.favicon;
      break;
    }
  }
}

function init() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', getBaseUrl(), true);
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    window.tenant = xhr.response;

    if (window.tenant.favicon) {
      updateFavicon();
    }
  });
  xhr.send();
}

init();
