
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
      this.handlers[key].forEach(function(handler) {
        handler(data);
      });
    }
  }

  // Create a new Mediator object
  const mediator = new Mediator();

  /*var getStockData = $.get('/main-dashboard-data');
 // Get the table body element
   const tableBody = document.querySelector("tbody");
   getStockData.done(function (stocks) {
   const stockData = JSON.parse(stocks);
   const tableBody = document.querySelector("tbody");*/
  mediator.register("dataAdded", function () {
    window.location.href = "/watchlist.html";
  });

  mediator.register("get_chart_data", function (data) {
    const tableBody = document.querySelector("tbody");
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
  });

  $.get("/data", function (data) {
    mediator.notify("get_chart_data", data);
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
  });


// Register a handler function with the mediator to update the data when it becomes available
mediator.register("dataUpdated", function () {
  location.reload();
});

// Attach the onclick event listener using JavaScript
const refreshBtn = document.getElementById("refreshBtn");
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

$.get("/add_to_watchlist", function (data) {
  mediator.notify("getStockData", data);
});

mediator.register("dataRemoved", function () {
  window.location.href = "/watchlist.html";
});

mediator.register("getStockData", function (stockData) {
  //const stockData = JSON.parse(stocks);
  const tableBody = document.querySelector("tbody");
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
    currentPriceCell.textContent = financialData.financialData.currentPrice.fmt;
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
});

mediator.register("weeklyDataLoaded", function (weekly_time_series) {
  myChart.data = getSymbolWeeklyData(weekly_time_series);
  myChart.update();
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

const jsonData = {
  "2023-04-28": {
    "1. open": "125.5500",
    "2. high": "127.2500",
    "3. low": "124.5600",
    "4. close": "126.4100",
    "5. volume": "20644224",
  },
  "2023-04-21": {
    "1. open": "128.3000",
    "2. high": "130.9800",
    "3. low": "125.2700",
    "4. close": "125.7300",
    "5. volume": "30341128",
  },
  "2023-04-14": {
    "1. open": "129.8300",
    "2. high": "131.1050",
    "3. low": "126.0000",
    "4. close": "128.1400",
    "5. volume": "19506500",
  },
  "2023-04-06": {
    "1. open": "130.9700",
    "2. high": "132.6100",
    "3. low": "130.3150",
    "4. close": "130.5000",
    "5. volume": "13172262",
  },
  "2023-03-31": {
    "1. open": "126.4700",
    "2. high": "131.4800",
    "3. low": "126.4700",
    "4. close": "131.0900",
    "5. volume": "20779522",
  },
  "2023-03-24": {
    "1. open": "124.3100",
    "2. high": "127.2150",
    "3. low": "122.6000",
    "4. close": "125.2900",
    "5. volume": "20458253",
  },
  "2023-03-17": {
    "1. open": "125.1500",
    "2. high": "128.1900",
    "3. low": "121.7100",
    "4. close": "123.6900",
    "5. volume": "66132690",
  },
  "2023-03-10": {
    "1. open": "129.6400",
    "2. high": "130.8600",
    "3. low": "125.1300",
    "4. close": "125.4500",
    "5. volume": "20761401",
  },
  "2023-03-03": {
    "1. open": "131.4200",
    "2. high": "131.8700",
    "3. low": "127.7100",
    "4. close": "129.6400",
    "5. volume": "17865677",
  },
  "2023-02-24": {
    "1. open": "134.0000",
    "2. high": "134.3850",
    "3. low": "128.8600",
    "4. close": "130.5700",
    "5. volume": "14198950",
  },
  "2023-02-17": {
    "1. open": "136.0000",
    "2. high": "137.3900",
    "3. low": "133.8900",
    "4. close": "135.0200",
    "5. volume": "16543870",
  },
  "2023-02-10": {
    "1. open": "135.8300",
    "2. high": "136.7400",
    "3. low": "133.3400",
    "4. close": "135.6000",
    "5. volume": "22140989",
  },
};

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
// Define the options
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
/*const options = {
    title: {
      display: true,
      text: 'Stock Prices'
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: mode,
      intersect: intersect
    },
    hover: {
      mode: mode,
      intersect: intersect
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        // display: false,
        gridLines: {
          display: true,
          lineWidth: '4px',
          color: 'rgba(0, 0, 0, .2)',
          zeroLineColor: 'transparent'
        },
        ticks: $.extend({
          beginAtZero: true,
          suggestedMax: 200
        }, ticksStyle)
      }],
      xAxes: [{
        display: true,
        gridLines: {
          display: false
        },
        ticks: ticksStyle
      }]
    }
  };*/

// Create the chart
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: [],
  //data:  getSymbolWeeklyData(jsonData),
  options: options,
});
/* var myChart = new Chart(ctx, {
                         data: {
                           labels: ['18th', '20th', '22nd', '24th', '26th', '28th', '30th'],
                           datasets: [{
                             type: 'line',
                             data: [100, 120, 170, 167, 180, 177, 160],
                             backgroundColor: 'transparent',
                             borderColor: '#007bff',
                             pointBorderColor: '#007bff',
                             pointBackgroundColor: '#007bff',
                             fill: false
                             // pointHoverBackgroundColor: '#007bff',
                             // pointHoverBorderColor    : '#007bff'
                           },
                           {
                             type: 'line',
                             data: [60, 80, 70, 67, 80, 77, 100],
                             backgroundColor: 'tansparent',
                             borderColor: '#ced4da',
                             pointBorderColor: '#ced4da',
                             pointBackgroundColor: '#ced4da',
                             fill: false
                             // pointHoverBackgroundColor: '#ced4da',
                             // pointHoverBorderColor    : '#ced4da'
                           }]
                         },
                         options: {
                           maintainAspectRatio: false,
                           tooltips: {
                             mode: mode,
                             intersect: intersect
                           },
                           hover: {
                             mode: mode,
                             intersect: intersect
                           },
                           legend: {
                             display: false
                           },
                           scales: {
                             yAxes: [{
                               // display: false,
                               gridLines: {
                                 display: true,
                                 lineWidth: '4px',
                                 color: 'rgba(0, 0, 0, .2)',
                                 zeroLineColor: 'transparent'
                               },
                               ticks: $.extend({
                                 beginAtZero: true,
                                 suggestedMax: 200
                               }, ticksStyle)
                             }],
                             xAxes: [{
                               display: true,
                               gridLines: {
                                 display: false
                               },
                               ticks: ticksStyle
                             }]
                           }
                         }
                       })*/
