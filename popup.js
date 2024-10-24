function set(name) {
  chrome.storage.sync.get(name, function (data) {
    document.getElementById(name).checked = data[name];
  });
  document.getElementById(name).addEventListener('change', function () {
    let da = {};
    da[name] = document.getElementById(name).checked
    chrome.storage.sync.set(da);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  ['enabled','down','noads','novideoads','norick','nocurves','noshorts','nothanks','nomix','nopink'].forEach(e => {
    set(e)
  })
  
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
      console.log(key)
      document.getElementById(key).checked = changes[key].newValue;
    }
  })
  
  var manifestData = chrome.runtime.getManifest();
  document.getElementById('ver').innerHTML = 'v'+manifestData.version+' m'+manifestData.manifest_version;
  chrome.commands.getAll((commands) => {
    commands.forEach((command) => {
      if (command.shortcut) document.querySelector('label[for="'+command.name+'"]').insertAdjacentHTML('afterend', command.shortcut.split('+').map(key => key.trim()).map(e=>{return `<kbd>${e}</kbd>`}).join('+'))
    });
  });
});
