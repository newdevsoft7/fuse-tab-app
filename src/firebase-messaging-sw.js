// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '557767382630'
});



// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.


if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
    .then(function (swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
      initialiseUI();
    })
    .catch(function (error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
}

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  console.log(event);

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://demo.staffconnect-app.com?action=' + event.notification.actions[0].action + '&id=' + event.notification.data.id)
  );
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  var payload = event.data.json();
  console.log(payload);
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    actions: [
      {action: payload.notification.click_action, title: payload.notification.click_action}
    ],
    data: payload.data,
    icon: payload.notification.icon
  };

  event.waitUntil(self.registration.showNotification(title, options));
});