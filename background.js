const applicableSites = ["gocharting", "futures"];

// chrome.action.onClicked.addListener(function (tab) {
//   let websiteName = tab.url.split("//")[1].split(".")[0];

//   console.log("website is: ", websiteName);
//   if (applicableSites.includes(websiteName)) {
//     console.log("executing script");

//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ["content.js"],
//     });

//     // Inject CSS
//     chrome.scripting.insertCSS({
//       target: { tabId: tab.id },
//       files: ["styles.css"],
//     });
//   }
// });

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    let websiteName = tab.url.split("//")[1].split(".")[0];

    console.log("website is: ", websiteName);
    if (applicableSites.includes(websiteName)) {
      console.log("executing script");

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      // Inject CSS
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["styles.css"],
      });
    }
  });
});

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   console.log(tab);
//   if (changeInfo.status === "complete") {
//     console.log("executing script");

//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       files: ["content.js"],
//     });
//   }
// });
