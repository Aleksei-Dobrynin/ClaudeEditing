import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Container,
  Autocomplete,
  TextField
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import CustomButton from "../../../components/Button";
import CustomCheckbox from "../../../components/Checkbox";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Container maxWidth="xl" style={{ marginTop: 20 }}>
      <Grid container>
        <form id="StreetForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="Street_TitleName">
                  {translate("label:StreetAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorcode}
                          error={store.errorcode != ""}
                          id="id_f_Street_code"
                          label={translate("label:StreetAddEditView.code")}
                          value={store.code}
                          onChange={(event) => store.handleChange(event)}
                          name="code"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorname}
                          error={store.errorname != ""}
                          id="id_f_Street_name"
                          label={translate("label:StreetAddEditView.name")}
                          value={store.name}
                          onChange={(event) => store.handleChange(event)}
                          name="name"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorname_kg}
                          error={store.errorname_kg != ""}
                          id="id_f_Street_name_kg"
                          label={translate("label:StreetAddEditView.name_kg")}
                          value={store.name_kg}
                          onChange={(event) => store.handleChange(event)}
                          name="name_kg"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Autocomplete
                          id="id_f_Address_unit_id"
                          options={store.AddressUnits}
                          getOptionLabel={(option) => option.name || ''}
                          value={store.AddressUnits.find(item => item.id === store.address_unit_id) || null}
                          onChange={(event, newValue) => {
                            store.handleChange({
                              target: {
                                name: 'address_unit_id',
                                value: newValue ? newValue.id : 0
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate("label:StreetAddEditView.address_unit_id")}
                              error={store.erroraddress_unit_id != ""}
                              helperText={store.erroraddress_unit_id}
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Autocomplete
                          id="id_f_street_type_id"
                          options={store.StreetTypes}
                          getOptionLabel={(option) => option.name || ''}
                          value={store.StreetTypes.find(item => item.id === store.street_type_id) || null}
                          onChange={(event, newValue) => {
                            store.handleChange({
                              target: {
                                name: 'street_type_id',
                                value: newValue ? newValue.id : 0
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate("label:StreetAddEditView.type_id")}
                              error={store.errorstreet_type_id != ""}
                              helperText={store.errorstreet_type_id}
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomCheckbox
                          value={store.expired}
                          onChange={(event) => store.handleChange(event)}
                          name="expired"
                          label={translate("label:StreetAddEditView.expired")}
                          id="id_f_expired"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorstreet_id}
                          error={store.errorstreet_id != ""}
                          id="id_f_Street_street_id"
                          label={translate("label:StreetAddEditView.street_id")}
                          value={store.street_id || ''}
                          onChange={(event) => store.handleChange(event)}
                          name="street_id"
                          type="number"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errordescription}
                          error={store.errordescription != ""}
                          id="id_f_Street_description"
                          label={translate("label:StreetAddEditView.description")}
                          value={store.description}
                          onChange={(event) => store.handleChange(event)}
                          name="description"
                          multiline
                          rows={3}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errordescription_kg}
                          error={store.errordescription_kg != ""}
                          id="id_f_Street_description_kg"
                          label={translate("label:StreetAddEditView.description_kg")}
                          value={store.description_kg}
                          onChange={(event) => store.handleChange(event)}
                          name="description_kg"
                          multiline
                          rows={3}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
});

export default BaseView;