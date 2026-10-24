import type { ReactNode } from 'react'

type ToggleProps = {
  label: string
  note?: ReactNode
  checked: boolean
  onChange: () => void
}

export const Toggle = ({ label, note, checked, onChange }: ToggleProps) => (
  <label className="setting">
    <span className="setting-text">
      {label}
      {note && <small>{note}</small>}
    </span>
    <input type="checkbox" role="switch" className="switch" checked={checked} onChange={onChange} />
  </label>
)

export const Header = () => (
  <header className="boris-header">
    <b>Boris</b> <i>the Italian Goldfish</i>
  </header>
)
