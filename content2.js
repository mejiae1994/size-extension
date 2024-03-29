(function () {
  let observer;

  let observerConfig = {
    childList: true,
    subtree: true,
  };

  let positionDirection = {
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
  marketBuyButton.style.color = "white";
  marketBuyButton.style.backgroundColor = "rgb(41, 98, 255)";

  const LimitBuyButton = document.createElement("button");
  LimitBuyButton.textContent = "LimitBuy";
  LimitBuyButton.style.padding = ".4rem";
  LimitBuyButton.style.fontSize = "1rem";
  LimitBuyButton.style.marginInline = ".2rem";
  LimitBuyButton.style.borderRadius = ".4rem";
  LimitBuyButton.style.border = "none";
  LimitBuyButton.style.color = "white";
  LimitBuyButton.style.backgroundColor = "rgb(41, 98, 255)";

  //tv_chart_container only shows up if trading view chart is present
  let tvChartLoaded = false;
  let iframeContainer;
  let iframeDocument;

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
        for (let mutation of mutations) {
          if (mutation.type === "childList" && mutation.target.id === "overlap-manager-root") {
            if (mutation.addedNodes.length > 0) {
              let overlapManager = mutation.target;
              //button container to add buy button to website window
              let buttonContainer = overlapManager.querySelectorAll("button")[1];
              if (buttonContainer) {
                let buttonParent = buttonContainer.parentElement;
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
      let lossPercent = Math.abs(((this.entryPrice - this.stopPrice) / this.entryPrice) * 100);
      let profitPercent = Math.abs(((this.entryPrice - this.profitPrice) / this.entryPrice) * 100);

      lossPercent = lossPercent / 100;
      this.positionSize = this.risk / lossPercent;
      this.profit = this.positionSize + this.positionSize * (profitPercent / 100);
      this.loss = this.positionSize * (1 - lossPercent);
    },
  };

  let longing = false;

  //appendedPositionButton event, extract code from above into a common function
  marketBuyButton.addEventListener("click", calculatePriceBuyPosition);
  LimitBuyButton.addEventListener("click", calculatePriceBuyPosition);

  function calculatePriceBuyPosition(e) {
    let market = false;
    if (e.target.textContent === "MarketBuy") {
      market = true;
    }
    extractPricesFromWindow();
    executePosition(market);
  }

  function extractPricesFromWindow() {
    longing = false;
    console.log("extracting prices");
    let iframeContainer = document.body.querySelector("#tv_chart_container");

    if (!iframeContainer) {
      console.log("Trading no prices to extract, open position window");
      return;
    }

    let iframeDocument =
      iframeContainer.firstElementChild.contentDocument || iframeContainer.firstElementChild.contentWindow.document;
    let overlapManager = iframeDocument.querySelector("#overlap-manager-root");
    let direction = overlapManager.querySelector(".ellipsis-xqf2SSG7")?.textContent;

    if (!direction) {
      console.log("no position window opened");
      return;
    }

    let entryLevel = 0;
    let profitLevel = 0;
    let stopLevel = 0;

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
    console.log(`Start of execute position. Market buying?: ${market}`);
    //element for grabbing position size input
    let mainDoc = document.querySelector("#mexc_contract_v_open_position");

    let buyTabs = document.querySelector(".EntrustTabs_entrustTabs__adV4G");
    let buyTabsList = buyTabs.querySelectorAll("span");
    let limiTab = buyTabsList[0];
    let marketTab = buyTabsList[1];

    let priceInput;
    let quantityInput;
    let profitInput;
    let lossInput;
    let onTab = false;
    let inputComponents;
    let priceInputs;
    let observer2;
    let selectedTab;

    if (market) {
      if (buyTabs.querySelector(".EntrustTabs_active__CLihm").textContent === "Market") {
        console.log("no need to invoke mutation observer, market tab already selected");
        onTab = true;
      } else {
        console.log("clicking market tab");
        selectedTab = marketTab;
      }
    } else {
      if (buyTabs.querySelector(".EntrustTabs_active__CLihm").textContent === "Limit") {
        console.log("no need to invoke mutation observer, limit tab already selected");
        onTab = true;
      } else {
        console.log("clicking limit tab");
        selectedTab = limiTab;
      }
    }

    //element for clicking TP/SL checkbox
    let tpslComponent = document.querySelector(".component_strategyWrapper__wzqv8");
    let tpslCheck = tpslComponent.querySelectorAll(".ant-checkbox-wrapper");

    //element for getting open long/short button
    let openButtonComponent = document.querySelector(".component_VOperateWrapper__Ulmgr");
    let openButtons = openButtonComponent.querySelectorAll("button");

    let tpslDirection;
    let openDirectionButton;
    if (longing) {
      tpslDirection = tpslCheck[0];
      openDirectionButton = openButtons[0];
    } else {
      tpslDirection = tpslCheck[1];
      openDirectionButton = openButtons[1];
    }

    //get checkbox state and if it's already checked, no need to simulate click
    let isTpslChecked = tpslDirection.querySelector("input").checked;
    if (!isTpslChecked) {
      //open TP/SL window
      tpslDirection.click();
    }

    if (onTab) {
      console.log("on tab");
      if (market) {
        inputComponents = mainDoc.querySelector(".component_inputWrapper__PxwkC");
        priceInputs = inputComponents.querySelectorAll("input");
        console.log(priceInputs);
        quantityInput = priceInputs[0];
        profitInput = priceInputs[4];
        lossInput = priceInputs[5];
      } else {
        inputComponents = mainDoc.querySelector(".component_inputWrapper__PxwkC");
        priceInputs = inputComponents.querySelectorAll("input");
        console.log(priceInputs);
        priceInput = priceInputs[0];
        quantityInput = priceInputs[1];
        profitInput = priceInputs[4];
        lossInput = priceInputs[5];
      }
    } else {
      console.log("not on tab");
      observer2 = new MutationObserver(function (mutations) {
        console.log("second mutation");
        console.log(mutations);
        for (let mutation of mutations) {
          console.log("inside mutation loop");
          console.log(mutation);
          if (mutation.target.className === "component_inputWrapper__PxwkC") {
            console.log(mutation.target.querySelectorAll("input"));
            let priceInputs = mutation.target.querySelectorAll("input");
            if (market) {
              quantityInput = priceInputs[0];
              profitInput = priceInputs[4];
              lossInput = priceInputs[5];
            } else {
              priceInput = priceInputs[0];
              quantityInput = priceInputs[1];
              profitInput = priceInputs[4];
              lossInput = priceInputs[5];
            }

            if (!market) {
              setInputValueAndDispatchEvent(priceInput, prices.entryPrice);
            }
            setInputValueAndDispatchEvent(quantityInput, prices.positionSize);
            setInputValueAndDispatchEvent(profitInput, prices.profitPrice);
            setInputValueAndDispatchEvent(lossInput, prices.stopPrice);

            if (quantityInput.value > 0 && profitInput.value > 0 && lossInput.value > 0) {
              console.log("buying position");
              // openDirectionButton.click();
            } else {
              console.log("could not find any price values");
            }
            observer2.disconnect();
          }
        }
      });
      console.log("observer2 about to observe");
      observer2.observe(mainDoc, observerConfig);

      if (!onTab) {
        console.log("clicking tab inside observer block");
        selectedTab.click();
      }
    }

    //need to get the price and quantity size if limit buy
    // console.log(quantityDiv);
    if (onTab) {
      if (!market) {
        setInputValueAndDispatchEvent(priceInput, prices.entryPrice);
      }
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
  }

  function setInputValueAndDispatchEvent(inputElement, value) {
    console.log(`setting ${inputElement.outerHTML} value to: ${value}`);
    inputElement.value = value;
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
})();
//TODO:
/*
current issue: if its on limit, when I click on buy market, prices are not inputted 
Add button to gui to stop mutationobserver when moving mutation observer to chrome.activetab logic
Need to move extract price and buy position logic to be triggered from appended buy button
Need to separate extract values and buy position into separate logic blocks
Need to add button to actual long/short position window
Add coins to a list that I can click on and go to it right away by clicking the link - like long list, short list
Add validation for all logic
*/
