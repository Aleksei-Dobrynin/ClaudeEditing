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

type notificationTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BasenotificationView: FC<notificationTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="notificationForm" id="notificationForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="notification_TitleName">
                  {translate('label:notificationAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.title}
                      onChange={(event) => store.handleChange(event)}
                      name="title"
                      data-testid="id_f_notification_title"
                      id='id_f_notification_title'
                      label={translate('label:notificationAddEditView.title')}
                      helperText={store.errors.title}
                      error={!!store.errors.title}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.text}
                      onChange={(event) => store.handleChange(event)}
                      name="text"
                      data-testid="id_f_notification_text"
                      id='id_f_notification_text'
                      label={translate('label:notificationAddEditView.text')}
                      helperText={store.errors.text}
                      error={!!store.errors.text}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.employee_id}
                      onChange={(event) => store.handleChange(event)}
                      name="employee_id"
                      data-testid="id_f_notification_employee_id"
                      id='id_f_notification_employee_id'
                      label={translate('label:notificationAddEditView.employee_id')}
                      helperText={store.errors.employee_id}
                      error={!!store.errors.employee_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.user_id}
                      onChange={(event) => store.handleChange(event)}
                      name="user_id"
                      data-testid="id_f_notification_user_id"
                      id='id_f_notification_user_id'
                      label={translate('label:notificationAddEditView.user_id')}
                      helperText={store.errors.user_id}
                      error={!!store.errors.user_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.has_read}
                      onChange={(event) => store.handleChange(event)}
                      name="has_read"
                      label={translate('label:notificationAddEditView.has_read')}
                      id='id_f_notification_has_read'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_notification_created_at'
                      label={translate('label:notificationAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_notification_code"
                      id='id_f_notification_code'
                      label={translate('label:notificationAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.link}
                      onChange={(event) => store.handleChange(event)}
                      name="link"
                      data-testid="id_f_notification_link"
                      id='id_f_notification_link'
                      label={translate('label:notificationAddEditView.link')}
                      helperText={store.errors.link}
                      error={!!store.errors.link}
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

export default BasenotificationView;
