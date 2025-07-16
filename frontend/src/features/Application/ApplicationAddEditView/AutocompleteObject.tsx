import React, { FC, useState } from "react";
import {
  CircularProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type ObjectSearchProps = {
};

const ObjectSearch: FC<ObjectSearchProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [inputValue, setInputValue] = useState("");
  const addNewArchObjectOption = { id: -1, pin: "", name: translate("label:ApplicationAddEditView.add_arch_object") };

  return (
    <Autocomplete
      disabled={store.id > 0}
      value={store.ArchObjects.find(obj => obj?.id === store.arch_object_id) || null}
      onChange={(event, newValue) => {
        if (newValue?.id === -1) {
          store.onAddArchObjectClicked(inputValue);
        } else {
          store.changeArchObject(newValue)
        }
      }}
      options={store.ArchObjects}
      getOptionLabel={(obj) => obj.id === -1 ? obj.name : `(${obj.address}) / ${obj.name}`}
      id="id_f_arch_object_id"
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        if (event?.type === "change") {
          store.changeObjectInput(newInputValue)
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth
      filterOptions={(options, state) => {
        const filtered = options.filter((option) => {
          const str = `(${option.address}) / ${option.name}`;
          console.log(str)
          return str.toLowerCase().includes(state.inputValue.toLowerCase());
        });
        if (filtered.length === 0) {
          filtered.push(addNewArchObjectOption);
        }
        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={translate("label:ApplicationAddEditView.arch_object_id")}
          error={store.errorarch_object_id !== ""}
          fullWidth
          size="small"
          helperText={store.errorarch_object_id}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {store.objectLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}

    />

  );
});


export default ObjectSearch;
