// @name         ChatGPT HeartBeat
// @namespace    https://greasyfork.org/scripts/462967-chatgpt-heartbeat
// @version      0.2.4
// @license      GPLv3
// @author       https://v2ex.com/t/926890

// Edited

const refreshInterval = 60; // seconds

const getRefreshURL = () =>
  document.querySelector('script[src*="_ssgManifest.js"]').src;

const heartbeat = document.createElement('iframe');
heartbeat.style.display = 'none';
document.head.prepend(heartbeat);

let count = 0;
function refresh() {
  count = 0;
  heartbeat.src = `${getRefreshURL()}?${Date.now()}`;
}
setInterval(function () {
  try {
    let current = new URL(heartbeat.contentWindow.location.href);
    let expect = new URL(getRefreshURL());
    if (
      heartbeat.contentWindow.location.href === '' ||
      heartbeat.contentWindow.location.href === 'about:blank' ||
      current.pathname === expect.pathname ||
      count++ * refreshInterval >= 2 * 60
    ) {
      refresh();
    }
  } catch (error) {
    // https://v2ex.com/t/926890#r_12935587
    console.error(error);
    refresh();
  }
}, refreshInterval * 1000);
