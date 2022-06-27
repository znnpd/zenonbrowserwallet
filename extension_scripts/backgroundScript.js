chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        const allowedActions = ['CONNECT_WALLET', 'SEND_TRANSACTION'];
        if (request.extensionId !== chrome.runtime.id || !request.action) {
            return;
        };

        if (!allowedActions.includes(request.action)) {
            sendResponse({error: `Action ${request.action} not supported.`});
            return;
        };
        
        console.log('Background script received request: ', request);
        if (request.action === 'CONNECT_WALLET') {
            chrome.storage.local.get(['trustedSites'], function(result) {
                if (result.trustedSites && JSON.parse(result.trustedSites).map(e => e.toLocaleLowerCase()).includes(sender.origin)) {
                    // approval already existing
                    chrome.storage.local.get(['baseAddress'], function(result) {
                        sendResponse({
                            direction: 'toWebsite',
                            action: 'CONNECT_WALLET_RESPONSE', 
                            data: {
                                isSiteTrusted: true,
                                trustedSite: sender.origin,
                                baseAddress: result.baseAddress
                            },
                            extensionId: chrome.runtime.id
                        });
                    });                   
                } else {  
                    // open approval site in extension
                    openExtension("./index.html?navigateTo=siteapproval&originSender=" + sender.origin + "&tabIdSender=" + sender.tab.id + "&data=" + request.data);
                    sendResponse(null); // Send null response to complete message communication
                }
            });
            
            return true;  // Mandatory for async reponses
        } else if (request.action === 'SEND_TRANSACTION') {
            chrome.storage.local.get(['trustedSites'], function(result) {
                if (result.trustedSites && JSON.parse(result.trustedSites).map(e => e.toLocaleLowerCase()).includes(sender.origin)) {
                    openExtension("./index.html?navigateTo=send&originSender=" + sender.origin + "&tabIdSender=" + sender.tab.id + "&data=" + JSON.stringify(request.data));
                    sendResponse(null); // Send null response to complete message communication         
                } else {  
                    sendResponse({
                        direction: 'toWebsite',
                        action: 'SEND_TRANSACTION_RESPONSE', 
                        data: {
                            error: 'Site not trusted yet, connect your wallet once to approve site trust.',
                        },
                        extensionId: chrome.runtime.id
                    });       
                }
            }); 
            return true;  // Mandatory for async reponses
        }
    }
);

function openExtension(path) {
    chrome.windows.getLastFocused().then((window) => {
        const width = 400;
        const height = 600;
        const left = window.width - width;
        chrome.windows.create({url: path, type: "popup", height: height, width: width, left: left, focused: true});
    }); 
}