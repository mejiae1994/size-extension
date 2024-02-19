// Check if the element already exists
var existingDiv = document.getElementById("myExtensionDiv");

// var observer;

// if(!observer) {
//   let timeout = null;

//   observer = new MutationObserver(function(mutations) {

//     if (timeout) return;

//     timeout = setTimeout(function() {
//       console.log("running")

//       timeout = null;
  
//       let iframeContainer = document.body.querySelector("#tv_chart_container").firstElementChild
//       let iframeDocument = iframeContainer.contentDocument || iframeContainer.contentWindow.document;
//       let overlapManager = iframeDocument.querySelector("#overlap-manager-root")

//       console.log(overlapManager)
//       console.log(overlapManager.hasChildNodes())
//       if(!overlapManager.hasChildNodes()) {
//         console.log("No long or short position window openened")
//         return;
//       }
      
//       console.log("found iframe document with content")
//         // Try to find your elements
//       var entryLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongEntryPrice"]');
//       var profitLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongProfitLevelPrice"]');
//       var stopLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongStopLevelPrice"]');

//       // If all elements are found, log them and disconnect the observer
//       if (entryLevel && profitLevel && stopLevel) {
//         console.log('Entry level:', entryLevel);
//         console.log('Profit level:', profitLevel);
//         console.log('Stop level:', stopLevel);
    
//         // Disconnect the observer
//         observer.disconnect();
//       }
//       }, 1000);
//   });
  
//   // Configuration of the observer
//   var config = {
//     attributes: true,
//     childList: true,
//     characterData: true,
//     subtree: true
//   };
  
//   // Pass in the target node (in this case, the body) and the observer configuration
//   observer.observe(document.body, config);
// }

