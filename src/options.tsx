import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Header } from './components'
import { Options } from './OptionsPanel'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <div className="options-page">
      <Header />
      <Options />
    </div>
  </StrictMode>,
)
