import React, { FC, useState } from "react";
import {
  CircularProgress,
  InputAdornment,
  Box,
  alpha,
  styled
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Business, AddCircleOutline } from "@mui/icons-material";

// Типы
interface ArchObject {
  id: number;
  name: string;
  address: string;
  pin?: string;
}

// Styled components
const StyledAutocomplete = styled(Autocomplete<ArchObject>)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: "all 0.3s ease",
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      }
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    fontWeight: 500
  }
}));

const AddNewOption = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: 500,
  padding: theme.spacing(1, 0),
  "& svg": {
    fontSize: "1.2rem"
  }
}));

const OptionItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0)
}));

const OptionPrimary = styled("span")(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary
}));

const OptionSecondary = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary
}));

type ObjectSearchProps = {
};

const ObjectSearch: FC<ObjectSearchProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [inputValue, setInputValue] = useState("");
  const addNewArchObjectOption: ArchObject = { 
    id: -1, 
    pin: "", 
    name: translate("label:ApplicationAddEditView.add_arch_object"),
    address: ""
  };

  return (
    <StyledAutocomplete
      disabled={store.id > 0}
      value={store.ArchObjects.find((obj: ArchObject) => obj?.id === store.arch_object_id) || null}
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
        const filtered = options.filter((option: ArchObject) => {
          const str = `(${option.address}) / ${option.name}`;
          return str.toLowerCase().includes(state.inputValue.toLowerCase());
        });
        if (filtered.length === 0) {
          filtered.push(addNewArchObjectOption);
        }
        return filtered;
      }}
      renderOption={(props, option) => {
        if (option.id === -1) {
          return (
            <li {...props}>
              <AddNewOption>
                <AddCircleOutline />
                {option.name}
              </AddNewOption>
            </li>
          );
        }
        return (
          <li {...props}>
            <OptionItem>
              <OptionPrimary>{option.name}</OptionPrimary>
              <OptionSecondary>{option.address}</OptionSecondary>
            </OptionItem>
          </li>
        );
      }}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={translate("label:ApplicationAddEditView.arch_object_id")}
          error={store.errorarch_object_id !== ""}
          fullWidth
          size="small"
          helperText={store.errorarch_object_id}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <Business color="action" />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
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