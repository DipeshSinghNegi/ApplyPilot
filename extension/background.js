chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "AddToken") {
    chrome.storage.local.set({ token: message.token }, () => {
      console.log("Token saved to Chrome storage");
    });
  }
});
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 420,
    height: 650,
    focused: true
  });
});

