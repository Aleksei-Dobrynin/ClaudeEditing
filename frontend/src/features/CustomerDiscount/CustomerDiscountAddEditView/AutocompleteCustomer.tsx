import React, { FC, useState } from "react";
import {
  CircularProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type CustomerSearchProps = {
};

const CustomerSearch: FC<CustomerSearchProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [ setInputValue] = useState("");

  return (
    <Autocomplete
      value={store.Customers.find(customer => customer?.id === store.customer_id) || null}
      onChange={(event, newValue) => {
          store.customer_id = newValue.id;
          store.pin_customer = newValue.pin
          store.loadCustomers();
      }}
      options={store.Customers}
      getOptionLabel={(customer) => `ИНН ${customer?.pin} ${" - " + customer?.full_name}`}
      id="id_f_customer_id"
      onInputChange={(event, newInputValue) => {
        if (event?.type === "change") {
          console.log(newInputValue)
          store.changeCustomerInput(newInputValue)
          store.loadCustomers();
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth
      filterOptions={(options, state) => {
        const filtered = options.filter((option) => {
          const str = `ИНН ${option?.pin} - ${option?.full_name}`;
          return str.toLowerCase().includes(state.inputValue.toLowerCase());
        });
        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Поиск заказчика"}
          fullWidth
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {store.customerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}

    />

  );
});


export default CustomerSearch;
