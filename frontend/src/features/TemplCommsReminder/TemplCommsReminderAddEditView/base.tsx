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
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container>
        <Grid item md={props.isPopup ? 12 : 12}>
          <form id="TemplCommsReminderForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="TemplCommsReminder_TitleName">
                  {translate('label:TemplCommsReminderAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <LookUp
                      value={store.reminder_recipientsgroup_id}
                      onChange={(event) => store.handleChange(event)}
                      name="reminder_recipientsgroup_id"
                      data={store.TemplRemindersDays}
                      id='id_f_TemplCommsReminder_reminder_recipientsgroup_id'
                      label={translate('label:TemplCommsReminderAddEditView.reminder_recipientsgroup_id')}
                      helperText={store.errors.reminder_recipientsgroup_id}
                      error={store.errors.reminder_recipientsgroup_id !== ''}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <LookUp
                      value={store.reminder_days_id}
                      onChange={(event) => store.handleChange(event)}
                      name="reminder_days_id"
                      data={store.TemplReminderRecipientsGroups}
                      id='id_f_TemplCommsReminder_reminder_days_id'
                      label={translate('label:TemplCommsReminderAddEditView.reminder_days_id')}
                      helperText={store.errors.reminder_days_id}
                      error={store.errors.reminder_days_id !== ''}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.time_send_reminder}
                      onChange={(event) => store.handleChange(event)}
                      name="time_send_reminder"
                      id='id_f_TemplCommsReminder_time_send_reminder'
                      label={translate('label:TemplCommsReminderAddEditView.time_send_reminder')}
                      helperText={store.errors.time_send_reminder}
                      error={!!store.errors.time_send_reminder}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
      {props.children}
    </Container >
  );
})


export default BaseView;
