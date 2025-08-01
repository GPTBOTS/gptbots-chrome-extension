chrome.action.onClicked.addListener((tab) => {
  console.log('onClicked', tab);
  chrome.sidePanel.setOptions({ path: 'side_panel/index.html', enabled: true }, function () {
    chrome.sidePanel.open({ tabId: tab.id });
  });
});
