const applicableSites = ["gocharting", "futures"];

let injectedTabs = {};

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  console.log(`Removing tab at: ${getCurrentTime()}`);
  delete injectedTabs[tabId];
});

chrome.webNavigation.onCommitted.addListener(function (details) {
  if (details.transitionType === "reload") {
    console.log(`Removing tab for ${details.url} at: ${getCurrentTime()}`);
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
    const options = { timeZone: "America/New_York" };
    const currentTime = new Date().toLocaleString("en-US", options);
    console.log(`Executing script at: ${getCurrentTime()}`);

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

function getCurrentTime() {
  const options = { timeZone: "America/New_York" };
  return new Date().toLocaleString("en-US", options);
}
