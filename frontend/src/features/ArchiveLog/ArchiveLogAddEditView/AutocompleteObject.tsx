import React, { FC, useState, useEffect } from "react";
import {
  CircularProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type ObjectSearchProps = {
  value: string;
};

const ObjectSearch: FC<ObjectSearchProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const [inputValue, setInputValue] = useState<string>(props.value);

  useEffect(() => {
    if (props.value == "") {
      setInputValue("");
    }
    setInputValue(props.value);
  }, [props.value]);

  return (
    <Autocomplete
      freeSolo={true}
      value={store.ArchiveObjects.find(obj => obj?.id === store.archive_object_id) || (inputValue ? { doc_number: inputValue } :  { doc_number: '' })}
      onChange={(event, newValue) => {
        store.changeArchiveObject(newValue);
      }}
      options={store.ArchiveObjects.filter(x => !store.archiveObjects.some(a => a.id === x.id))}
      getOptionLabel={(obj) => obj.doc_number}
      id="id_f_archive_object_id"
      onInputChange={(event, newInputValue) => {
        if (event?.type === "change") {
          store.changeObjectInput(newInputValue);
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth
      filterOptions={(options, state) => {
        const filtered = options.filter((option) => {
          const str = `${option.doc_number}`;
          return str.toLowerCase().includes(state.inputValue.toLowerCase());
        });
        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={translate("label:ArchiveLogAddEditView.doc_number")}
          error={store.errorarchive_object_id !== ""}
          fullWidth
          disabled={store.id != 0}
          size="small"
          helperText={store.errorarchive_object_id}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {store.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />

  );
});


export default ObjectSearch;
