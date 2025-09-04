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
  Container
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import CustomButton from "../../../components/Button";

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
        <form id="StreetTypeForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="StreetType_TitleName">
                  {translate("label:StreetTypeAddEditView.entityTitle")}
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
                          id="id_f_StreetType_code"
                          label={translate("label:StreetTypeAddEditView.code")}
                          value={store.code}
                          onChange={(event) => store.handleChange(event)}
                          name="code"
                        />
                      </Grid>
                      
                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorname}
                          error={store.errorname != ""}
                          id="id_f_StreetType_name"
                          label={translate("label:StreetTypeAddEditView.name")}
                          value={store.name}
                          onChange={(event) => store.handleChange(event)}
                          name="name"
                        />
                      </Grid>
                      
                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errorname_kg}
                          error={store.errorname_kg != ""}
                          id="id_f_StreetType_name_kg"
                          label={translate("label:StreetTypeAddEditView.name_kg")}
                          value={store.name_kg}
                          onChange={(event) => store.handleChange(event)}
                          name="name_kg"
                        />
                      </Grid>
                      
                      <Grid item md={6} xs={12}>
                        <CustomTextField
                          helperText={store.errordescription}
                          error={store.errordescription != ""}
                          id="id_f_StreetType_description"
                          label={translate("label:StreetTypeAddEditView.description")}
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
                          id="id_f_StreetType_description_kg"
                          label={translate("label:StreetTypeAddEditView.description_kg")}
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