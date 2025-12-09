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
        <form id="AddressUnitForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="AddressUnit_TitleName">
                  {translate("label:AddressUnitAddEditView.entityTitle")}
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
                          id="id_f_AddressUnit_code"
                          label={translate("label:AddressUnitAddEditView.code")}
                          value={store.code}
                          onChange={(event) => store.handleChange(event)}
                          name="code"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorname}
                          error={store.errorname != ""}
                          id="id_f_AddressUnit_name"
                          label={translate("label:AddressUnitAddEditView.name")}
                          value={store.name}
                          onChange={(event) => store.handleChange(event)}
                          name="name"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorname_kg}
                          error={store.errorname_kg != ""}
                          id="id_f_AddressUnit_name_kg"
                          label={translate("label:AddressUnitAddEditView.name_kg")}
                          value={store.name_kg}
                          onChange={(event) => store.handleChange(event)}
                          name="name_kg"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Autocomplete
                          id="id_f_AddressUnit_type_id"
                          options={store.AddressUnitTypes}
                          getOptionLabel={(option) => option.name || ''}
                          value={store.AddressUnitTypes.find(item => item.id === store.type_id) || null}
                          onChange={(event, newValue) => {
                            store.handleChange({
                              target: {
                                name: 'type_id',
                                value: newValue ? newValue.id : 0
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate("label:AddressUnitAddEditView.type_id")}
                              error={store.errortype_id != ""}
                              helperText={store.errortype_id}
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Autocomplete
                          id="id_f_Parent_id"
                          options={store.AddressUnits}
                          getOptionLabel={(option) => option.name || ''}
                          value={store.AddressUnits.find(item => item.id === store.parent_id) || null}
                          onChange={(event, newValue) => {
                            store.handleChange({
                              target: {
                                name: 'parent_id',
                                value: newValue ? newValue.id : 0
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate("label:AddressUnitAddEditView.parent_id")}
                              error={store.errorparent_id!= ""}
                              helperText={store.errorparent_id}
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
                          label={translate("label:AddressUnitAddEditView.expired")}
                          id="id_f_expired"
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorstreet_id}
                          error={store.errorstreet_id != ""}
                          id="id_f_AddressUnit_street_id"
                          label={translate("label:AddressUnitAddEditView.street_id")}
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
                          id="id_f_AddressUnit_description"
                          label={translate("label:AddressUnitAddEditView.description")}
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
                          id="id_f_AddressUnit_description_kg"
                          label={translate("label:AddressUnitAddEditView.description_kg")}
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