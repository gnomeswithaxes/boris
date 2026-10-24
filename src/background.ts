// chrome.storage.session is only readable by extension pages by default; the content scripts
// share the Cardmarket cart sellers through it. The access level resets with the session.
const allowContentScripts = () =>
  chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

chrome.runtime.onInstalled.addListener(allowContentScripts)
chrome.runtime.onStartup.addListener(allowContentScripts)
