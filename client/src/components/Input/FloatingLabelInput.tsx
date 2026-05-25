import type { ChangeEvent, FC } from "react"

interface FloatingLabelInputProps {
  label: string
  type: "text" | "date" | "password"
  name: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  newLabelClassName?: string
  labelClassName?: string
  newInputClassName?: string
  inputClassName?: string
  required?: boolean
  autoFocus?: boolean
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
}

const BASE_INPUT =
  "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-teal-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer"

const BASE_LABEL =
  "absolute text-sm text-teal-700 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"

const FloatingLabelInput: FC<FloatingLabelInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  newLabelClassName,
  labelClassName,
  newInputClassName,
  inputClassName,
  required,
  autoFocus,
  disabled,
  readonly,
  errors,
}) => {
  const inputClass = [BASE_INPUT, newInputClassName, inputClassName].filter(Boolean).join(" ")
  const labelClass = [BASE_LABEL, newLabelClassName, labelClassName].filter(Boolean).join(" ")

  return (
    <>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder=" "
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readonly}
        />
        <label htmlFor={name} className={labelClass}>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
        {errors && errors.length > 0 && (
          <span className="text-red-600 text-xs ">{errors[0]}</span>
        )}
      </div>
    </>
  )
}

export default FloatingLabelInput
