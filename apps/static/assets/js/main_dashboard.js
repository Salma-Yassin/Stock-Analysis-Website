import { Mediator } from "../mediator.js";

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