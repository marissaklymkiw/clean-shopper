export interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  name?: string
  type?: string
  placeholder?: string
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function InputField({
  label,
  value,
  onChange,
  name,
  type = 'text',
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  className = '',
}: InputFieldProps) {
  const id = name ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={`flex flex-col gap-xs ${className}`}>
      <label htmlFor={id} className="text-small font-medium text-text-muted">
        {label}
        {required && <span aria-hidden className="ml-xs text-error">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-describedby={error || helperText ? `${id}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        className={`rounded-md border px-md py-sm text-body text-text placeholder:text-text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-1 ${
          error ? 'border-error' : 'border-border'
        } ${disabled ? 'cursor-not-allowed bg-border text-text-muted' : 'bg-surface'}`}
      />
      {(error || helperText) && (
        <span id={`${id}-hint`} className={`text-small ${error ? 'text-error' : 'text-text-muted'}`}>
          {error ?? helperText}
        </span>
      )}
    </div>
  )
}

export default InputField
