// Banner
console.log('%cYou%ctube%c %cPop%c\nBetter youtube', 'color:#f00;font-size:40px;font-weight:bold;font-family:Arial', 'background:#f00;color:#fff;border-radius:0.5rem;font-size:40px;font-weight:bold;font-family:Arial', 'font-size:40px', 'color:#b7f;font-size:40px;font-weight:bold;font-family:Arial', 'font-family:Arial');

const delay = ms => new Promise(res => setTimeout(res, ms));

function id() {
  return (window.location.href.split('v=')[1] || '').split('&')[0];
}

function shut() {
  document.querySelector('.video-stream.html5-main-video').pause();
  document.querySelector('.video-stream.html5-main-video').muted = true
}

async function change() {
  if (window.location.href.includes('/embed/')) return;
  while (!document.querySelector('#player-container-inner')) {
    await delay(500)
  }
  while (!document.querySelector('.video-stream.html5-main-video')) {
    await delay(500)
  }
  shut()
  document.getElementById('player-container-inner').style.display = 'none';
  document.querySelector('#container.style-scope.ytd-player').style.display = 'none';
  fetch('https://api.fsh.plus/video?id='+id()).then(async res => {
    let ytv = await res.json();
    shut()
    ytv = ytv.video;
    document.querySelector('#player-container-outer.style-scope.ytd-watch-flexy').insertAdjacentHTML("afterbegin", `<video controls autoplay id="ytpop" src="${ytv}" allow="autoplay" style="position:relative;margin-bottom:15px;width:-webkit-fill-available;aspect-ratio:4/2.25;border-radius:1.5rem;min-height:350px;"></video>`);
    let player = document.getElementById('ytpop');
    
    let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
      if (window.location.href !== previousUrl) {
        previousUrl = window.location.href;
        if (window.location.href.split('v=').length<2) {
          player.pause();
        } else {
          fetch('https://api.fsh.plus/video?id='+id()).then(async ress => {
            ress = await ress.json();
            player.src = ress.video;
            shut();
            player.pause();
            player.play();
          })
        }
      } else {
        shut()
      }
    });
    observer.observe(document, {subtree: true, childList: true});
    
    document.body.onkeyup = function(e) {
      if (e.target.tagName.toLowerCase() === 'input') return;
      if (e.detail.simulated) return;
      shut()
      switch(e.key) {
        case ' ':
          player.paused ? player.play() : player.pause()
          break;
        case 'ArrowLeft':
          player.currentTime = player.currentTime-5;
          break;
        case 'ArrowRight':
          player.currentTime = player.currentTime+5;
          break;
        case ',':
          player.currentTime = player.currentTime-0.1
          if(player.paused){player.play();player.pause()}
          break;
        case '.':
          player.currentTime = player.currentTime+0.1
          if(player.paused){player.play();player.pause()}
          break;
        case 'ArrowUp':
          if (ytpop.volume<1)ytpop.volume = ytpop.volume+0.05;
          break;
        case 'ArrowDown':
          if (ytpop.volume>0)ytpop.volume = ytpop.volume-0.05;
          break;
        case 't':
          document.querySelector('#full-bleed-container.style-scope.ytd-watch-flexy').style.display = 'none';
          document.querySelector('#player.style-scope.ytd-watch-flexy').style.display = 'block';
          break;
      }
    }
  })
}

chrome.storage.sync.get('enabled', function (data) {
  if (data.enabled) {
    change()
  }
});

