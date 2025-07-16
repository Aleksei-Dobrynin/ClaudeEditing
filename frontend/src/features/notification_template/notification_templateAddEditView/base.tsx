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

type notification_templateTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basenotification_templateView: FC<notification_templateTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="notification_templateForm" id="notification_templateForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="notification_template_TitleName">
                  {translate('label:notification_templateAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.contact_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="contact_type_id"
                      data={store.contact_types}
                      id='id_f_notification_template_contact_type_id'
                      label={translate('label:notification_templateAddEditView.contact_type_id')}
                      helperText={store.errors.contact_type_id}
                      error={!!store.errors.contact_type_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_notification_template_code"
                      id='id_f_notification_template_code'
                      label={translate('label:notification_templateAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.subject}
                      onChange={(event) => store.handleChange(event)}
                      name="subject"
                      data-testid="id_f_notification_template_subject"
                      id='id_f_notification_template_subject'
                      label={translate('label:notification_templateAddEditView.subject')}
                      helperText={store.errors.subject}
                      error={!!store.errors.subject}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.body}
                      multiline
                      onChange={(event) => store.handleChange(event)}
                      name="body"
                      data-testid="id_f_notification_template_body"
                      id='id_f_notification_template_body'
                      label={translate('label:notification_templateAddEditView.body')}
                      helperText={store.errors.body}
                      error={!!store.errors.body}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.placeholders}
                      onChange={(event) => store.handleChange(event)}
                      name="placeholders"
                      data-testid="id_f_notification_template_placeholders"
                      id='id_f_notification_template_placeholders'
                      label={translate('label:notification_templateAddEditView.placeholders')}
                      helperText={store.errors.placeholders}
                      error={!!store.errors.placeholders}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.link}
                      onChange={(event) => store.handleChange(event)}
                      name="link"
                      data-testid="id_f_notification_template_link"
                      id='id_f_notification_template_link'
                      label={translate('label:notification_templateAddEditView.link')}
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

export default Basenotification_templateView;
