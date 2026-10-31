// Banner
console.log('%cYTPop%c\nYouTube enhancements', 'color:#a8e;font-size:40px;font-weight:bold;font-family:Arial', 'font-family:Arial');

const delay = ms=>new Promise(res=>setTimeout(res, ms));
const id = ()=>window.location.href
  .split('v=').slice(-1)[0]
  .split('&')[0]
  .split('/').slice(-1)[0];

function shut() {
  document.querySelector('.video-stream.html5-main-video').pause();
  document.querySelector('.video-stream.html5-main-video').muted = true
}

async function change() {
  if (window.location.href.includes('/embed/')) return;
  while (!document.querySelector('#player-container-inner')) await delay(200);
  while (!document.querySelector('.video-stream.html5-main-video')) await delay(200);
  shut();
  document.getElementById('player-container-inner').style.display = 'none';
  document.querySelector('#container.style-scope.ytd-player').style.display = 'none';
  fetch('https://api.fsh.plus/video?id='+id()).then(async res => {
    let ytv = await res.json();
    shut();
    ytv = ytv.video;
    document.querySelector('#player-container-outer.style-scope.ytd-watch-flexy').insertAdjacentHTML('afterbegin', `<video controls autoplay id="ytpop" src="${ytv}" allow="autoplay" style="position:relative;margin-bottom:15px;width:-webkit-fill-available;aspect-ratio:4/2.25;border-radius:1.5rem;min-height:350px;"></video>`);
    let player = document.getElementById('ytpop');
    
    let previousUrl = '';
    const observer = new MutationObserver(()=>{
      if (window.location.href===previousUrl) {
        shut();
        return;
      }
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
    });
    observer.observe(document, { subtree: true, childList: true });
    
    document.body.onkeyup = (evt)=>{
      if (evt.target.tagName.toLowerCase()==='input') return;
      if (evt.detail.simulated) return;
      shut();
      switch(evt.key) {
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
          player.currentTime = player.currentTime-0.1;
          if (player.paused) {player.play();player.pause()}
          break;
        case '.':
          player.currentTime = player.currentTime+0.1;
          if (player.paused) {player.play();player.pause()}
          break;
        case 'ArrowUp':
          if (ytpop.volume<1) ytpop.volume = ytpop.volume+0.05;
          break;
        case 'ArrowDown':
          if (ytpop.volume>0) ytpop.volume = ytpop.volume-0.05;
          break;
        case 't':
          document.querySelector('#full-bleed-container.style-scope.ytd-watch-flexy').style.display = 'none';
          document.querySelector('#player.style-scope.ytd-watch-flexy').style.display = 'block';
          break;
      }
    }
  })
}

async function down() {
  if (window.location.href.includes('/embed/')) return;
  while (!document.querySelector('ytd-menu-renderer.style-scope.ytd-watch-metadata')) await delay(200);
  document.querySelector('#actions ytd-menu-renderer yt-button-shape#button-shape.style-scope.ytd-menu-renderer').insertAdjacentHTML('beforebegin', `<style>
  button:focus {
    outline: none;
  }
  .ytpopdown {
    position: relative;
    cursor: pointer;
    fill: #fff;
    width: 40px;
    height: 40px;
    margin-left: 8px;
    border: none;
    border-radius: 2rem;
    background-color: rgba(255,255,255,0.1);
  }
  .ytpopdown:hover {
    background-color: #80808080;
  }
  ::backdrop {
    background-color: #000;
    opacity: 0.3;
  }
</style>
<button id="ytpopdown" class="ytpopdown">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M12 2a1 1 0 00-1 1v11.586l-4.293-4.293a1 1 0 10-1.414 1.414L12 18.414l6.707-6.707a1 1 0 10-1.414-1.414L13 14.586V3a1 1 0 00-1-1Zm7 18H5a1 1 0 000 2h14a1 1 0 000-2Z"></path></svg>
  <yt-light-shape aria-hidden="true" class="contribYtLightShapeHost contribYtLightShapeStaticRimLight contribYtLightShapeStaticRimLightTonal"><div class="contribYtLightShapeStaticWashLight contribYtLightShapeStaticWashLightTonal"></div></yt-light-shape>
</button>
<dialog id="ytpopmodal" closedby="any" style="background-color:#373737;border:none;color:#fff;width:25vw;height:25vh;border-radius:12px;font-size:14px;">
  <h1>YT Pop</h1>
  <p>Download this youtube video</p>
  <br>
  <label>Type:</label>
  <select style="color:#fff;background-color:#212121;border:#fff 1px solid;padding:2px;border-radius:0.75rem;margin-bottom: 5px;">
    <option value="video">Video (mp4)</option>
    <option value="audio">Audio (mp3)</option>
  </select>
  <br>
  <button id="ytpopdownload" style="background-color:#3ea6ff;border:none;padding:6px;margin:4px;border-radius:1rem;cursor:pointer;">Download</button>
  <button id="typopclose" style="border: none;color:#3ea6ff;background:transparent;position:absolute;right:0;bottom:0;padding:16px 30px;cursor:pointer;">Close</button>
</dialog>`);
  document.getElementById('ytpopdown').onclick = ()=>{
    document.getElementById('ytpopmodal').showModal();
  };
  document.getElementById('ytpopdownload').onclick = ()=>{
    const url = 'https://api.fsh.plus/' + document.getElementsByTagName('select')[0].value+'?id='+id();
    fetch(url)
      .then(async e => {
        e = await e.json();
        window.open(e.download);
      });
  };
  document.getElementById('typopclose').onclick = ()=>{
    document.getElementById('ytpopmodal').close();
  };
  const observer = new MutationObserver(()=>{
    document.querySelectorAll('#flexible-item-buttons.style-scope.ytd-menu-renderer ytd-download-button-renderer').forEach(t => {t.style.display = 'none';})
	  document.querySelectorAll('tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer ytd-menu-service-item-download-renderer').forEach(t => {t.style.display = 'none';})
  });
  observer.observe(document, { subtree: true, childList: true });
}

