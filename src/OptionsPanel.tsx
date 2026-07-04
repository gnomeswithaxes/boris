import { useState, useEffect } from 'react'
import { Checkbox } from './components'
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
    <div>
      <h2>MTGGoldfish</h2>
      <h3>Show cheapest prices automatically</h3>
      <Checkbox checked={settings.auto} handleChange={() => toggle('auto')} />
      <h2>Cardmarket</h2>
      <h3>Show card art instead of camera icon</h3>
      <Checkbox checked={settings.images} handleChange={() => toggle('images')} />
      <h3>
        When downloading a Wants list, use card names as shown
        <br />(if false, English names are preferred)
      </h3>
      <Checkbox checked={settings.printVersion} handleChange={() => toggle('printVersion')} />
      <h3>
        <i>EXPERIMENTAL</i> — Add card links to ShoppingWizard results.
        This works by saving all URLs when you visit a Wants list.
      </h3>
      <Checkbox checked={settings.shoppingWizard} handleChange={() => toggle('shoppingWizard')} />
    </div>
  )
}
