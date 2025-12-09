import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import FormHelperText from '@mui/material/FormHelperText';
import { Autocomplete, TextField } from '@mui/material';
import Typography from "@mui/material/Typography";

type SelectType = {
  data: any[];
  value: number;
  label: string;
  name: string;
  helperText?: string;
  error?: boolean;
  onChange: (e) => void;
  id: string;
  required?: boolean;
  disabled?: boolean;
  fieldNameDisplay?: (row: any) => string;
  maxWidth?: number;
}


export default function AutocompleteCustomImg(props: SelectType) {

  return (
    <Autocomplete
      value={props.data.find(customer => customer.id === props.value) || null}
      onChange={(event, newValue) => {
        props.onChange({
          target: { name: props.name, value: newValue ? newValue.id : 0 }
        });
      }}
      options={props.data}
      getOptionLabel={props.fieldNameDisplay}
      id={props.id}
      renderOption={(params, option) => {
        return <>
          <li {...params} style={{display: "flex"}}>
            <img
              style={{ width: 20, height: 15, marginRight: 10 }}
              src={option.icon_svg} alt={"flag"}
            />
            <Typography variant="body2" color="textSecondary" component="div">{option.name}</Typography>
          </li>
        </>
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth
      disabled={props.disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          helperText={props.helperText}
          error={props.error}
          size={"small"}
        />
      )}
    />
  );
}