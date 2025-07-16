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
        <form id="JournalApplicationForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="JournalApplication_TitleName">
                  {translate("label:JournalApplicationAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorjournal_id}
                      error={store.errorjournal_id !== ""}
                      id="id_f_JournalApplication_journal_id"
                      label={translate("label:JournalApplicationAddEditView.journal_id")}
                      value={store.journal_id}
                      onChange={(event) => store.handleChange(event)}
                      name="journal_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorapplication_id}
                      error={store.errorapplication_id !== ""}
                      id="id_f_JournalApplication_application_id"
                      label={translate("label:JournalApplicationAddEditView.application_id")}
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorapplication_status_id}
                      error={store.errorapplication_status_id !== ""}
                      id="id_f_JournalApplication_application_status_id"
                      label={translate("label:JournalApplicationAddEditView.application_status_id")}
                      value={store.application_status_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_status_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.erroroutgoing_number}
                      error={store.erroroutgoing_number !== ""}
                      id="id_f_JournalApplication_outgoing_number"
                      label={translate("label:JournalApplicationAddEditView.outgoing_number")}
                      value={store.outgoing_number}
                      onChange={(event) => store.handleChange(event)}
                      name="outgoing_number"
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
  );
});


export default BaseView;