let shadowRealm = [];
function sendToShadowRealm(id) {
  document.querySelectorAll(id).forEach(t=>{
    shadowRealm.push(t);
    t.style.opacity = '0';
    t.style.width = '0px';
    t.style.height = '0px';
    t.style.margin = '0px';
    t.style.padding = '0px';
    t.style.visibility = 'hidden';
    t.style.pointerEvents = 'none';
  });
}
function unShadowRealm() {
  shadowRealm.forEach(t=>{
    t.style.opacity = '';
    t.style.width = '';
    t.style.height = '';
    t.style.margin = '';
    t.style.padding = '';
    t.style.visibility = '';
    t.style.pointerEvents = '';
  });
  shadowRealm = [];
}

function noads() {
  const observer = new MutationObserver(()=>{
    unShadowRealm();
    /* Static ads */
    // Feed
    sendToShadowRealm('.ytd-companion-slot-renderer');
    sendToShadowRealm('ytd-companion-slot-renderer');
    sendToShadowRealm('.ytd-action-companion-ad-renderer');
    sendToShadowRealm('.ytd-watch-next-secondary-results-renderer.sparkles-light-cta');
    sendToShadowRealm('.ytd-unlimited-offer-module-renderer');
    sendToShadowRealm('.ytd-display-ad-renderer');
    sendToShadowRealm('.ytd-statement-banner-renderer');
    sendToShadowRealm('.ytd-in-feed-ad-layout-renderer');
    // Deprecated overlay
    sendToShadowRealm('.ytp-ad-overlay-image');
    sendToShadowRealm('.ytp-ad-text-overlay');
    // ads as videos
    sendToShadowRealm('ytd-rich-item-renderer:has(.ytd-ad-slot-renderer)');
    sendToShadowRealm('ytd-rich-item-renderer:has(ytd-feed-nudge-renderer)');
    sendToShadowRealm('.ytd-ad-slot-renderer');
    // Other
    sendToShadowRealm('#player-ads');
    sendToShadowRealm('#attached-survey');
    sendToShadowRealm('div.ytp-suggested-action');
    sendToShadowRealm('ytd-brand-video-singleton-renderer');
    sendToShadowRealm('div#player-ads.style-scope.ytd-watch-flexy');
    sendToShadowRealm('div#panels.style-scope.ytd-watch-flexy');
    sendToShadowRealm('div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint');
    sendToShadowRealm('div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer');
    // Banners
    sendToShadowRealm('#masthead-ad');
    sendToShadowRealm('div:has(>ytd-banner-promo-renderer)');
    sendToShadowRealm('ytd-banner-promo-renderer');
    sendToShadowRealm('yt-mealbar-promo-renderer');
    sendToShadowRealm('.ytd-page-top-ad');
    sendToShadowRealm('.yt-mealbar-promo-renderer');
    sendToShadowRealm('ytd-player-legacy-desktop-watch-ads-renderer');
    sendToShadowRealm('#player-ads');
    // TV
    sendToShadowRealm('.ytd-banner-promo-renderer');
    sendToShadowRealm('.ytd-video-masthead-ad-v3-renderer');
    sendToShadowRealm('.ytd-primetime-promo-renderer');
    
    /* Ad blocking blocking */
    sendToShadowRealm('#buttons.style-scope.ytd-enforcement-message-view-model')
    sendToShadowRealm('#divider.style-scope.ytd-enforcement-message-view-model')
    sendToShadowRealm('#feedback.style-scope.ytd-enforcement-message-view-model')
    document.querySelectorAll('#body.style-scope.ytd-enforcement-message-view-model').forEach(e=>{
      e.innerHTML=`<p>Sorry, seems like youtube has flagged YTPop or another ad blocking extension.</p>
<p>If you only have YTPop enabled, create an issue in the <a href="https://github.com/inventionpro/YTPop/issues" style="color:#a8e">Github</a></p>
<button>Close</button>`;
    })
  });
  observer.observe(document, { subtree: true, childList: true });
}

