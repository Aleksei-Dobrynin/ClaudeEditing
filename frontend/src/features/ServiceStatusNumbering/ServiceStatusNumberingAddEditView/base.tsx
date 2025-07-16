import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import CustomTextField from "components/TextField";
import DateField from "../../../components/DateField";
import CustomCheckbox from "../../../components/Checkbox";
import LookUp from "../../../components/LookUp";
import applicationStore from "../../Application/ApplicationAddEditView/store";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>
      <Grid container>

        <form id="ServiceStatusNumberingForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ServiceStatusNumbering_TitleName">
                  {translate('label:ServiceStatusNumberingAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <DateField
                      helperText={store.errordate_start}
                      error={store.errordate_start !== ""}
                      id="id_f_ServiceStatusNumbering_date_start"
                      label={translate("label:ServiceStatusNumberingAddEditView.date_start")}
                      value={store.date_start}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      helperText={store.errordate_end}
                      error={store.errordate_end !== ""}
                      id="id_f_ServiceStatusNumbering_date_end"
                      label={translate("label:ServiceStatusNumberingAddEditView.date_end")}
                      value={store.date_end}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      id="id_f_ServiceStatusNumbering_is_active"
                      label={translate("label:ServiceStatusNumberingAddEditView.is_active")}
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errordate_end}
                      error={store.errordate_end !== ""}
                      id="id_f_ServiceStatusNumbering_journal_id"
                      label={translate('label:ServiceStatusNumberingAddEditView.journal_id')}
                      value={store.journal_id}
                      onChange={(event) => store.handleChange(event)}
                      name="journal_id"
                      data={store.Journals}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errornumber_template}
                      error={store.errornumber_template !== ''}
                      id='id_f_ServiceStatusNumbering_number_template'
                      label={translate('label:ServiceStatusNumberingAddEditView.number_template')}
                      value={store.number_template}
                      onChange={(event) => store.handleChange(event)}
                      name="number_template"
                    />
                  </Grid> */}
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
