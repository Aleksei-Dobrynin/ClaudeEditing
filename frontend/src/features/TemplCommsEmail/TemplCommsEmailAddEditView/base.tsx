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
        <Grid item md={props.isPopup ? 12 : 6}>
          <form id="TemplCommsEmailForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="TemplCommsEmail_TitleName">
                  {translate('label:TemplCommsEmailAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.subject_email}
                      onChange={(event) => store.handleChange(event)}
                      name="subject_email"
                      data-testid="id_f_TemplCommsEmail_subject_email"
                      id='id_f_TemplCommsEmail_subject_email'
                      label={translate('label:TemplCommsEmailAddEditView.subject_email')}
                      helperText={store.errors.subject_email}
                      error={!!store.errors.subject_email}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.body_email}
                      onChange={(event) => store.handleChange(event)}
                      name="body_email"
                      data-testid="id_f_TemplCommsEmail_body_email"
                      id='id_f_TemplCommsEmail_body_email'
                      label={translate('label:TemplCommsEmailAddEditView.body_email')}
                      helperText={store.errors.body_email}
                      error={!!store.errors.body_email}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.language_id}
                      onChange={(event) => store.handleChange(event)}
                      name="language_id"
                      data={store.DictionaryLanguages}
                      id='id_f_TemplCommsEmail_language_id'
                      label={translate('label:TemplCommsEmailAddEditView.language_id')}
                      helperText={store.errors.language_id}
                      error={store.errors.language_id !== ''}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
