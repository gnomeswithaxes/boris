import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Options } from './OptionsPanel'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <h1 style={{ color: 'rgb(240, 173, 78)' }}>
      Opzioni Boris — <i>the Italian Goldfish</i>
    </h1>
    <Options />
  </StrictMode>
)
