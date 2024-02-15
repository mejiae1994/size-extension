// Check if the element already exists
var existingDiv = document.getElementById("myExtensionDiv");

var observer;

if(!observer) {
  let timeout = null;

  observer = new MutationObserver(function(mutations) {

    if (timeout) return;

    timeout = setTimeout(function() {
      console.log("running")

      timeout = null;
  
      let iframeContainer = document.body.querySelector("#tv_chart_container").firstElementChild
      let iframeDocument = iframeContainer.contentDocument || iframeContainer.contentWindow.document;
      let overlapManager = iframeDocument.querySelector("#overlap-manager-root")

      console.log(overlapManager)
      console.log(overlapManager.hasChildNodes())
      if(!overlapManager.hasChildNodes()) {
        console.log("No long or short position window openened")
        return;
      }
      
      console.log("found iframe document with content")
        // Try to find your elements
      var entryLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongEntryPrice"]');
      var profitLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongProfitLevelPrice"]');
      var stopLevel = iframeDocument.querySelector('[data-property-id="Risk/RewardlongStopLevelPrice"]');

      // If all elements are found, log them and disconnect the observer
      if (entryLevel && profitLevel && stopLevel) {
        console.log('Entry level:', entryLevel);
        console.log('Profit level:', profitLevel);
        console.log('Stop level:', stopLevel);
    
        // Disconnect the observer
        observer.disconnect();
      }
      }, 1000);
  });
  
  // Configuration of the observer
  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };
  
  // Pass in the target node (in this case, the body) and the observer configuration
  observer.observe(document.body, config);
}

if (existingDiv) {
  console.log("removing content");
  // If the element exists, remove it
  existingDiv.remove();
  observer.disconnect();
  observer = null;
} else {
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
  var optionValues = [5, 10, 15, 20];
  optionValues.forEach(function(value) {
    var option = document.createElement("option");
    option.value = value;
    option.textContent = "$" + value;

    // Set the default selected option
    if (value === 5) {
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

  //DOM elements
  const positionButton = document.querySelector(".position-button");
  const priceButton = document.querySelector(".price-button");
  const riskPercent = document.querySelector("#risk-percentage");
  const positionAmount = document.querySelector("#position-amount");
  const accountRisk = document.querySelector("#account-risk");

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
      entry.textContent = this.entryPrice;
      target.textContent = this.profitPrice;
      stop.textContent = this.stopPrice;
      profit.textContent = this.profit.toFixed(1);
      loss.textContent = this.loss.toFixed(1);
      position.textContent = this.positionSize;
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

  // priceButton.addEventListener("click", function (e) {
  //   let test = newDiv.parentElement
    
  //   console.log(test)

  //   let testdiv = newDiv.parentElement.querySelector(".ellipsis-xqf2SSG7")

  //   console.log(testdiv)
  //   // price levels for entry, profit, stop
  //   var entryLevel = document.querySelector(
  //     '[data-property-id="Risk/RewardlongEntryPrice"]'
  //   );

  //   var profitLevel = document.querySelector(
  //     '[data-property-id="Risk/RewardlongProfitLevelPrice"]'
  //   );

  //   var stopLevel = document.querySelector(
  //     '[data-property-id="Risk/RewardlongStopLevelPrice"]'
  //   );

  //   if(!entryLevel || !profitLevel || !stopLevel ) {
  //     console.log("not able to extract prices. exiting...");
  //     return;
  //   }

  //   prices.entryPrice = entryLevel.value;
  //   prices.profitPrice = profitLevel.value;
  //   prices.stopPrice = stopLevel.value;

  //   prices.doCalculations();
  //   prices.updatePrices();
  // });

    

  positionButton.addEventListener("click", calculatePositionSize);

  function calculatePositionSize(event) {
    let riskMultiplier = parseFloat(riskPercent.value) / 100;
    let calculatedAmount = prices.risk / riskMultiplier;
    positionAmount.value = calculatedAmount;
  }
  
}
