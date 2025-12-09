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
        <form id="JournalPlaceholderForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="JournalPlaceholder_TitleName">
                  {translate("label:JournalPlaceholderAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errororder_number}
                      error={store.errororder_number !== ""}
                      id="id_f_JournalPlaceholder_order_number"
                      label={translate("label:JournalPlaceholderAddEditView.order_number")}
                      value={store.order_number}
                      onChange={(event) => store.handleChange(event)}
                      name="order_number"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errortemplate_id}
                      error={store.errortemplate_id !== ""}
                      id="id_f_JournalPlaceholder_template_id"
                      label={translate("label:JournalPlaceholderAddEditView.template_id")}
                      value={store.template_id}
                      onChange={(event) => store.handleChange(event)}
                      name="template_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorjournal_id}
                      error={store.errorjournal_id !== ""}
                      id="id_f_JournalPlaceholder_journal_id"
                      label={translate("label:JournalPlaceholderAddEditView.journal_id")}
                      value={store.journal_id}
                      onChange={(event) => store.handleChange(event)}
                      name="journal_id"
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
