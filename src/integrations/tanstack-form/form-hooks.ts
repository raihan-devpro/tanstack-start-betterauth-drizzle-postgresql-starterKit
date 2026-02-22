import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import {
  TsCheck,

  TsCustomField,
  TsFileUploadInput,
  TsMultiSelect,

  TsRadioGroupItem,
  TsSelect,
  TsSlider,
  TsSliderRange,
  TsSubscribeButton,
  TsSwitch,
  TsTextArea,
  TsTextField,
} from './form-components'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TsTextField,
    TsCustomField,
    TsSelect,
    TsTextArea,
    TsSlider,
    TsSwitch,
    TsSliderRange,
    TsCheck,
    TsRadioGroupItem,

    TsMultiSelect,

    TsFileUploadInput,
  },
  formComponents: {
    TsSubscribeButton,
  },
  fieldContext,
  formContext,
})