async function down() {
  if (window.location.href.includes('/embed/')) return;
  while (!document.querySelector('ytd-menu-renderer.style-scope.ytd-watch-metadata')) {
    await delay(500)
  }
  document.querySelector('#actions ytd-menu-renderer yt-button-shape#button-shape.style-scope.ytd-menu-renderer').insertAdjacentHTML("beforebegin", `<style>button:focus {outline:none;} .ytpopdown{margin-left: 10px;fill: #fff;border: none;background-color: #4e4e4e80;border-radius: 2rem;width: 35px;height: 35px;aspect-ratio:1/1;cursor: pointer;} .ytpopdown:hover{background-color: #80808080}</style>
<button onclick="document.getElementById('ytpopmodal').showModal()" class="ytpopdown">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path></svg>
</button>
<dialog id="ytpopmodal" style="background-color:#373737;border:none;color:#fff;width:25vw;height:25vh;border-radius:12px;font-size:14px;">
  <h1>YT Pop</h1>
  <p>Download this youtube video</p>
  <br>
  <label>Type:</label>
  <select style="color: #fff;background-color: #212121;border: #fff 1px solid;padding: 2px;border-radius: 0.75rem;margin-bottom: 5px;">
    <option value="video">Video (mp4)</option>
    <option value="audio">Audio (mp3)</option>
  </select>
  <br>
  <button onclick="const url = 'https://api.fsh.plus/' + document.getElementsByTagName('select')[0].value + '?id='+(window.location.href.split('v=')[1] || '').split('&')[0];fetch(url).then(async e => {e = await e.json();window.open(e.download);});" style="background-color: #3ea6ff;border: none;padding: 6px;margin: 4px;border-radius: 1rem;cursor: pointer;">Download</button>
  <button onclick="document.getElementById('ytpopmodal').close()" style="border: none;color: #3ea6ff;background: transparent;position: absolute;right: 0;bottom: 0;padding: 16px 30px;cursor: pointer;">Close</button>
</dialog>`)
  const observer = new MutationObserver(function(mutations) {
    document.querySelectorAll('#flexible-item-buttons.style-scope.ytd-menu-renderer ytd-download-button-renderer').forEach(t => {t.style.display = 'none';})
	  document.querySelectorAll('tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer ytd-menu-service-item-download-renderer').forEach(t => {t.style.display = 'none';})
  });
  observer.observe(document, {subtree: true, childList: true});
}

chrome.storage.sync.get('down', function (data) {
  if (data.down) {
    down()
  }
});

function noads() {
  const observer = new MutationObserver(function(mutations) {
    document.querySelectorAll('#player-ads').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('.ytd-page-top-ad').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('.ytd-ad-slot-renderer').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('ytd-rich-item-renderer:has(.ytd-ad-slot-renderer)').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('ytd-banner-promo-renderer').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('yt-mealbar-promo-renderer').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('ytd-rich-item-renderer:has(ytd-feed-nudge-renderer)').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('#attached-survey').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('div.ytp-suggested-action').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('ytd-brand-video-singleton-renderer').forEach(t => {t.style.display = 'none';})
    document.querySelectorAll('.ytp-ad-player-overlay-flyout-cta').forEach(t=>{document.querySelector('video').playbackRate = 16.0;document.querySelector('video').currentTime = document.querySelector('video').duration;document.querySelector('.ytp-ad-skip-button-modern').click()})
    document.querySelectorAll('.ytp-ad-skip-button-modern').forEach(t => {
      t.click()
    })
  });
  observer.observe(document, {subtree: true, childList: true});
}

chrome.storage.sync.get('noads', function (data) {
  if (data.noads) {
    noads()
  }
});

chrome.storage.sync.get('nocurves', function (data) {
  if (data.nocurves) {
    document.head.insertAdjacentHTML("beforeend", `<style>* {border-radius: 0 !important;}</style>`)
  }
});

chrome.storage.sync.get('noshorts', function (data) {
  if (data.noshorts) {
    document.head.insertAdjacentHTML("beforeend", `<style>ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer,ytd-reel-shelf-renderer,yt-tab-shape[tab-title="Shorts"],ytd-guide-entry-renderer>a[title="Shorts"] {display: none !important;}</style>`)
  }
});

chrome.storage.sync.get('nothanks', function (data) {
  if (data.nothanks) {
    document.head.insertAdjacentHTML("beforeend", `<style>
#flexible-item-buttons.style-scope.ytd-menu-renderer yt-button-view-model:has(path[d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm5.5-15c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2zm-3.75 17.85-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3 19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86z"]),
ytd-menu-service-item-renderer:has(path[d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm5.5-15c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2zm-3.75 17.85-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3 19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86z"])    {
  display: none !important;
}</style>`)
  }
});

chrome.storage.sync.get('nomix', function (data) {
  if (data.nomix) {
    const observer = new MutationObserver(function(mutations) {
    document.querySelectorAll('ytd-rich-item-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer.ytd-playlist-thumbnail)').forEach(t => {t.style.display = 'none';})
  });
  observer.observe(document, {subtree: true, childList: true});
  }
});