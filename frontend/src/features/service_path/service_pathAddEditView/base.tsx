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

type service_pathTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baseservice_pathView: FC<service_pathTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="service_pathForm" id="service_pathForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="service_path_TitleName">
                  {translate('label:service_pathAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.service_id}
                      onChange={(event) => store.handleChange(event)}
                      name="service_id"
                      data={store.services}
                      id='id_f_service_path_service_id'
                      label={translate('label:service_pathAddEditView.service_id')}
                      helperText={store.errors.service_id}
                      error={!!store.errors.service_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_service_path_name"
                      id='id_f_service_path_name'
                      label={translate('label:service_pathAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_service_path_description"
                      id='id_f_service_path_description'
                      label={translate('label:service_pathAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_default}
                      onChange={(event) => store.handleChange(event)}
                      name="is_default"
                      label={translate('label:service_pathAddEditView.is_default')}
                      id='id_f_service_path_is_default'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:service_pathAddEditView.is_active')}
                      id='id_f_service_path_is_active'
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

export default Baseservice_pathView;
