import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import LookUp from "components/LookUp";

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

        <form id="JournalTemplateTypeForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="JournalTemplateType_TitleName">
                  {translate("label:JournalTemplateTypeAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname !== ""}
                      id="id_f_JournalTemplateType_name"
                      label={translate("label:JournalTemplateTypeAddEditView.name")}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode !== ""}
                      id="id_f_JournalTemplateType_code"
                      label={translate("label:JournalTemplateTypeAddEditView.code")}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorraw_value}
                      error={store.errorraw_value !== ""}
                      id="id_f_JournalTemplateType_raw_value"
                      label={translate("label:JournalTemplateTypeAddEditView.raw_value")}
                      value={store.raw_value}
                      onChange={(event) => store.handleChange(event)}
                      name="raw_value"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorplaceholder_id}
                      error={store.errorplaceholder_id !== ""}
                      id="id_f_JournalTemplateType_placeholder_id"
                      label={translate("label:JournalTemplateTypeAddEditView.placeholder_id")}
                      value={store.placeholder_id}
                      data={store.Placeholders}
                      onChange={(event) => store.handleChange(event)}
                      name="placeholder_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorexample}
                      error={store.errorexample !== ""}
                      id="id_f_JournalTemplateType_example"
                      label={translate("label:JournalTemplateTypeAddEditView.example")}
                      value={store.example}
                      onChange={(event) => store.handleChange(event)}
                      name="example"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  )
    ;
});


export default BaseView;
