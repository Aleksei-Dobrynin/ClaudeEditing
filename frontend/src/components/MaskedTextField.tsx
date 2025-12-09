import React from 'react';
import { TextField, InputAdornment } from "@mui/material";
import { IMaskInput } from 'react-imask';

type MaskedTextFieldProps = {
  value: string | number;
  label: string;
  name: string;
  onChange: (e: any) => void;
  id: string;
  error?: boolean;
  helperText?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  InputProps?: any;
  icon?: any;
  onKeyDown?: (e: any) => void;
  onBlur?: (e: any) => void;
  noFullWidth?: boolean;
  disabled?: boolean;
  mask?: string | object;
  inputProps?: any;
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props: any, ref) {
  const { onChange, mask, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={mask}
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
    />
  );
});

const MaskedTextField = ({ onChange, mask, ...props }: MaskedTextFieldProps) => {
  const elem = props.icon
    ? React.cloneElement(props.icon, { color: "primary" })
    : null;

  const icon = elem ? (
    <InputAdornment position="start" style={{ color: 'Gray' }}>
      {elem}
    </InputAdornment>
  ) : null;

  const InputProps = {
    ...props.InputProps,
    startAdornment: icon,
    ...(mask ? { inputComponent: TextMaskCustom } : {}),
  };

  const inputProps = {
    ...(props.inputProps || {}),
    mask: mask,
    name: props.name,
    onChange: onChange,
  };

  return (
    <TextField
      {...props}
      value={props.type === "number" && props.value == null ? "" : props.value}
      variant="outlined"
      fullWidth={!props.noFullWidth}
      onKeyDown={props.onKeyDown}
      data-testid={props.id}
      onBlur={props.onBlur}
      rows={props.rows}
      size="small"
      color="primary"
      error={props.error}
      helperText={props.helperText}
      InputProps={InputProps}
      inputProps={inputProps}
    />
  );
};

export default MaskedTextField;