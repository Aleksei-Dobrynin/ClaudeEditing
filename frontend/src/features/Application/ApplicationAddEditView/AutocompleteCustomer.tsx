import React, { FC, useState } from "react";
import {
  CircularProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import customerRepresentativeStoreList from "../../CustomerRepresentative/CustomerRepresentativeListView/store";

type CustomerSearchProps = {
};

const CustomerSearch: FC<CustomerSearchProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [inputValue, setInputValue] = useState("");
  const addNewCustomerOption = { id: -1, pin: "", full_name: translate("label:ApplicationAddEditView.add_customer") };

  return (
    <Autocomplete
      disabled={store.id > 0}
      value={store.Customers.find(customer => customer?.id === store.customer_id) || null}
      onChange={(event, newValue) => {
        if (newValue?.id === -1) {
          store.onAddCustomerClicked(store.customerInputValue);
          setInputValue("")
        } else {
          store.changeCustomer(newValue)
          // customerRepresentativeStoreList.loadCustomerRepresentativesByCustomer(newValue?.id);
        }
      }}
      options={store.Customers}
      getOptionLabel={(customer) => customer.id === -1
        ? customer.full_name
        : `ИНН ${customer?.pin} ${" - " + customer?.full_name}` || ""}
      id="id_f_customer_id"
      onInputChange={(event, newInputValue) => {
        // setInputValue(newInputValue);
        if (event?.type === "change") {
          store.changeCustomerInput(newInputValue)
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth
      filterOptions={(options, state) => {
        const filtered = options.filter((option) => {
          const str = `ИНН ${option?.pin} - ${option?.full_name}`;
          return str.toLowerCase().includes(state.inputValue.toLowerCase());
        });
        if (filtered.length === 0) {
          filtered.push(addNewCustomerOption);
        }
        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={translate("label:ApplicationAddEditView.customer_search")}
          // error={store.errorcustomer_id !== ""}
          fullWidth
          size="small"
          // helperText={store.errorcustomer_id}
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
