// On chrome initialization
chrome.runtime.onInstalled.addListener(function () {
  function nullish(name, def) {
    chrome.storage.sync.get(name, function (data) {
      if (data[name] == null) {
        let h = {};
        h[name] = def;
        chrome.storage.sync.set(h);
      }
    });
  }
  // Default settings
  nullish('enabled', false);
  nullish('down', true);
  nullish('noads', true);
  nullish('novideoads', false);
  nullish('norick', false);
  nullish('nocurves', false);
  nullish('noshorts', false);
  nullish('nothanks', true);
  nullish('nomix', false);
  nullish('nopink', false);

  // Shortcuts
  chrome.commands.onCommand.addListener((command) => {
    chrome.storage.sync.get(command, function (data) {
      let payload = {};
      payload[command] = !data[command]
      chrome.storage.sync.set(payload);
    });
  });
});