// TODO: fix yt flagging this
function novideoads() {
  // Parts from Ad Accelerator
  const skipButtonSelectors = [
   // Original version
   '.ytp-ad-skip-button',
   '.ytp-ad-skip-button-modern',
   '.ytp-skip-ad-button',
   // Observed May 2024
   '.ytp-skip-ad button',
   '[id^="skip-ad"] button',
   '[id^="skip-button"]',
  ];
  const observer = new MutationObserver(()=>{
    const video = document.querySelector('video');
    const adElement = document.querySelector('.video-ads.ytp-ad-module');
    // Skip
    if (video && adElement && adElement.children.length > 0) {
      video.muted = true;
      video.playbackRate = 16.0;
      video.currentTime = video.duration-0.1;
    }
    // Press skip button
    const skipButton = document.querySelector(skipButtonSelectors.join(', '));
    if (skipButton) skipButton.click();
  });
  observer.observe(document, { subtree: true, childList: true });
}

chrome.storage.sync.get(null, (data)=>{
  document.head.insertAdjacentHTML('beforeend', `<style>
  ${data.noshorts?`ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer,ytd-reel-shelf-renderer,yt-tab-shape[tab-title="Shorts"],ytd-guide-entry-renderer>a[title="Shorts"] { display: none !important }`:''}

  ${data.nothanks?`yt-button-view-model:has(path[d="M16.25 2A6.7 6.7 0 0012 3.509 6.75 6.75 0 001 8.75c0 4.497 2.784 7.818 5.207 9.87a23.498 23.498 0 004.839 3.143l.096.044.03.013.01.005.003.002.002.001c.273-.609.544-1.218.813-1.828 0 0-9-4-9-11.25a4.75 4.75 0 018.932-2.247A1 1 0 0011 7.5v.638c-.357.1-.689.26-.979.49A2.35 2.35 0 009.13 10.5c-.007.424.112.84.342 1.197.21.31.497.563.831.734.546.29 1.23.411 1.693.502.557.109.899.19 1.117.315.086.048.109.082.114.09.004.006.028.045.028.162 0 .024-.008.118-.165.235-.162.122-.5.27-1.09.27-.721 0-1.049-.21-1.181-.323a.6.6 0 01-.142-.168l.005.013.006.014.002.009a.996.996 0 00-1.884.64l.947-.316-.003.001c-.875.292-.939.314-.943.317l.001.003.003.006.004.015.012.032c.045.111.1.218.162.321.146.236.324.444.535.624.357.306.841.566 1.476.702v.605a1 1 0 002 0v-.614c1.29-.289 2.245-1.144 2.245-2.386 0-.44-.103-.852-.327-1.212-.22-.355-.52-.6-.82-.77-.555-.316-1.244-.445-1.719-.539-.567-.111-.915-.185-1.143-.305a.5.5 0 01-.1-.07l-.004-.003-.003-.009a.4.4 0 01-.009-.092c0-.158.053-.244.14-.314.109-.086.341-.19.74-.19.373-.001.73.144.997.404a.996.996 0 001.518-1.286l-.699.58.698-.582v-.001l-.002-.001-.002-.003-.006-.006-.016-.018a2.984 2.984 0 00-.178-.182A3.45 3.45 0 0013 8.154V7.5a1 1 0 00-.933-.997A4.75 4.75 0 0121 8.75C21 16 12 20 12 20l.813 1.827.002-.001.003-.001.01-.005.029-.013.097-.045c.081-.037.191-.09.33-.16a23.5 23.5 0 004.509-2.982C20.216 16.568 23 13.248 23 8.75A6.75 6.75 0 0016.25 2Zm-3.437 19.827L12 20l-.813 1.828.813.36.813-.361Z"]) { display: none !important }`:''}
  ${data.progresscolorchange?`:not(.ytp-color-party) .ytp-progress-bar > div {
    div > div > .ytp-play-progress, .ytp-scrubber-button { background: ${data.progresscolor} !important }
  }
  .ad-interrupting:not(.ytp-color-party) .ytp-progress-bar > div {
    div > div > .ytp-play-progress, .ytp-scrubber-button { background: ${data.progresscolorad} !important }
  }
  .ytp-ad-persistent-progress-bar { background: ${data.progresscolorad} !important }
  .ytp-yto-preroll:not(.ytp-color-party) .ytp-progress-bar > div {
    div > div > .ytp-play-progress, .ytp-scrubber-button { background: ${data.progresscolorpreroll} !important }
  }`:''}
  ${data.fixchannelsection?`#avatar-section .style-scope.ytd-channel-renderer { width: 136px }
  #avatar-section {
    flex: 0 !important;
    min-width: 136px !important;
  }`:''}

  ${data.nocurves?`*,*::before,*::after { border-radius: 0px !important }`:''}
  ${data.noanimation?`*,*::before,*::after {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
  }`:''}
</style>`);

  if (data.noads) noads();
  if (data.nomix) {
    const observer = new MutationObserver(()=>{
      document.querySelectorAll('ytd-rich-item-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer.ytd-playlist-thumbnail)').forEach(t => {t.style.display = 'none';})
    });
    observer.observe(document, { subtree: true, childList: true });
  }

  if (data.down) down();
  if (data.novideoads) novideoads();
  if (data.enabled) change();
});