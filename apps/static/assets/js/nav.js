// Define the API endpoint URL
console.log("here");

var countData = $.get("/get_notification_count");

countData.done(function (count) {
  console.log(count);
  // Get the span element using its ID
  const notificationCountSpan = document.getElementById("notification-count");

  // Set the text of the span element
  const notificationCount = count; // Replace with the actual notification count
  notificationCountSpan.textContent = notificationCount;
});

var timeDate = $.get("/get_time");

timeDate.done(function (data) {
  console.log(data.date);
  console.log(data.time);
  console.log(data.day);
  // Get the span element using its ID
  const time = document.getElementById("time-input");
  const date = document.getElementById("date-input");
  const day = document.getElementById("day-input");
  time.value = data.time;
  date.value = data.date;
  day.value = data.day;
});


// // Get the <a> element by its ID
// const notificationLink = document.getElementById("notification-link");

// // Set the href attribute to the URL of the notification page
// const notificationUrl = '/Notfications';  // Replace with the actual URL of the notification page
// notificationLink.setAttribute('href', notificationUrl);