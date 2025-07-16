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
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="TemplTemplateCommsForm" id="TemplTemplateCommsForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="TemplTemplateComms_TitleName">
                  {translate('label:TemplTemplateCommsAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_TemplTemplateComms_name"
                      id='id_f_TemplTemplateComms_name'
                      label={translate('label:TemplTemplateCommsAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.reminder_days_id}
                      onChange={(event) => store.handleChange(event)}
                      name="reminder_days_id"
                      data={store.TemplRemindersDayss}
                      id='id_f_TemplTemplateComms_reminder_days_id'
                      label={translate('label:TemplTemplateCommsAddEditView.reminder_days_id')}
                      helperText={store.errors.reminder_days_id}
                      error={!!store.errors.reminder_days_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_send_report}
                      onChange={(event) => store.handleChange(event)}
                      name={"is_send_report"}
                      label={translate('label:TemplTemplateCommsAddEditView.is_send_report')}
                      id='id_f_TemplTemplateComms_is_send_report'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.time_send_report}
                      onChange={(event) => store.handleChange(event)}
                      name="time_send_report"
                      id='id_f_TemplTemplateComms_time_send_report'
                      label={translate('label:TemplTemplateCommsAddEditView.time_send_report')}
                      helperText={store.errors.time_send_report}
                      error={!!store.errors.time_send_report}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      id='id_f_TemplTemplateComms_description'
                      label={translate('label:TemplTemplateCommsAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})


export default BaseView;
