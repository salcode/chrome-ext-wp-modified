async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
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
    alert (`Last modified ${modified}`);
  } catch ( error ) {
    alert(`${error.toString()}`);
  }
}

(async () => {
  // Run func() inside current tab.
  const tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func
  });
})();
