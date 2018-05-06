importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '184388846598'//'557767382630'
});
// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = new URL('/', self.location.origin);
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];

        var pathArray = windowClient.url.split('/');
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host + '/';

        if (url === urlToOpen.href) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        //do something in future?
        matchingClient.postMessage({
          action: event.notification.data.action,
          id: event.notification.data.id
        });
        return matchingClient.focus();
      } else {
        urlToOpen.searchParams.set('action', event.notification.data.action);
        urlToOpen.searchParams.append('id', event.notification.data.id);
        return clients.openWindow(urlToOpen.href);
      }
    });

  event.waitUntil(promiseChain);
});

self.addEventListener('push', function (event) {
  var payload = event.data.json();
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    data: payload.data,
    icon: payload.notification.icon
  };

  event.waitUntil(self.registration.showNotification(title, options));
});