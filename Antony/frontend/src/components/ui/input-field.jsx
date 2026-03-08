import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function InputField({ label, id, error, className, ...props }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={id} className="font-mono text-xs uppercase tracking-widest text-primary">
          {label}
        </Label>
      )}
      <Input id={id} className={cn('h-11 px-3', error && 'border-destructive')} {...props} />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
