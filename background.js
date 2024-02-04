const applicableSites = ["gocharting", "futures"];

chrome.action.onClicked.addListener(function (tab) {
  console.log("executing script");
  let websiteName = tab.url.split("//")[1].split(".")[0];

  if (applicableSites.includes(websiteName)) {
    console.log("we are on the gocharting web page");

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  }
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
