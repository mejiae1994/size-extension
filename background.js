const applicableSites = ["gocharting", "futures"];

let injectedTabs = {};

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  console.log("removing tab");
  delete injectedTabs[tabId];
});

chrome.webNavigation.onCommitted.addListener(function (details) {
  if (details.transitionType === "reload") {
    console.log("removing tab");
    delete injectedTabs[details.tabId];
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status !== "complete") {
    return;
  }

  let websiteName;
  if (tab.url) {
    websiteName = tab.url.split("//")[1].split(".")[0];
  }

  if (websiteName && applicableSites.includes(websiteName) && changeInfo.status === "complete" && !injectedTabs[tab.id]) {
    console.log("website is: ", websiteName);
    const options = { timeZone: "America/New_York" };
    const currentTime = new Date().toLocaleString("en-US", options);
    console.log(`executing script at ${currentTime}`);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content2.js"],
    });

    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["styles.css"],
    });

    injectedTabs[tab.id] = true;
  }
});
