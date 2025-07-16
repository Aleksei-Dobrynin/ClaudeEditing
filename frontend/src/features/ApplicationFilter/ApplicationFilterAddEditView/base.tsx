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
  Box,
  Dialog,
  FormControlLabel,
  Container, IconButton
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ApplicationListView from "../../Application/ApplicationListView";

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

        <form id="ApplicationFilterForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="ApplicationFilter_TitleName">
                  {translate("label:ApplicationFilterAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname != ""}
                      id="id_f_ApplicationFilter_name"
                      label={translate("label:ApplicationFilterAddEditView.name")}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorpost_id}
                      error={store.errorpost_id != ""}
                      id="id_f_ApplicationFilter_post_id"
                      label={translate("label:ApplicationFilterAddEditView.post_id")}
                      value={store.post_id}
                      onChange={(event) => store.handleChange(event)}
                      name="post_name"
                      data={store.orgPosts}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errortype_id}
                      error={store.errortype_id != ""}
                      id="id_f_ApplicationFilter_type_id"
                      label={translate("label:ApplicationFilterAddEditView.type_id")}
                      value={store.type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="type_id"
                      data={store.filterTypes}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CustomTextField
                        id="id_f_ApplicationFilter_parameters"
                        label={translate("label:ApplicationFilterAddEditView.parameters")}
                        value={store.parameters}
                        onChange={(event) => store.handleChange(event)}
                        name="parameters"
                        multiline={true}
                      />
                      <IconButton sx={{ ml: 1 }} onClick={() => {
                        store.openPanel = true;
                      }}>
                        {store.parameters?.length > 0 ? <EditIcon /> : <AddIcon />}
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode != ""}
                      id="id_f_ApplicationFilter_code"
                      label={translate("label:ApplicationFilterAddEditView.code")}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ""}
                      id="id_f_ApplicationFilter_description"
                      label={translate("label:ApplicationFilterAddEditView.description")}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
      <Dialog maxWidth={"xl"} fullWidth={true} open={store.openPanel}>
        <ApplicationListView finPlan={false} forFilter />
      </Dialog>
    </Container>
  );
});


export default BaseView;
