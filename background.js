// On chrome initialization
chrome.runtime.onInstalled.addListener(function () {
  // Default settings
  chrome.storage.sync.get('enabled', function (data) {
    if (data.enabled == null) {
      chrome.storage.sync.set({ 'enabled': false });
      chrome.storage.sync.set({ 'down': true });
      chrome.storage.sync.set({ 'noads': true });
      chrome.storage.sync.set({ 'nocurves': false });
      chrome.storage.sync.set({ 'noshorts': false });
      chrome.storage.sync.set({ 'nothanks': true });
      chrome.storage.sync.set({ 'nomix': true });
    }
  });
  
  // Shortcuts
  chrome.commands.onCommand.addListener((command) => {
    chrome.storage.sync.get(command, function (data) {
      let payload = {};
      payload[command] = !data[command]
      chrome.storage.sync.set(payload);
    });
  });
});