window.addEventListener("message", (event) => {

    // We only accept messages from ourselves and for the correct extension
    if (event.source != window || !event.data || event.data.direction !== 'toExtension'  || event.data.extensionId !== chrome.runtime.id) {
        return;
    }
        
    console.log("Content script received message from website: ", event.data);
    console.log("Forwarding message to background script...");

    // Send message to the background script
    chrome.runtime.sendMessage(event.data, function(response) {

        // Process response
        console.log("Content script received response from background script: ", response);
        
        // Send new message back as response back to the website
        if (response) {
            window.postMessage(response, '*');
        }
    });
}, false);

// Receive messages from extension
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (sender.id !== chrome.runtime.id) return;
        
        // no need so send a response back to the extension

        window.postMessage(request); // Post new message to website
    }
);