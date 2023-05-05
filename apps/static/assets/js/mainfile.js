class Mediator {
  constructor() {
    this.handlers = {};
  }

  register(key, handler) {
    if (!this.handlers[key]) {
      this.handlers[key] = [];
    }
    this.handlers[key].push(handler);
  }

  unregister(key, handler) {
    if (!this.handlers[key]) {
      return;
    }
    const index = this.handlers[key].indexOf(handler);
    if (index !== -1) {
      this.handlers[key].splice(index, 1);
    }
  }

  notify(key, data) {
    if (!this.handlers[key]) {
      return;
    }
    this.handlers[key].forEach(function (handler) {
      handler(data);
    });
  }
}

// Create a new Mediator object
const mediator = new Mediator();

// Notification.html

// Register a handler function with the mediator to remove the corresponding list item when the data has been deleted
mediator.register("dataDeleted", function (params) {
  const button = params.button;
  const itemId = params.itemId;
  // Find the corresponding list item and remove it
  if (button) {
    const listItem = button.closest(".item");
    listItem.remove();
  }
});

const deleteButtons = document.querySelectorAll(".delete-button");

if (deleteButtons) {
  console.log("delete buttons");
  console.log(deleteButtons);
  // Add a click event listener to each delete button
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;

      $.ajax({
        type: "POST",
        url: "/delete_notification",
        data: JSON.stringify(itemId),
        contentType: "application/json",
        success: function (response) {
          console.log(response);
          // Notify the mediator that the data has been deleted
          mediator.notify("dataDeleted", { button: button, itemId: itemId });
        },
      });
    });
  });
}

// main_dashboard.html

$.get("/data", function (data) {
  mediator.notify("get_chart_data", data);
});

mediator.register("dataAdded", function () {
  window.location.href = "/watchlist.html";
});

mediator.register("get_chart_data", function (data) {
  const tableBody = document.querySelector("#Dashboard_tbody");

  if (tableBody) {
    //stockData = JSON.parse(stockData);
    for (const [symbol, financialData] of Object.entries(data)) {
      const row = document.createElement("tr");

      const symbolCell = document.createElement("td");
      symbolCell.textContent = symbol;
      row.appendChild(symbolCell);

      const currentPriceCell = document.createElement("td");
      currentPriceCell.textContent =
        financialData.financialData.currentPrice.fmt;
      row.appendChild(currentPriceCell);

      const targetHighPriceCell = document.createElement("td");
      targetHighPriceCell.textContent =
        financialData.financialData.targetHighPrice.fmt;
      row.appendChild(targetHighPriceCell);

      const targetLowPriceCell = document.createElement("td");
      targetLowPriceCell.textContent =
        financialData.financialData.targetLowPrice.fmt;
      row.appendChild(targetLowPriceCell);

      const targetMeanPriceCell = document.createElement("td");
      targetMeanPriceCell.textContent =
        financialData.financialData.targetMeanPrice.fmt;
      row.appendChild(targetMeanPriceCell);

      const targetMedianPriceCell = document.createElement("td");
      targetMedianPriceCell.textContent =
        financialData.financialData.targetMedianPrice.fmt;
      row.appendChild(targetMedianPriceCell);

      const recommendationCell = document.createElement("td");
      recommendationCell.appendChild(
        document.createTextNode(financialData.financialData.recommendationKey)
      );
      row.appendChild(recommendationCell);

      const addButtonCell = document.createElement("td");
      const addButton = document.createElement("button");
      addButton.textContent = "Add";
      addButton.classList.add("btn", "btn-block", "btn-info");
      addButton.setAttribute("type", "button");
      addButtonCell.appendChild(addButton);

      addButton.addEventListener("click", function () {
        const requestData = {
          [symbol]: financialData,
        };
        console.log(financialData.financialData);
        console.log(requestData);
        $.ajax({
          type: "POST",
          url: "/add_to_watchlist",
          data: JSON.stringify(requestData),
          contentType: "application/json",
          success: function (response) {
            console.log(response);
            // Notify the mediator that the data has been added
            mediator.notify("dataAdded");
          },
        });
      });

      addButtonCell.appendChild(addButton);
      row.appendChild(addButtonCell);

      tableBody.appendChild(row);
    }
  }
});

