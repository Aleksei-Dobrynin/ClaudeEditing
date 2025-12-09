import { FC, useState } from "react";
import {
  Grid,
  Typography, IconButton, Tooltip
} from "@mui/material";
import CustomTextField from "components/TextField";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ObjectSearch from "./AutocompleteObject";

export const ArchiveObjectSelector: FC = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  const handleAddObject = () => {
    if (store.doc_number) {
      store.archiveObjects.push({ id: store.archive_object_id, doc_number: store.doc_number, address: store.address });
      store.archive_object_id = 0;
      store.doc_number = '';
      store.address = '';
    }
  };

  const handleRemoveObject = (index: number) => {
    store.archiveObjects.splice(index, 1);
  };

  return (
    <Grid container spacing={2}>
      {store.archiveObjects.length > 0 && <Grid item xs={12}>
        <Typography variant="h6">{translate("label:ArchiveLogAddEditView.Selected_objects")}</Typography>
      </Grid>}
      <br />
      {store.archiveObjects?.map((obj, index) => (
        <Grid container item spacing={2} key={obj.id ?? `new_${index}`}>
          <Grid item md={5} xs={5}>
            <CustomTextField
              label={translate("label:ArchiveLogAddEditView.doc_number")}
              id={`doc_number_${obj.doc_number}`}
              name={`doc_number_${obj.doc_number}`}
              value={obj.doc_number}
              onChange={() => {
              }}
              disabled={true}
            />
          </Grid>
          <Grid item md={5} xs={5}>
            <CustomTextField
              label={translate("label:ArchiveLogAddEditView.address")}
              id={`address_${obj.id}`}
              name={`address_${obj.id}`}
              value={obj.address}
              onChange={() => {
              }}
              disabled={true}
            />
          </Grid>
          <Grid item md={2} xs={2}>
            {store.id == 0 && <Tooltip title={translate("delete")}>
              <IconButton size="small" onClick={() => handleRemoveObject(index)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>}
          </Grid>
        </Grid>
      ))}

      <Grid item md={5} xs={5}>
        <ObjectSearch
          value={store.doc_number}
        />
      </Grid>
      <Grid item md={5} xs={5}>
          <CustomTextField
            helperText={store.erroraddress}
            error={store.erroraddress != ""}
            id="id_f_ArchiveLog_address"
            label={translate("label:ArchiveLogAddEditView.address")}
            value={store.address}
            onChange={(event) => store.handleChange(event)}
            name="address"
            disabled={store.id != 0}
          />
      </Grid>
      <Grid item md={2} xs={2}>
        {store.id == 0 && <Tooltip title={translate("add")}>
          <IconButton size="small" onClick={handleAddObject} disabled={(store.doc_number === "") && !store.doc_number?.includes("/")}>
            <AddIcon />
          </IconButton>
        </Tooltip>}
      </Grid>
    </Grid>
  );
});