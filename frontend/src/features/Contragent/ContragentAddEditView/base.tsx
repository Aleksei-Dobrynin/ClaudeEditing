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
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import DateField from "components/DateField";
import AutocompleteCustom from "components/Autocomplete";
import dayjs from 'dayjs';

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
        <form id="ContragentForm" autoComplete='off'>
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="Contragent_TitleName">
                  {translate('label:ContragentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {/* Первое поле: Лукап организации */}
                  <Grid item md={12} xs={12}>
                    <AutocompleteCustom
                      id='id_f_Contragent_organization'
                      label={translate('label:ContragentAddEditView.organization')}
                      value={store.organization_id}
                      onChange={(event) => store.handleOrganizationChange(event)}
                      name="organization_id"
                      data={store.Organisations}
                      fieldNameDisplay={(row) => row.name || ''}
                      error={store.errororganization_id !== ''}
                      helperText={store.errororganization_id}
                    />
                  </Grid>
                  
                  {/* Название - нередактируемое */}
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname !== ''}
                      id='id_f_Contragent_name'
                      label={translate('label:ContragentAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      disabled={true}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  
                  {/* Код - нередактируемый */}
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode !== ''}
                      id='id_f_Contragent_code'
                      label={translate('label:ContragentAddEditView.code')}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      disabled={true}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  
                  {/* Дата начала */}
                  <Grid item md={6} xs={12}>
                    <DateField
                      id='id_f_Contragent_date_start'
                      label={translate('label:ContragentAddEditView.date_start')}
                      value={store.date_start}
                      onChange={(event) => store.handleDateChange('date_start', event.target.value)}
                      name="date_start"
                      error={store.errordate_start !== ''}
                      helperText={store.errordate_start}
                    />
                  </Grid>
                  
                  {/* Дата окончания */}
                  <Grid item md={6} xs={12}>
                    <DateField
                      id='id_f_Contragent_date_end'
                      label={translate('label:ContragentAddEditView.date_end')}
                      value={store.date_end}
                      onChange={(event) => store.handleDateChange('date_end', event.target.value)}
                      name="date_end"
                      error={store.errordate_end !== ''}
                      helperText={store.errordate_end}
                      minDate={store.date_start}
                    />
                  </Grid>
                  
                  {/* Адрес - необязательное поле, перемещено вниз */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.erroraddress}
                      error={store.erroraddress !== ''}
                      id='id_f_Contragent_address'
                      label={translate('label:ContragentAddEditView.address')}
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  
                  {/* Контакты - необязательное поле, перемещено вниз */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcontacts}
                      error={store.errorcontacts !== ''}
                      id='id_f_Contragent_contacts'
                      label={translate('label:ContragentAddEditView.contacts')}
                      value={store.contacts}
                      onChange={(event) => store.handleChange(event)}
                      name="contacts"
                      multiline
                      rows={2}
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