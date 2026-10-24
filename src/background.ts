import { isScryfallRequest, scryfallFetch } from './common/scryfall_worker'
import { SESSION_ACCESS_MESSAGE } from './common/storage'

// chrome.storage.session is only readable by extension pages by default; the content scripts
// share the Cardmarket cart sellers through it.
const allowContentScripts = () =>
  chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

allowContentScripts()

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message === SESSION_ACCESS_MESSAGE) {
    allowContentScripts().then(() => sendResponse(true))
    return true
  }
  if (isScryfallRequest(message)) {
    scryfallFetch(message).then(sendResponse)
    return true
  }
})