$.get("/main-dashboard-news-data", function (data) {
  mediator.notify("newsDataUpdated", data);
});

mediator.register("newsDataUpdated", function (newsData) {
  // Get the table body element
  //console.log(newsData)
  newsData = JSON.parse(newsData);

  for (const [symbol, newsItem] of Object.entries(newsData)) {
    const cardId = `#${symbol}_news_card`; // Construct the card ID based on the current symbol

    const card = document.querySelector(cardId);

    if (card) {
      // Update the card elements with data from the current newsItem
      const cardImg = card.querySelector("img");
      const cardTitle = card.querySelector("h2");
      const cardText = card.querySelector("p");
      const cardSource = card.querySelector(".card-footer span:first-child");
      const cardTime = card.querySelector(".card-footer span:last-child");

      cardImg.src = newsItem.banner_image;
      cardTitle.textContent = newsItem.title;
      cardText.textContent = newsItem.summary;
      cardSource.textContent = newsItem.source;

      const timeString = newsItem.time_published;
      console.log(newsItem.time_published);
      const date = new Date(
        timeString.slice(0, 4),
        Number(timeString.slice(4, 6)) - 1,
        timeString.slice(6, 8),
        timeString.slice(9, 11),
        timeString.slice(11, 13),
        timeString.slice(13, 15)
      );

      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      console.log(formattedDate);
      cardTime.textContent = formattedDate;
    }
  }
});

// Register a handler function with the mediator to update the data when it becomes available
mediator.register("dataUpdated", function () {
  location.reload();
});

// Watchlist.html
const refreshBtn = document.getElementById("refreshBtn");

if (refreshBtn) {
  refreshBtn.addEventListener("click", function () {
    $.ajax({
      type: "POST",
      url: "/update_data",
      data: JSON.stringify([]),
      contentType: "application/json",
      success: function (response) {
        console.log(response);
        // Notify the mediator that the data has been updated
        mediator.notify("dataUpdated");
      },
    });
  });
}

$.get("/add_to_watchlist", function (data) {
  mediator.notify("getStockData", data);
});

mediator.register("dataRemoved", function () {
  window.location.href = "/watchlist.html";
});

var updateChart = (symbol) => {
  console.log(symbol);

  // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key

  var api_key = "8X74CQALL5BWTHJE";

  var url =
    "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" +
    symbol +
    "&apikey=" +
    api_key;
  $.ajax({
    url: url,
    dataType: "json",
    success: function (data) {
      // data is successfully parsed as a JSON object:

      console.log(data);
      const weekly_time_series = data["Weekly Time Series"];
      console.log(weekly_time_series);

      // Notify the mediator that the weekly time series data has been loaded
      mediator.notify("weeklyDataLoaded", weekly_time_series);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error:", textStatus, errorThrown);
    },
  });
};

