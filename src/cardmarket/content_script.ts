import { addUserToTitle, showTrend } from './pages/Users'
import { addCheckboxes, addLinkToSingles, addScryfallButton } from './pages/Singles'
import { addDisclaimer, addLinkToCards } from './pages/ShoppingWizard'
import { addPrintListButton, saveAllUrls } from './pages/Wants'
import { addImages } from './pages/Sitewide'
import { addAllPrintingsToCart, highlightCartSellers, saveCartSellers } from './pages/Cart'
import { getSyncSettings, type SyncStorage } from '../common/storage'
import { logError } from '../common/utilities'

type FeatureFlag = { [K in keyof SyncStorage]: SyncStorage[K] extends boolean ? K : never }[keyof SyncStorage]

interface Route {
  match: RegExp
  setting?: FeatureFlag
  run: Array<() => unknown>
}

const routes: Route[] = [
  { match: /./, setting: 'images', run: [addImages] },
  { match: /\/Magic\/Users\//, run: [addUserToTitle, showTrend] },
  { match: /\/Products\/Singles\//, run: [addLinkToSingles, addCheckboxes, addScryfallButton, highlightCartSellers] },
  { match: /\/Cards\//, run: [addLinkToSingles] },
  { match: /ShoppingWizard\/Results/, run: [addLinkToSingles] },
  {
    match: /\/Magic\/Wants\/.*ShoppingWizard\/Results/,
    setting: 'shoppingWizard',
    run: [addDisclaimer, addLinkToCards],
  },
  { match: /\/ShoppingCart/, run: [saveCartSellers, addLinkToSingles, addAllPrintingsToCart] },
  { match: /\/Wants\/\d+/, run: [addPrintListButton] },
  { match: /\/Magic\/Wants\/\d+/, run: [saveAllUrls] },
]

const path = window.location.pathname
const active = routes.filter(route => route.match.test(path))
const flags = [...new Set(active.flatMap(route => route.setting ?? []))]

// Each feature runs on its own, so one that throws or rejects doesn't stop the others.
getSyncSettings(flags).then(settings => {
  for (const route of active) {
    if (route.setting && !settings[route.setting]) continue
    for (const feature of route.run) Promise.resolve().then(feature).catch(logError)
  }
}, logError)
