/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service Worker for Zavr App
 * 
 * Handles:
 * - Background notifications
 * - Notification click events
 * - Foreground message handling
 */

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  const { type, userId, goalName, action } = event.notification.data;

  // Close the notification
  event.notification.close();

  // Perform action based on notification type
  event.waitUntil(
    (async () => {
      // Check if window is already open
      const clients = await self.clients.matchAll({ type: 'window' });

      for (let client of clients) {
        // Focus the window if it exists
        if (client.url === '/' && 'focus' in client) {
          client.focus();

          // Navigate based on notification type
          let route = '/notifications';

          if (type === 'transaction') {
            route = `/home`; // Go to home to add more transactions
          } else if (type === 'reminder') {
            route = `/goals`; // Go to goals
          } else if (type === 'motivational') {
            route = `/home`; // Go to home for encouragement
          } else if (type === 'group') {
            route = `/goals`; // Go to goals
          }

          // Send message to client to navigate
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            route,
            data: { type, goalName, action },
          });

          return;
        }
      }

      // If no window found, open new window
      if (clients.openWindow) {
        await clients.openWindow('/');
      }
    })()
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

// Handle push events (if using Firebase Cloud Messaging)
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Zavr Notification',
    options: {
      icon: '/logo.png',
      badge: '/logo-badge.png',
    },
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.notification?.title || notificationData.title,
        options: {
          body: data.notification?.body || 'New notification from Zavr',
          icon: data.notification?.icon || notificationData.options.icon,
          badge: data.notification?.badge || notificationData.options.badge,
          data: data.data || {},
        },
      };
    } catch (error) {
      console.error('Error parsing push event:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});

// Handle activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle installation
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  // Skip waiting to activate immediately
  self.skipWaiting();
});