mediator.register("getStockData", function (stockData) {
  //const stockData = JSON.parse(stocks);
  const tableBody = document.querySelector("#watchlist_tbody");

  if (tableBody) {
    console.log(stockData);

    // Select the list element by its ID
    const symbolList = document.getElementById("symbol-list");

    for (const [symbol] of Object.entries(stockData)) {
      // Create a new list item element
      const listItem = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = "#";
      anchor.textContent = symbol;
      anchor.onclick = function (event) {
        event.preventDefault();

        // remove the selected class from all links
        const symbolLinks = symbolList.getElementsByTagName("a");

        // Create a new anchor element with an onclick function that passes the symbol to the updateChart function
        for (var j = 0; j < symbolLinks.length; j++) {
          symbolLinks[j].classList.remove("selected");
        }

        // add the selected class to the clicked link
        event.target.classList.add("selected");

        updateChart(symbol);
      };

      // Append the anchor element to the list item
      listItem.appendChild(anchor);

      // Append the list item to the list
      symbolList.appendChild(listItem);
    }

    // add the selected class to the first link element in the list
    const firstLink = symbolList.querySelector("a");
    firstLink.classList.add("selected");
    updateChart(firstLink.textContent);

    for (const [symbol, financialData] of Object.entries(stockData)) {
      console.log(symbol);
      console.log(financialData);
      const row = document.createElement("tr");

      const symbolCell = document.createElement("td");
      symbolCell.textContent = symbol;
      row.appendChild(symbolCell);

      const currentPriceCell = document.createElement("td");
      currentPriceCell.textContent =
        financialData.financialData.currentPrice.fmt;
      row.appendChild(currentPriceCell);

      const targetHighPriceCell = document.createElement("td");
      targetHighPriceCell.textContent =
        financialData.financialData.targetHighPrice.fmt;
      row.appendChild(targetHighPriceCell);

      const targetLowPriceCell = document.createElement("td");
      targetLowPriceCell.textContent =
        financialData.financialData.targetLowPrice.fmt;
      row.appendChild(targetLowPriceCell);

      const targetMeanPriceCell = document.createElement("td");
      targetMeanPriceCell.textContent =
        financialData.financialData.targetMeanPrice.fmt;
      row.appendChild(targetMeanPriceCell);

      const targetMedianPriceCell = document.createElement("td");
      targetMedianPriceCell.textContent =
        financialData.financialData.targetMedianPrice.fmt;
      row.appendChild(targetMedianPriceCell);

      // Create the recommendation cell
      const recommendationCell = document.createElement("td");
      recommendationCell.appendChild(
        document.createTextNode(financialData.financialData.recommendationKey)
      );
      row.appendChild(recommendationCell);

      const addButtonCell = document.createElement("td");
      const addButton = document.createElement("button");
      addButton.textContent = "Delete";
      addButton.classList.add("btn", "btn-block", "btn-info");
      addButton.setAttribute("type", "button");
      addButtonCell.appendChild(addButton);

      addButton.addEventListener("click", function () {
        const requestData = {
          [symbol]: financialData,
        };
        console.log(financialData.financialData);
        console.log(requestData);
        $.ajax({
          type: "POST",
          url: "/remove_from_watchlist",
          data: JSON.stringify(requestData),
          contentType: "application/json",
          success: function (response) {
            console.log(response);
            // Notify the mediator that the data has been removed
            mediator.notify("dataRemoved");
          },
        });
      });

      addButtonCell.appendChild(addButton);
      row.appendChild(addButtonCell);

      // Add the row to the table body
      tableBody.appendChild(row);
    } // End of For Loop
  }
});

const options = {
  responsive: true,
  title: {
    display: true,
    text: "Stock Prices",
    fontColor: "white",
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: false,
          fontColor: "white",
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "white",
        },
      },
    ],
  },
  legend: {
    labels: {
      fontColor: "white",
    },
  },
};
var mode = "index";
var intersect = true;
var ticksStyle = {
  fontColor: "#495057",
  fontStyle: "bold",
};

var myChart
// Create the chart
if(document.getElementById("myChart"))
{
  const ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: [],
    //data:  getSymbolWeeklyData(jsonData),
    options: options,
  });

}

mediator.register("weeklyDataLoaded", function (weekly_time_series) {
  if (myChart) {
    myChart.data = getSymbolWeeklyData(weekly_time_series);
    myChart.update();
  }
});



var getSymbolWeeklyData = (jsonData) => {
  // Extract labels and datasets from JSON data
  const labels = Object.keys(jsonData).reverse();
  const openPrices = [];
  const closePrices = [];

  for (let date in jsonData) {
    openPrices.push(parseFloat(jsonData[date]["1. open"]));
    closePrices.push(parseFloat(jsonData[date]["4. close"]));
  }

  // Define the data
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Open Price",
        data: openPrices,
        type: "line",
        backgroundColor: "transparent",
        borderColor: "#007bff",
        pointBorderColor: "#007bff",
        pointBackgroundColor: "#007bff",
        fill: false,
        pointRadius: 0,
        // pointHoverBackgroundColor: '#007bff',
        // pointHoverBorderColor    : '#007bff'
      },
      {
        label: "Close Price",
        data: closePrices,
        type: "line",
        pointRadius: 0,
        borderColor: "#ced4da",
        pointBorderColor: "#ced4da",
        pointBackgroundColor: "#ced4da",
        fill: true,
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Set a slightly tr
        // pointHoverBackgroundColor: '#ced4da',
        // pointHoverBorderColor    : '#ced4da'
      },
    ],
  };
  return data;
};


