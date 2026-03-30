import { textVariants, textColors } from './Text.css'

type TextVariant = keyof typeof textVariants
type TextColor = keyof typeof textColors
type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'div'

export interface TextProps {
  variant?: TextVariant
  color?: TextColor
  as?: TextTag
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Text({
  variant = 'bodyMd',
  color = 'gray900',
  as: Tag = 'span',
  children,
  className,
  style,
}: TextProps) {
  return (
    <Tag
      className={[textVariants[variant], textColors[color], className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </Tag>
  )
}
