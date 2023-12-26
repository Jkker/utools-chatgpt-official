// get current url

const zustand = require('zustand');

const url = window.location.href;
console.log('p1.js', url);

utools.showNotification('p1.js: ' + url);

window.utools = utools;

// onload
document.addEventListener('DOMContentLoaded', () => {
  console.log(
    'DOMContentLoaded',
    url
    // , document.body.innerHTML
  );
  utools.showNotification('DOMContentLoaded: ' + url);
  // utools.showNotification('DOMContentLoaded: ' + document.body.innerHTML);
});
