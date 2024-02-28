(function () {
  var observer;

  var observerConfig = {
    childList: true,
    subtree: true,
  };

  var positionDirection = {
    longText: "long position",
    shortText: "short position",
  };

  const marketBuyButton = document.createElement("button");
  marketBuyButton.textContent = "MarketBuy";
  marketBuyButton.style.padding = ".4rem";
  marketBuyButton.style.fontSize = "1rem";
  marketBuyButton.style.marginInline = ".2rem";
  marketBuyButton.style.borderRadius = ".4rem";
  marketBuyButton.style.border = "none";
  marketBuyButton.style.backgroundColor = "rgb(41, 98, 255)";

  const LimitBuyButton = document.createElement("button");
  LimitBuyButton.textContent = "LimitBuy";
  LimitBuyButton.style.padding = ".4rem";
  LimitBuyButton.style.fontSize = "1rem";
  LimitBuyButton.style.marginInline = ".2rem";
  LimitBuyButton.style.borderRadius = ".4rem";
  LimitBuyButton.style.border = "none";
  LimitBuyButton.style.backgroundColor = "rgb(41, 98, 255)";

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
    iframeDocument =
      iframeContainer.firstElementChild.contentDocument || iframeContainer.firstElementChild.contentWindow.document;

    //Testing mutationobserver
    if (!observer) {
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
                buttonParent.appendChild(marketBuyButton);
                buttonParent.appendChild(LimitBuyButton);
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
    risk: 3,
    entryPrice: 0,
    profitPrice: 0,
    stopPrice: 0,
    profit: 0,
    loss: 0,
    positionSize: 0,
    doCalculations: function () {
      var lossPercent = Math.abs(((this.entryPrice - this.stopPrice) / this.entryPrice) * 100);
      var profitPercent = Math.abs(((this.entryPrice - this.profitPrice) / this.entryPrice) * 100);

      lossPercent = lossPercent / 100;
      this.positionSize = this.risk / lossPercent;
      this.profit = this.positionSize + this.positionSize * (profitPercent / 100);
      this.loss = this.positionSize * (1 - lossPercent);
    },
  };

  var longing = false;

  //appendedPositionButton event, extract code from above into a common function
  marketBuyButton.addEventListener("click", calculatePriceBuyPosition);
  LimitBuyButton.addEventListener("click", calculatePriceBuyPosition);

  function calculatePriceBuyPosition(e) {
    let market = false;
    if (e.target.textContent === "MarketBuy") {
      market = true;
    } else {
    }
    extractPricesFromWindow();
    executePosition(market);
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
    // var buttonContainer = overlapManager.querySelectorAll("button")[1].parentElement;
    // buttonContainer.appendChild(marketBuyButton);

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
      console.log("Unable to extract all prices...");
      return;
    }

    //update the prices object with the extracted values
    prices.entryPrice = parseFloat(entryLevel.value);
    prices.profitPrice = parseFloat(profitLevel.value);
    prices.stopPrice = parseFloat(stopLevel.value);

    prices.doCalculations();
  }

  function executePosition(market) {
    //element for grabbing position size input
    let buyTabs = document.querySelector(".EntrustTabs_entrustTabs__adV4G");
    let buyTabsList = buyTabs.querySelectorAll("span");
    let limiTab = buyTabsList[0];
    let marketTab = buyTabsList[1];

    var quantityDiv;
    var quantityInput;
    var priceInput;

    if (market) {
      marketTab.click();
      console.log(marketTab);
      quantityDiv = document.querySelector(".component_numberInput__h86N3");
      quantityInput = quantityDiv.querySelector("input");
    } else {
      limiTab.click();
      console.log(limiTab);
      quantityDiv = document.querySelectorAll(".component_numberInput__h86N3");

      priceInput = quantityDiv[0].querySelectorAll("input")[0];
      quantityInput = quantityDiv[1].querySelectorAll("input")[0];
    }

    console.log(quantityInput);
    console.log(priceInput);

    //need to get the price and quantity size if limit buy
    // console.log(quantityDiv);

    //validation
    // if (!quantityDiv) {
    //   console.log("can't find position size window");
    //   return;
    // }

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
