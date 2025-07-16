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

type application_legal_recordTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baseapplication_legal_recordView: FC<application_legal_recordTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="application_legal_recordForm" id="application_legal_recordForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="application_legal_record_TitleName">
                  {translate('label:application_legal_recordAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.id_legalrecord}
                      onChange={(event) => store.handleChange(event)}
                      name="id_legalrecord"
                      data={store.legal_record_registries}
                      id='id_f_application_legal_record_id_legalrecord'
                      label={translate('label:application_legal_recordAddEditView.id_legalrecord')}
                      helperText={store.errors.id_legalrecord}
                      error={!!store.errors.id_legalrecord}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.id_legalact}
                      onChange={(event) => store.handleChange(event)}
                      name="id_legalact"
                      data={store.legal_act_registries}
                      id='id_f_application_legal_record_id_legalact'
                      label={translate('label:application_legal_recordAddEditView.id_legalact')}
                      helperText={store.errors.id_legalact}
                      error={!!store.errors.id_legalact}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_application_legal_record_created_at'
                      label={translate('label:application_legal_recordAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_application_legal_record_updated_at'
                      label={translate('label:application_legal_recordAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_application_legal_record_created_by"
                      id='id_f_application_legal_record_created_by'
                      label={translate('label:application_legal_recordAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_application_legal_record_updated_by"
                      id='id_f_application_legal_record_updated_by'
                      label={translate('label:application_legal_recordAddEditView.updated_by')}
                      helperText={store.errors.updated_by}
                      error={!!store.errors.updated_by}
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

export default Baseapplication_legal_recordView;
