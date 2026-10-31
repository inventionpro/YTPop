function set(name, prop='checked') {
  chrome.storage.sync.get(name, data=>document.getElementById(name)[prop] = data[name]);
  document.getElementById(name).onchange = (evt)=>{
    let da = {};
    da[name] = evt.target[prop];
    chrome.storage.sync.set(da);
  };
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('input[type="checkbox"]').forEach(elem=>set(elem.id));
  set('progresscolor', 'value');
  set('progresscolorad', 'value');
  set('progresscolorpreroll', 'value');

  chrome.storage.onChanged.addListener((changes)=>{
    for (let key in changes) {
      let elem = document.getElementById(key);
      elem[elem.getAttribute('type')==='checkbox'?'checked':'value'] = changes[key].newValue;
    }
  });

  let manifestData = chrome.runtime.getManifest();
  document.getElementById('ver').innerHTML = `v${manifestData.version} m${manifestData.manifest_version}`;
  chrome.commands.getAll((commands) => {
    commands.forEach((command) => {
      if (command.shortcut) document.querySelector(`label[for="${command.name}"]`).insertAdjacentHTML('afterend', command.shortcut.split('+').map(key=>`<kbd>${key.trim()}</kbd>`).join('+'))
    });
  });
});