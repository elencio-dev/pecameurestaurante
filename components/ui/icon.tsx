import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type IconSize = 'sm' | 'md' | 'lg' | 'xl'

interface IconProps extends React.SVGAttributes<SVGElement> {
    /** O ícone do lucide-react a ser renderizado */
    icon: LucideIcon
    /** Tamanho predefinido do ícone */
    size?: IconSize
    /** Classes Tailwind adicionais */
    className?: string
    /** Texto alternativo para leitores de tela (Acessibilidade) */
    alt?: string
}

const sizeClasses: Record<IconSize, string> = {
    sm: 'w-4 h-4',       // 16px
    md: 'w-5 h-5',       // 20px
    lg: 'w-6 h-6',       // 24px
    xl: 'w-8 h-8',       // 32px
}

export function Icon({
    icon: IconComponent,
    size = 'md',
    className,
    alt,
    ...props
}: IconProps) {
    return (
        <>
            <IconComponent
                className={cn(
                    'shrink-0 text-current', // Evita que o ícone seja esmagado no flexbox e herda a cor do texto pai
                    sizeClasses[size],
                    className
                )}
                // Configurações padrão do Lucide
                strokeWidth={2}
                aria-hidden={alt ? 'false' : 'true'}
                role={alt ? 'img' : undefined}
                aria-label={alt}
                {...props}
            />
            {/* Fallback de acessibilidade (Screen Readers) caso o ícone tenha significado semântico */}
            {alt && <span className="sr-only">{alt}</span>}
        </>
    )
}

import { icons } from 'lucide-react'

export interface DynamicIconProps extends Omit<IconProps, 'icon'> {
    /** Nome exato do ícone em PascalCase (ex: "Pizza", "ShoppingCart") */
    name: string
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
    const IconComponent = icons[name as keyof typeof icons] || icons.Info
    return <Icon icon={IconComponent as LucideIcon} {...props} />
}
