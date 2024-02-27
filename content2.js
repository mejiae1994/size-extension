(function () {
  var observer;

  //const variables
  var observerConfig = {
    childList: true,
    subtree: true,
  };

  var positionDirection = {
    longText: "long position",
    shortText: "short position",
  };

  // If the element doesn't exist, create and inject it
  console.log("adding content");
  var newDiv = document.createElement("div");
  newDiv.id = "myExtensionDiv";
  newDiv.style.position = "fixed";
  newDiv.style.top = "10px";
  newDiv.style.left = "10px";
  newDiv.style.zIndex = -10000;
  newDiv.style.color = "#fff";
  document.body.appendChild(newDiv);

  // Create the div
  var riskDiv = document.createElement("div");

  // Create the label
  var label = document.createElement("label");
  label.setAttribute("for", "account-risk");
  label.textContent = "Account Risk: ";

  // Create the select
  var select = document.createElement("select");
  select.name = "account-risk";
  select.id = "account-risk";

  // Create the options
  var optionValues = [3, 5, 10, 15, 20];
  optionValues.forEach(function (value) {
    var option = document.createElement("option");
    option.value = value;
    option.textContent = "$" + value;

    // Set the default selected option
    if (value === 3) {
      option.selected = true;
    }

    // Add the option to the select
    select.appendChild(option);
  });

  // Add the label and select to the div
  riskDiv.appendChild(label);
  riskDiv.appendChild(select);

  var riskPercentLabel = document.createElement("label");
  riskPercentLabel.textContent = "Risk Percentage: ";

  var riskPercentInput = document.createElement("input");
  riskPercentInput.id = "main-input";
  riskPercentInput.type = "text";
  riskPercentInput.inputMode = "numeric";
  riskPercentInput.id = "risk-percentage";
  riskPercentInput.value = "";

  var riskPercentButton = document.createElement("button");
  riskPercentButton.className = "position-button";
  riskPercentButton.textContent = "Get Position Size";

  var amountContainer = document.createElement("div");
  amountContainer.className = "amount-container";

  var amountLabel = document.createElement("label");
  amountLabel.textContent = "Position Amount: ";

  var amountInput = document.createElement("input");
  amountInput.type = "text";
  amountInput.inputMode = "numeric";
  amountInput.id = "position-amount";
  amountInput.readOnly = true;

  amountContainer.appendChild(amountLabel);
  amountContainer.appendChild(amountInput);

  //prices section
  var priceContainer = document.createElement("div");
  amountContainer.className = "prices-container";

  var extractButton = document.createElement("button");
  extractButton.className = "price-button";
  extractButton.textContent = "Extract Price";

  var buyPositionButton = document.createElement("button");
  buyPositionButton.className = "buy-position";
  buyPositionButton.textContent = "Buy Position";

  //entry field
  var entryDiv = document.createElement("div");
  entryDiv.textContent = "Entry Price: ";

  var entrySpan = document.createElement("span");
  entrySpan.id = "entry";
  entrySpan.textContent = 0;

  //target field
  var targetDiv = document.createElement("div");
  targetDiv.textContent = "Target Price: ";

  var targetSpan = document.createElement("span");
  targetSpan.id = "target";
  targetSpan.textContent = 0;

  var stopDiv = document.createElement("div");
  stopDiv.textContent = "Stop Price: ";

  var stopSpan = document.createElement("span");
  stopSpan.id = "stop";
  stopSpan.textContent = 0;

  var profitDiv = document.createElement("div");
  profitDiv.textContent = "Profit: ";

  var profitSpan = document.createElement("span");
  profitSpan.id = "profit";
  profitSpan.textContent = 0;

  var lossDiv = document.createElement("div");
  lossDiv.textContent = "Loss: ";

  var lossSpan = document.createElement("span");
  lossSpan.id = "loss";
  lossSpan.textContent = 0;

  var positionSizeDiv = document.createElement("div");
  positionSizeDiv.textContent = "Position Size: ";

  var positionSizeSpan = document.createElement("span");
  positionSizeSpan.id = "position";
  positionSizeSpan.textContent = 0;

  entryDiv.appendChild(entrySpan);
  targetDiv.appendChild(targetSpan);
  stopDiv.appendChild(stopSpan);
  profitDiv.appendChild(profitSpan);
  lossDiv.appendChild(lossSpan);
  positionSizeDiv.appendChild(positionSizeSpan);

  priceContainer.appendChild(extractButton);
  priceContainer.appendChild(buyPositionButton);
  priceContainer.appendChild(entryDiv);
  priceContainer.appendChild(targetDiv);
  priceContainer.appendChild(stopDiv);
  priceContainer.appendChild(profitDiv);
  priceContainer.appendChild(lossDiv);
  priceContainer.appendChild(positionSizeDiv);

  //Main Div
  newDiv.appendChild(riskDiv);
  newDiv.appendChild(riskPercentLabel);
  newDiv.appendChild(riskPercentInput);
  newDiv.appendChild(riskPercentButton);
  newDiv.appendChild(amountContainer);
  newDiv.appendChild(priceContainer);

  //DOM elements, I already have access to these elements above, probably remove this at some point
  const positionButton = document.querySelector(".position-button");
  const priceButton = document.querySelector(".price-button");
  const riskPercent = document.querySelector("#risk-percentage");
  const positionAmount = document.querySelector("#position-amount");
  const accountRisk = document.querySelector("#account-risk");
  const positionAppendedButton = document.createElement("button");
  positionAppendedButton.textContent = "Buy";
  positionAppendedButton.style.padding = ".5rem";
  positionAppendedButton.style.fontSize = "1.4rem";
  positionAppendedButton.style.marginInline = ".5rem";
  positionAppendedButton.style.borderRadius = ".4rem";
  positionAppendedButton.style.border = "none";
  positionAppendedButton.style.backgroundColor = "rgb(41, 98, 255)";

  //display price elements
  var entry = document.querySelector("#entry");
  var target = document.querySelector("#target");
  var stop = document.querySelector("#stop");
  var profit = document.querySelector("#profit");
  var loss = document.querySelector("#loss");
  var position = document.querySelector("#position");

  //MutationObserver
  //tv_chart_container only shows up if trading view chart is present
  var tvChartLoaded = false;
  var iframeContainer;
  var iframeDocument;

  async function waitForElement() {
    while (!tvChartLoaded) {
      iframeContainer = document.body.querySelector("#tv_chart_container");
      if (iframeContainer) {
        console.log("trading view chart loaded");
        tvChartLoaded = true;
      } else {
        console.log("waiting for trading view chart");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  waitForElement().then(() => {
    console.log(iframeContainer);
    iframeDocument =
      iframeContainer.firstElementChild.contentDocument || iframeContainer.firstElementChild.contentWindow.document;

    //Testing mutationobserver
    if (!observer) {
      console.log("mutation");
      observer = new MutationObserver(function (mutations) {
        //this code blocks repeat too fast
        console.log(`mutating, observer state: ${observer}`);
        for (var mutation of mutations) {
          if (mutation.type === "childList" && mutation.target.id === "overlap-manager-root") {
            console.log("overlap manager captured");
            if (mutation.addedNodes.length > 0) {
              console.log("position window opened");
              console.log(mutation.target);
              var overlapManager = mutation.target;
              //button container to add buy button to website window
              var buttonContainer = overlapManager.querySelectorAll("button")[1];
              if (buttonContainer) {
                var buttonParent = buttonContainer.parentElement;
                buttonParent.appendChild(positionAppendedButton);
              }
            }
          }
        }
      });

      // Pass in the target node (in this case, the body) and the observer configuration
      observer.observe(iframeDocument, observerConfig);
    }
  });

  const prices = {
    risk: accountRisk.value,
    entryPrice: 0,
    profitPrice: 0,
    stopPrice: 0,
    profit: 0,
    loss: 0,
    positionSize: 0,
    updatePrices: function () {
      entry.textContent = this.entryPrice.toFixed(5);
      target.textContent = this.profitPrice.toFixed(5);
      stop.textContent = this.stopPrice.toFixed(5);
      profit.textContent = this.profit.toFixed(1);
      loss.textContent = this.loss.toFixed(1);
      position.textContent = this.positionSize.toFixed(2);
    },
    doCalculations: function () {
      var lossPercent = Math.abs(((this.entryPrice - this.stopPrice) / this.entryPrice) * 100);
      var profitPercent = Math.abs(((this.entryPrice - this.profitPrice) / this.entryPrice) * 100);

      lossPercent = lossPercent / 100;
      this.positionSize = this.risk / lossPercent;
      this.profit = this.positionSize + this.positionSize * (profitPercent / 100);
      this.loss = this.positionSize * (1 - lossPercent);
    },
  };

  // EVENTS
  accountRisk.addEventListener("change", function (e) {
    prices.risk = e.target.value;
  });

  var longing = false;
  priceButton.addEventListener("click", function (e) {
    extractPricesFromWindow();
  });

  buyPositionButton.addEventListener("click", executePosition);

  //appendedPositionButton event, extract code from above into a common function
  positionAppendedButton.addEventListener("click", calculatePriceBuyPosition);

  positionButton.addEventListener("click", calculatePositionSize);

  function calculatePositionSize(event) {
    var riskMultiplier = parseFloat(riskPercent.value) / 100;
    var calculatedAmount = prices.risk / riskMultiplier;
    positionAmount.value = calculatedAmount;
  }

  function calculatePriceBuyPosition() {
    extractPricesFromWindow();
    executePosition();
  }

  function extractPricesFromWindow() {
    longing = false;
    console.log("extracting prices");
    var iframeContainer = document.body.querySelector("#tv_chart_container");

    if (!iframeContainer) {
      console.log("Trading no prices to extract, open position window");
      return;
    }

    var iframeDocument =
      iframeContainer.firstElementChild.contentDocument || iframeContainer.firstElementChild.contentWindow.document;
    var overlapManager = iframeDocument.querySelector("#overlap-manager-root");
    var direction = overlapManager.querySelector(".ellipsis-xqf2SSG7")?.textContent;

    if (!direction) {
      console.log("no position window opened");
      return;
    }

    //button container to add buy button to website window
    var buttonContainer = overlapManager.querySelectorAll("button")[1].parentElement;
    buttonContainer.appendChild(positionAppendedButton);

    var entryLevel = 0;
    var profitLevel = 0;
    var stopLevel = 0;

    if (direction.toLowerCase().trim() === positionDirection.longText) {
      console.log("Long Position activated");
      // price levels for entry, profit, stop
      entryLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongEntryPrice"]');
      profitLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongProfitLevelPrice"]');
      stopLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongStopLevelPrice"]');
      longing = true;
    } else if (direction.toLowerCase().trim() === positionDirection.shortText) {
      console.log("Short Position activated");
      entryLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardshortEntryPrice"]');
      profitLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardshortProfitLevelPrice"]');
      stopLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardshortStopLevelPrice"]');
    }

    if (!entryLevel || !profitLevel || !stopLevel) {
      console.log("not able to extract prices. exiting...");
      return;
    }

    //update the prices object with the extracted values
    prices.entryPrice = parseFloat(entryLevel.value);
    prices.profitPrice = parseFloat(profitLevel.value);
    prices.stopPrice = parseFloat(stopLevel.value);

    prices.doCalculations();
    prices.updatePrices();
  }

  function executePosition() {
    //element for grabbing position size input
    var quantityDiv = document.querySelector(".component_numberInput__h86N3");

    //validation
    if (!quantityDiv) {
      console.log("can't find position size window");
      return;
    }
    var quantityInput = quantityDiv.querySelector("input");

    //element for clicking TP/SL checkbox
    var tpslComponent = document.querySelector(".component_strategyWrapper__wzqv8");
    //validation
    if (!tpslComponent) {
      console.log("can't find target/stop window");
    }
    var tpslCheck = tpslComponent.querySelectorAll(".ant-checkbox-wrapper");

    //element for getting open long/short button
    var openButtonComponent = document.querySelector(".component_VOperateWrapper__Ulmgr");
    var openButtons = openButtonComponent.querySelectorAll("button");

    var tpslDirection;
    var openDirectionButton;
    if (longing) {
      tpslDirection = tpslCheck[0];
      openDirectionButton = openButtons[0];
    } else {
      tpslDirection = tpslCheck[1];
      openDirectionButton = openButtons[1];
    }

    //get checkbox state and if it's already checked, no need to simulate click
    var isTpslChecked = tpslDirection.querySelector("input").checked;
    if (!isTpslChecked) {
      //open TP/SL window
      tpslDirection.click();
    }

    //elements for take profit and stop loss inputs
    var profitComponent = document.querySelector(".component_stopWrapper__wIwi1");
    var inputComponents = profitComponent.querySelectorAll("input");
    var profitInput = inputComponents[0];
    var lossInput = inputComponents[1];

    setInputValueAndDispatchEvent(quantityInput, prices.positionSize);
    setInputValueAndDispatchEvent(profitInput, prices.profitPrice);
    setInputValueAndDispatchEvent(lossInput, prices.stopPrice);

    if (quantityInput.value > 0 && profitInput.value > 0 && lossInput.value > 0) {
      console.log("buying position");
      // openDirectionButton.click();
    } else {
      console.log("could not find any price values");
    }
  }

  function setInputValueAndDispatchEvent(inputElement, value) {
    inputElement.value = value;
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
})();
//TODO:
/* 
Add button to gui to stop mutationobserver when moving mutation observer to chrome.activetab logic
Need to move extract price and buy position logic to be triggered from appended buy button
Need to separate extract values and buy position into separate logic blocks
Need to add button to actual long/short position window
Add coins to a list that I can click on and go to it right away by clicking the link - like long list, short list
Add validation for all logic
*/
