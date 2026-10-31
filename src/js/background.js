// On chrome initialization
chrome.runtime.onInstalled.addListener(()=>{
  function nullish(name, def) {
    chrome.storage.sync.get(name, (data)=>{
      if (data[name] == null) {
        let h = {};
        h[name] = def;
        chrome.storage.sync.set(h);
      }
    });
  }
  // Default settings
  nullish('noads', true);
  nullish('noshorts', false);
  nullish('nomix', false);
  nullish('down', true);
  nullish('nothanks', true);
  nullish('progresscolorchange', false);
  nullish('progresscolor', '#ff0033');
  nullish('progresscolorad', '#ffcc00');
  nullish('progresscolorpreroll', '#0033ff');
  nullish('novideoads', false);
  nullish('fixchannelsection', true);
  nullish('enabled', false);
  nullish('nocurves', false);
  nullish('noanimation', false);

  // Shortcuts
  chrome.commands.onCommand.addListener((command) => {
    chrome.storage.sync.get(command, (data)=>{
      let payload = {};
      payload[command] = !data[command];
      chrome.storage.sync.set(payload);
    });
  });
});