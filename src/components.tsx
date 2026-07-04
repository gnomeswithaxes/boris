type CheckboxProps = {
  checked: boolean
  handleChange: () => void
}

export const Checkbox = ({ checked, handleChange }: CheckboxProps) => (
  <label className="switch">
    <input type="checkbox" checked={checked} onChange={handleChange} />
    <span className="slider round" />
  </label>
)
