import { trackStyle, thumbStyle } from './Toggle.css'

interface ToggleProps {
  checked: boolean
  onChange: (() => void) | ((checked: boolean) => void)
  disabled?: boolean
}

export default function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  const handleClick = () => {
    if (disabled) return
    const fn = onChange as (checked: boolean) => void
    // support both () => void and (checked: boolean) => void
    fn(!checked)
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-checked={checked}
      data-disabled={disabled}
      className={trackStyle}
      onClick={handleClick}
    >
      <span className={thumbStyle} />
    </button>
  )
}
