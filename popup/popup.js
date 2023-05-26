async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

/**
 * Update the text of the #message element inside the popup.
 *
 * @param string newMessage The new message to display.
 */
function updateMessageInPopup(newMessage) {
  document.querySelector('#message').innerText = newMessage;
}

async function func() {
  try {
    const restApiUrlForPost = document.querySelector('link[rel="alternate"][type="application/json"]')?.href;
    if (! restApiUrlForPost) {
      throw new Error('There is no WordPress REST API URL on this page');
    }
    const postData = await (await fetch(document.querySelector('link[rel="alternate"][type="application/json"]').href)).json();
    const modified = postData.modified;
    if (! modified) {
      throw new Error('There is no modified value for this page');
    }
    return `Last modified: ${modified}`;
  } catch ( error ) {
    return error.toString();
  }
}

(async () => {
  // Run func() inside current tab.
  const tab = await getCurrentTab();
  const [ injectionResult ] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func
  });
  updateMessageInPopup(injectionResult.result);
})();
