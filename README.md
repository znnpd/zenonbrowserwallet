# ZenonBrowserWallet
Lightweight browser extension wallet for Zenon NoM similar to metamask. 

## Please note:
* Extension not published in chrome webstore, only to test on localhost
* Use together with Zenon-Web3Site
* Public node of deenutz is used
* Only for fused accounts
* .env files for tests

# Warpdrive
See [here](./docs/warpdrive.md) for original warpdrive submission.

# Installation

## Prerequisits
* Latest version of google chrome browser (at least >= version 102)
* NodeJS 

## Setup
* `npm run build` creates a react webapp for local UI testing (normal UI, cannot be used as an extension)
* `npm run local` starts the local webpack dev server for UI testing in browser (not as extension)
* `npm run local_extension` creates `extension_build` directory and runs a webpack server (which is not really needed). The directory can be loaded by chrome extension to test it locally


## Extension components and message flows to invoke extension from website
In order to send messages from any website to a chrome extension the following components are needed in the chrome extension ecosystem:

### Webapp for extension popup (plain html/js or ReactJS app)
* Extension UI

### Content script
* Injected in any website (based on matching rules)
* Has access to website DOM and can listen to `postMessage()` from website
* Can communicate with extension and background script

### Background script
* Always-running script for extension
* Can communicate with extension and content script

## Message Flow
1. Website (index_website.html) posts a message using `window.postMessage()`
2. Content script has an event listener for the message event
3. Content script sends a message using `chrome.runtime.sendMessage()` (request/response) or `chrome.runtime.connect()` (long-living connection)
4. Extension popup app (i.e. ReactJS) and background script add a message listener using `chrome.runtime.onMessage.addListener()` or in `chrome.runtime.connect()` to receive the message. **NOTE**: In functional ReactJS the `useEffect()` mechanism must be used to register the listener! 


* Extension not published in chrome webstore, only to test on localhost
* Use together with Zenon-Web3Site
* Public node of deenutz is used
* Only for fused accounts
* .env files for tests