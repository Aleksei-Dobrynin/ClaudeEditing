import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import FormHelperText from '@mui/material/FormHelperText';

type SelectType = {
  data: any[];
  value: number;
  label: string;
  name: string;
  helperText?: string;
  error?: boolean;
  hideLabel?: boolean;
  onChange: (e) => void;
  id: string;
  sx?: any;
  required?: boolean;
  disabled?: boolean;
  fieldNameDisplay?: (row: any) => void;
  maxWidth?: number;
  skipEmpty?: boolean;
}


export default function LookUp(props: SelectType) {

  return (
    <React.Fragment>
      <FormControl sx={props.sx} style={{ width: props.maxWidth }} variant={"outlined"} size="small" fullWidth required={props.required} disabled={props.disabled}>
        {!props.hideLabel && <InputLabel id="demo-multiple-name-label">{props.label}</InputLabel>}
        <NativeSelect
          data-testid={props.id}
          error={props.error} value={props.value}
          id={props.id}
          name={props.name} variant='outlined' fullWidth onChange={(e) => {
            props.onChange(e);
          }}
        >
          {props.skipEmpty ? "" : <>
            <option key={props.name + '' + 0} value='0'></option>
          </>}
          {
            props.data == null ? '' : props.data.map((book) => (
              <option key={props.name + '' + book.id} value={book.id}>{
                props.fieldNameDisplay == null
                  ? book.name
                  : props.fieldNameDisplay(book)
              }</option>
            ))}
        </NativeSelect>
        {props.error ? <FormHelperText error={true}>{props.helperText}</FormHelperText> : ''}
      </FormControl>
    </React.Fragment>
  );
}