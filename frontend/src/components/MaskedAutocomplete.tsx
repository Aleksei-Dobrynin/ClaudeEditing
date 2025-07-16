import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { IMaskInput, IMask } from 'react-imask';


type SelectType = {
  data: any[];
  value?: string | number;
  onChange: (value: any) => void;
  label: string;
  name: string;
  fieldNameDisplay: (option: any) => string;
  mask?: string;
  onInputChange?: (event: React.ChangeEvent<{}>, value: string) => void;
  freeSolo?: boolean;
  disabled?: boolean 
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(
  props: any,
  ref
) {
  const { onChange, mask, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask={mask}
      inputRef={ref}
      overwrite
      onAccept={(value: any) => {
        if (onChange) onChange({ target: { value } });
      }}
    />
  );
});

export default function MaskedAutocomplete(props: SelectType) {
  const applyMask = (value: string): string => {
    if (!props.mask || !value) return value;
    const maskedValue = IMask.createMask({
      mask: props.mask,
    });

    maskedValue.resolve(value);

    return maskedValue.value || value;
  };

  const maskedOptions = props.data.map((option) => ({
    ...option,
    displayValue: applyMask(props.fieldNameDisplay(option)),
  }));


  return (
    <Autocomplete
      freeSolo={props.freeSolo || false}
      disabled={props.disabled ? props.disabled : false}
      options={maskedOptions}
      value={maskedOptions.find((item) => item.displayValue === props.value) ||
        (props.value ? { displayValue: props.value } : null)}
      onChange={(event, newValue) => {
        if (newValue) {
          props.onChange(newValue);
        } else {
          props.onChange(null);
        }
      }}
      getOptionLabel={(option) => {
        const label = option.displayValue;
        if (!label) {
          return '';
        }
        return label;
      }}
      onInputChange={props.onInputChange}
      disableCloseOnSelect={false}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          size="small"
          InputProps={{
            ...params.InputProps,
            inputComponent: props.mask ? TextMaskCustom : undefined,
          }}
          inputProps={{
            ...params.inputProps,
            name: props.name,
            mask: props.mask,
          }}
        />
      )}
    />
  );
}
