// Define the API endpoint URL

var countData = $.get("/get_notification_count");

countData.done(function (count) {
  console.log("here");
  console.log(count);
  // Get the span element using its ID
  const notificationCountSpan = document.getElementById("notification-count");

  // Set the text of the span element
  const notificationCount = count; // Replace with the actual notification count
  notificationCountSpan.textContent = notificationCount;
});

// // Get the <a> element by its ID
// const notificationLink = document.getElementById("notification-link");

// // Set the href attribute to the URL of the notification page
// const notificationUrl = '/Notfications';  // Replace with the actual URL of the notification page
// notificationLink.setAttribute('href', notificationUrl);