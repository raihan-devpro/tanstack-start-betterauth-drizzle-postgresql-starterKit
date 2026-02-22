import { useStore } from '@tanstack/react-form'
import React from 'react'

import { Loader2 } from 'lucide-react'
import { useFieldContext, useFormContext } from './form-hooks'
import type { Option } from '@/components/custom/multi-selector'
import type {FileWithPreview} from '@/components/custom/file-chooser/use-file-upload';
import MultipleSelector from '@/components/custom/multi-selector'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { RadioGroupItem } from '@/components/ui/radio-group'
import * as Select from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

import FileUploadInput from '@/components/custom/file-chooser/file-upload-input'
import { cn } from '@/lib/utils'

function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>
}) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-red-500  text-xs font-bold"
        >
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  )
}

export function TsSubscribeButton({
  label,
  className,
  variant,
  disabled = false,
  loader =false,
}: {
  label: string
  className?: string
  disabled?: boolean
  loader?: boolean
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined
}) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          disabled={isSubmitting || disabled}
          className={className}
          variant={variant}
        >
         {loader && <Loader2 className="size-4 animate-spin" />}  {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
export function TsCustomField({
  label,
  description,
  component,
}: {
  label?: string
  description?: string
  component?: React.ReactNode
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
      {component}

      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
export function TsTextField({
  label,

  description,
  addOn,

  props,
}: {
  label?: string

  placeholder?: string
  description?: string
  addOn?: React.ReactNode | null
  props?: React.InputHTMLAttributes<HTMLInputElement>
}) {
  const field = useFieldContext<number | string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
      <InputGroup className="w-full">
        <InputGroupInput
          {...props}
          value={field.state.value}
          // placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => {
            if (props?.type === 'number') {
              field.handleChange(e.target.valueAsNumber)
            } else {
              field.handleChange(e.target.value)
            }
          }}
        />
        {addOn}
      </InputGroup>

      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

export function TsFileUploadInput({
  label,
  onFilesChange,
  description,
}: {
  label?: string
  placeholder?: string
  description?: string
  addOn?: React.ReactNode | null
  type?: React.HTMLInputTypeAttribute | undefined
  onFilesChange?: (files: Array<FileWithPreview>) => void
}) {
  const field = useFieldContext<FileWithPreview>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
      <FileUploadInput
        onFilesChange={(files: any) => {
          onFilesChange?.(files)
          field.handleChange(files[0] ?? null)
        }}
      />

      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

export function TsTextArea({
  label,
  rows = 3,
  description,
  addOn,
  className,
  placeholder,
}: {
  label?: string
  rows?: number
  description?: string
  className?: string
  addOn?: React.ReactNode

  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}

      <InputGroup>
        <InputGroupTextarea
          id={label}
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          rows={rows}
          className={cn('max-h-[250px] overflow-auto no-scrollbar', className)}
          onChange={(e) => field.handleChange(e.target.value)}
        />
        {addOn}
      </InputGroup>

      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

export function TsSelect({
  label,
  values,
  placeholder,
  description,
  initialValue,
  selectLabel,
}: {
  label?: string
  selectLabel?: string
  initialValue?: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
  description?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
      <Select.Select
        name={field.name}
        value={field.state.value}
        defaultValue={initialValue}
        onValueChange={(value) => field.handleChange(value)}
      >
        <Select.SelectTrigger className="w-full">
          <Select.SelectValue
            defaultValue={initialValue}
            placeholder={placeholder}
          />
        </Select.SelectTrigger>
        <Select.SelectContent>
          <Select.SelectGroup>
            <Select.SelectLabel>{selectLabel}</Select.SelectLabel>
            {values.map((value) => (
              <Select.SelectItem key={value.value} value={value.value}>
                {value.label}
              </Select.SelectItem>
            ))}
          </Select.SelectGroup>
        </Select.SelectContent>
      </Select.Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
export function TsMultiSelect({
  label,
  onChange,
  placeholder,
  description,
  initialValue,
  defaultOptions,
  addOn,
}: {
  label?: string
  selectLabel?: string
  initialValue?: Array<Option>
  setValue?: ((options: Array<Option>) => void) | undefined
  defaultOptions: Array<Option>
  onChange?: ((options: Array<Option>) => void) | undefined
  placeholder?: string
  description?: string
  addOn?: React.ReactNode
}) {
  const field = useFieldContext<Array<any>>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      <div className="flex items-center justify-between">
        {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
        {addOn}
      </div>
      <MultipleSelector
        commandProps={{
          label: label,
        }}
        defaultOptions={defaultOptions}
        options={defaultOptions}
        placeholder={placeholder}
        onChange={onChange}
        value={initialValue}
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

export function TsSlider({
  label,
  max,
  min,
  step,
}: {
  label: string
  max?: number
  min?: number
  step?: number
}) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
      <Slider
        id={label}
        max={max || 100}
        min={min || 0}
        step={step || 5}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </Field>
  )
}
export function TsSliderRange({
  label,
  max,
  min,
  step,
}: {
  label: string
  max?: number
  min?: number
  step?: number
}) {
  const field = useFieldContext<Array<number>>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field>
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
      <Slider
        id={label}
        max={max || 100}
        min={min || 0}
        step={step || 5}
        onBlur={field.handleBlur}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </Field>
  )
}

export function TsSwitch({
  label,
  description,
  orientation,
}: {
  label?: string
  description?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field orientation={orientation || 'horizontal'}>
      <FieldContent>
        {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <Switch
        id={label}
        onBlur={field.handleBlur}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </Field>
  )
}
export function TsCheck({
  label,

  orientation,
}: {
  label?: string

  orientation?: 'horizontal' | 'vertical'
}) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field orientation={orientation || 'horizontal'}>
      <Checkbox
        id={label}
        onBlur={field.handleBlur}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked as boolean)}
      />
      {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </Field>
  )
}
export function TsRadioGroupItem({
  label,
  description,
  orientation,
  value,
  id,
}: {
  id: string
  value: string
  label?: string
  description?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <FieldLabel htmlFor="kubernetes-r2h">
      <Field orientation={orientation || 'horizontal'}>
        <FieldContent>
          {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
          {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
        </FieldContent>
        <RadioGroupItem
          value={value}
          id={id}
          onBlur={field.handleBlur}
          checked={field.state.value}
        />
      </Field>
    </FieldLabel>
  )
}
