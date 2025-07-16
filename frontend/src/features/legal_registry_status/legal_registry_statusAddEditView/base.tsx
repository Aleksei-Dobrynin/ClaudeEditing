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

type legal_registry_statusTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baselegal_registry_statusView: FC<legal_registry_statusTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="legal_registry_statusForm" id="legal_registry_statusForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="legal_registry_status_TitleName">
                  {translate('label:legal_registry_statusAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="description_kg"
                      data-testid="id_f_legal_registry_status_description_kg"
                      id='id_f_legal_registry_status_description_kg'
                      label={translate('label:legal_registry_statusAddEditView.description_kg')}
                      helperText={store.errors.description_kg}
                      error={!!store.errors.description_kg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.text_color}
                      onChange={(event) => store.handleChange(event)}
                      name="text_color"
                      data-testid="id_f_legal_registry_status_text_color"
                      id='id_f_legal_registry_status_text_color'
                      label={translate('label:legal_registry_statusAddEditView.text_color')}
                      helperText={store.errors.text_color}
                      error={!!store.errors.text_color}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.background_color}
                      onChange={(event) => store.handleChange(event)}
                      name="background_color"
                      data-testid="id_f_legal_registry_status_background_color"
                      id='id_f_legal_registry_status_background_color'
                      label={translate('label:legal_registry_statusAddEditView.background_color')}
                      helperText={store.errors.background_color}
                      error={!!store.errors.background_color}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_legal_registry_status_name"
                      id='id_f_legal_registry_status_name'
                      label={translate('label:legal_registry_statusAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_legal_registry_status_description"
                      id='id_f_legal_registry_status_description'
                      label={translate('label:legal_registry_statusAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_legal_registry_status_code"
                      id='id_f_legal_registry_status_code'
                      label={translate('label:legal_registry_statusAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="name_kg"
                      data-testid="id_f_legal_registry_status_name_kg"
                      id='id_f_legal_registry_status_name_kg'
                      label={translate('label:legal_registry_statusAddEditView.name_kg')}
                      helperText={store.errors.name_kg}
                      error={!!store.errors.name_kg}
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

export default Baselegal_registry_statusView;
