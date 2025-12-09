import React from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import { Select } from "@mui/material";

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
  fieldNameDisplay?: (row: any) => void;
  maxWidth?: number;
}


export default function MuiLookUp(props: SelectType) {

  return (
    <React.Fragment>
      <FormControl style={{width: props.maxWidth}} variant={"outlined"} fullWidth size="small"  required={props.required} disabled={props.disabled}>
        <InputLabel id="demo-multiple-name-label">{props.label}</InputLabel>

        <Select
          data-testid={props.id}
          error={props.error} value={props.value}
          id={props.id}
          name={props.name} variant='outlined' fullWidth onChange={(e) => {
          props.onChange(e);
        }}
        >

          <MenuItem key={props.name + '' + 0} value='0'></MenuItem>
          {
            props.data == null ? '' : props.data.map((book) => (
              <MenuItem
                key={props.name + '' + book.id}
                value={book.id}>

                {
                  props.fieldNameDisplay == null
                    ? book.name
                    : props.fieldNameDisplay(book)
                }
              </MenuItem>

            ))}
        </Select>
        {props.error ? <FormHelperText error={true}>{props.helperText}</FormHelperText> : ''}
      </FormControl>
    </React.Fragment>
  );
}