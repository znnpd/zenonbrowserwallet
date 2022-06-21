# Extension components
In order to send messages from any website to a chrome extension the following components are needed in the chrome extension ecosystem:

## Webapp for extension popup (plain html/js or ReactJS app)
* Extension UI

## Content script
* Injected in any website (based on matching rules)
* Has access to website DOM and can listen to `postMessage()` from website
* Can communicate with extension and background script

## Background script
* Always-running script for extension
* Can communicate with extension and content script

# Message Flows to invoke extension
1. Website (index_website.html) posts a message using `window.postMessage()`
2. Content script has an event listener for the message event
3. Content script sends a message using `chrome.runtime.sendMessage()` (request/response) or `chrome.runtime.connect()` (long-living connection)
4. Extension popup app (i.e. ReactJS) and background script add a message listener using `chrome.runtime.onMessage.addListener()` or in `chrome.runtime.connect()` to receive the message. **NOTE**: In functional ReactJS the `useEffect()` mechanism must be used to register the listener! 