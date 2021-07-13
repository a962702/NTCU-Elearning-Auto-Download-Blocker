var script = document.createElement('script');
script.src = chrome.runtime.getURL('HackCode.js');
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);