if (existingDiv) {
  console.log("removing content");
  // If the element exists, remove it
  existingDiv.remove();
  // observer.disconnect();
  // observer = null;
} else {
  //const variables
  const positionDirection = {
    longText: "long position",
    shortText: "short position"
  }

  // If the element doesn't exist, create and inject it
  console.log("adding content");
  var newDiv = document.createElement("div");
  newDiv.id = "myExtensionDiv";
  newDiv.style.position = "fixed";
  newDiv.style.top = "10px";
  newDiv.style.left = "10px";
  newDiv.style.zIndex = 10000;
  newDiv.style.color = "#fff"
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
  optionValues.forEach(function(value) {
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
  
  let riskPercentLabel =  document.createElement('label')
  riskPercentLabel.textContent = 'Risk Percentage: '

  let riskPercentInput = document.createElement('input')
  riskPercentInput.id = "main-input"
  riskPercentInput.type = 'text'
  riskPercentInput.inputMode = 'numeric'
  riskPercentInput.id = 'risk-percentage'
  riskPercentInput.value = ""

  let riskPercentButton = document.createElement('button')
  riskPercentButton.className = "position-button"
  riskPercentButton.textContent = "Get Position Size"

  let amountContainer = document.createElement('div')
  amountContainer.className = 'amount-container'

  let amountLabel = document.createElement('label')
  amountLabel.textContent = 'Position Amount: '

  let amountInput = document.createElement('input')
  amountInput.type = 'text'
  amountInput.inputMode = 'numeric'
  amountInput.id = 'position-amount'
  amountInput.readOnly = true;
  
  amountContainer.appendChild(amountLabel)
  amountContainer.appendChild(amountInput)

  //prices section
  let priceContainer = document.createElement('div')
  amountContainer.className = 'prices-container'

  let extractButton = document.createElement('button')
  extractButton.className = "price-button"
  extractButton.textContent = "Extract Price"
  
  let buyPositionButton = document.createElement('button')
  buyPositionButton.className = "buy-position"
  buyPositionButton.textContent = "Buy Position"

  //entry field
  let entryDiv = document.createElement('div')
  entryDiv.textContent = "Entry Price: "

  let entrySpan = document.createElement("span")
  entrySpan.id = "entry"
  entrySpan.textContent = 0;

  //target field
  let targetDiv = document.createElement('div')
  targetDiv.textContent = "Target Price: "

  let targetSpan = document.createElement("span")
  targetSpan.id = "target"
  targetSpan.textContent = 0;

  let stopDiv = document.createElement('div')
  stopDiv.textContent = "Stop Price: "

  let stopSpan = document.createElement("span")
  stopSpan.id = "stop"
  stopSpan.textContent = 0;

  let profitDiv = document.createElement('div')
  profitDiv.textContent = "Profit: "

  let profitSpan = document.createElement("span")
  profitSpan.id = "profit"
  profitSpan.textContent = 0;

  let lossDiv = document.createElement('div')
  lossDiv.textContent = "Loss: "

  let lossSpan = document.createElement("span")
  lossSpan.id = "loss"
  lossSpan.textContent = 0;

  let positionSizeDiv = document.createElement('div')
  positionSizeDiv.textContent = "Position Size: "

  let positionSizeSpan = document.createElement("span")
  positionSizeSpan.id = "position"
  positionSizeSpan.textContent = 0;

  entryDiv.appendChild(entrySpan)
  targetDiv.appendChild(targetSpan)
  stopDiv.appendChild(stopSpan)
  profitDiv.appendChild(profitSpan)
  lossDiv.appendChild(lossSpan)
  positionSizeDiv.appendChild(positionSizeSpan)

  priceContainer.appendChild(extractButton)
  priceContainer.appendChild(buyPositionButton)
  priceContainer.appendChild(entryDiv)
  priceContainer.appendChild(targetDiv)
  priceContainer.appendChild(stopDiv)
  priceContainer.appendChild(profitDiv)
  priceContainer.appendChild(lossDiv)
  priceContainer.appendChild(positionSizeDiv)

  //Main Div
  newDiv.appendChild(riskDiv)
  newDiv.appendChild(riskPercentLabel)
  newDiv.appendChild(riskPercentInput)
  newDiv.appendChild(riskPercentButton)
  newDiv.appendChild(amountContainer)
  newDiv.appendChild(priceContainer)

  //DOM elements, I already have access to these elements above, probably remove this at some point
  const positionButton = document.querySelector(".position-button");
  const priceButton = document.querySelector(".price-button");
  const riskPercent = document.querySelector("#risk-percentage");
  const positionAmount = document.querySelector("#position-amount");
  const accountRisk = document.querySelector("#account-risk");
  const positionAppendedButton = document.createElement("button")
  positionAppendedButton.textContent = "Buy"
  positionAppendedButton.style.padding = '.5rem'
  positionAppendedButton.style.fontSize = '1.4rem'
  positionAppendedButton.style.marginInline = ".5rem"
  positionAppendedButton.style.borderRadius = ".4rem"
  positionAppendedButton.style.backgroundColor = "rgb(41, 98, 255)"

  //display price elements
  let entry = document.querySelector("#entry");
  let target = document.querySelector("#target");
  let stop = document.querySelector("#stop");
  let profit = document.querySelector("#profit");
  let loss = document.querySelector("#loss");
  let position = document.querySelector("#position")

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
      let lossPercent = Math.abs(
        ((this.entryPrice - this.stopPrice) / this.entryPrice) * 100
      );

      let profitPercent = Math.abs(
        ((this.entryPrice - this.profitPrice) / this.entryPrice) * 100
      );

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

  let longing = false;
  priceButton.addEventListener("click", function (e) {
    let iframeContainer = document.body.querySelector("#tv_chart_container")

    if(!iframeContainer) {
      console.log('Trading no prices to extract, open position window');
      return;
    }

    let iframeDocument = iframeContainer.firstElementChild.contentDocument || iframeContainer.firstElementChild.contentWindow.document;
    let overlapManager = iframeDocument.querySelector("#overlap-manager-root")
    let direction = overlapManager.querySelector(".ellipsis-xqf2SSG7")?.textContent

    if(!direction) {
      console.log("no position window opened")
      return;
    }
    
    //button container to add buy button to website window
    let buttonContainer = overlapManager.querySelectorAll("button")[1].parentElement;
    buttonContainer.appendChild(positionAppendedButton)

    let entryLevel = 0;
    let profitLevel = 0;
    let stopLevel = 0;

    if(!direction) {
      console.log("no position window opened")
      return;
    }

    if(direction.toLowerCase().trim() === positionDirection.longText) {
      console.log("Long Position activated")
        // price levels for entry, profit, stop
      entryLevel = iframeDocument.querySelector(
        '[data-property-id="Risk/RewardlongEntryPrice"]'
      );

      profitLevel = iframeDocument.querySelector(
        '[data-property-id="Risk/RewardlongProfitLevelPrice"]' 
      );

      stopLevel = iframeDocument.querySelector(
        '[data-property-id="Risk/RewardlongStopLevelPrice"]'
      );
      longing = true;
    }
    else if(direction.toLowerCase().trim() === positionDirection.shortText) {
      console.log("Short Position activated")
      entryLevel = iframeDocument.querySelector(
        '[data-property-id="Risk/RewardshortEntryPrice"]'
      );

      profitLevel = iframeDocument.querySelector(
        '[data-property-id="Risk/RewardshortProfitLevelPrice"]' 
      );

      stopLevel = iframeDocument.querySelector(
        '[data-property-id="Risk/RewardshortStopLevelPrice"]'
      );
    }

    if(!entryLevel || !profitLevel || !stopLevel ) {
      console.log("not able to extract prices. exiting...");
      return;
    }

    //update the prices object with the extracted values
    prices.entryPrice = parseFloat(entryLevel.value);
    prices.profitPrice = parseFloat(profitLevel.value);
    prices.stopPrice = parseFloat(stopLevel.value);
   
    prices.doCalculations();
    prices.updatePrices();
  });

  buyPositionButton.addEventListener("click", executePosition)

  //appendedPositionButton event, extract code from above into a common function
  positionAppendedButton.addEventListener("click", executePosition)

  positionButton.addEventListener("click", calculatePositionSize);

  function calculatePositionSize(event) {
    let riskMultiplier = parseFloat(riskPercent.value) / 100;
    let calculatedAmount = prices.risk / riskMultiplier;
    positionAmount.value = calculatedAmount;
  }

  function executePosition(event) {
    //element for grabbing position size input
    let quantityDiv = document.querySelector(".component_numberInput__h86N3")
    
    //validation
    if(!quantityDiv) {
      console.log("can't find position size window")
      return;
    }
    let quantityInput = quantityDiv.querySelector("input")

    //element for clicking TP/SL checkbox
    let tpslComponent = document.querySelector(".component_strategyWrapper__wzqv8")
    //validation
    if(!tpslComponent) {
      console.log("can't find target/stop window");
    }
    let tpslCheck = tpslComponent.querySelectorAll(".ant-checkbox-wrapper")

    //element for getting open long/short button
    let openButtonComponent = document.querySelector(".component_VOperateWrapper__Ulmgr")
    let openButtons = openButtonComponent.querySelectorAll("button")

    let tpslDirection;
    let openDirectionButton;
    if(longing) {
      tpslDirection = tpslCheck[0]
      openDirectionButton = openButtons[0]
    }
    else {
      tpslDirection = tpslCheck[1]
      openDirectionButton = openButtons[1]
    }
    
    //get checkbox state and if it's already checked, no need to simulate click
    let isTpslChecked = tpslDirection.querySelector("input").checked;
    if(!isTpslChecked) {
      //open TP/SL window
      tpslDirection.click();
    }

    //elements for take profit and stop loss inputs
    let profitComponent = document.querySelector(".component_stopWrapper__wIwi1");
    let inputComponents = profitComponent.querySelectorAll("input");
    let profitInput = inputComponents[0];
    let lossInput = inputComponents[1];
  
    setInputValueAndDispatchEvent(quantityInput, prices.positionSize);
    setInputValueAndDispatchEvent(profitInput, prices.profitPrice);
    setInputValueAndDispatchEvent(lossInput, prices.stopPrice);

    if(quantityInput.value > 0 && profitInput.value > 0 && lossInput.value > 0) {
      console.log("buying position");
      // openDirectionButton.click();
    }
    else {
      console.log("could not find any price values")
    }
  }
}

function setInputValueAndDispatchEvent(inputElement, value) {
  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input', { bubbles: true }));
}

//TODO:
/* 
Need to separate extract values and buy position into separate logic blocks
Need to add button to actual long/short position window
Add coins to a list that I can click on and go to it right away by clicking the link - like long list, short list
Add validation for all logic
*/