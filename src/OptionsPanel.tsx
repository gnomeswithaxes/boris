import { useState, useEffect } from 'react'
import { Toggle } from './components'
import { getSyncSettings, setSyncSetting } from './common/storage'
import type { SyncStorage } from './common/storage'
import './options.css'

type OptionKeys = Pick<SyncStorage, 'auto' | 'printVersion' | 'images' | 'shoppingWizard'>

export const Options = () => {
  const [settings, setSettings] = useState<OptionKeys>({
    auto: false,
    printVersion: false,
    images: true,
    shoppingWizard: false,
  })

  useEffect(() => {
    getSyncSettings(['auto', 'printVersion', 'images', 'shoppingWizard']).then(setSettings)
  }, [])

  const toggle = (key: keyof OptionKeys) => {
    const newValue = !settings[key]
    setSettings(prev => ({ ...prev, [key]: newValue }))
    setSyncSetting(key, newValue)
  }

  return (
    <section>
      <h3>MTGGoldfish</h3>
      <Toggle label="Open decks on Cheapest prices" checked={settings.auto} onChange={() => toggle('auto')} />
      <h3>Cardmarket</h3>
      <Toggle label="Show card art instead of camera icon" checked={settings.images} onChange={() => toggle('images')} />
      <Toggle
        label="Export Wants lists with names as shown"
        note="Off: English names are preferred"
        checked={settings.printVersion}
        onChange={() => toggle('printVersion')}
      />
      <Toggle
        label="Card links in Shopping Wizard results"
        note={<><span className="experimental">Experimental:</span> saves the URLs of the Wants lists you visit</>}
        checked={settings.shoppingWizard}
        onChange={() => toggle('shoppingWizard')}
      />
    </section>
  )
}
