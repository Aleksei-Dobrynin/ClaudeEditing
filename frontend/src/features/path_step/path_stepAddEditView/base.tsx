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

type path_stepTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basepath_stepView: FC<path_stepTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="path_stepForm" id="path_stepForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="path_step_TitleName">
                  {translate('label:path_stepAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.step_type}
                      onChange={(event) => store.handleChange(event)}
                      name="step_type"
                      data-testid="id_f_path_step_step_type"
                      id='id_f_path_step_step_type'
                      label={translate('label:path_stepAddEditView.step_type')}
                      helperText={store.errors.step_type}
                      error={!!store.errors.step_type}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.responsible_org_id}
                      onChange={(event) => store.handleChange(event)}
                      name="responsible_org_id"  
                      fieldNameDisplay={(f) => f.name}
                      data={store.Structures}
                      data-testid="id_f_path_step_responsible_org_id"
                      id='id_f_path_step_responsible_org_id'
                      label={translate('label:path_stepAddEditView.responsible_org_id')}
                      helperText={store.errors.responsible_org_id}
                      error={!!store.errors.responsible_org_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_path_step_name"
                      id='id_f_path_step_name'
                      label={translate('label:path_stepAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_path_step_description"
                      id='id_f_path_step_description'
                      label={translate('label:path_stepAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.order_number}
                      onChange={(event) => store.handleChange(event)}
                      name="order_number"
                      data-testid="id_f_path_step_order_number"
                      id='id_f_path_step_order_number'
                      label={translate('label:path_stepAddEditView.order_number')}
                      helperText={store.errors.order_number}
                      error={!!store.errors.order_number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:path_stepAddEditView.is_required')}
                      id='id_f_path_step_is_required'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.estimated_days}
                      onChange={(event) => store.handleChange(event)}
                      name="estimated_days"
                      data-testid="id_f_path_step_estimated_days"
                      id='id_f_path_step_estimated_days'
                      label={translate('label:path_stepAddEditView.estimated_days')}
                      helperText={store.errors.estimated_days}
                      error={!!store.errors.estimated_days}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.wait_for_previous_steps}
                      onChange={(event) => store.handleChange(event)}
                      name="wait_for_previous_steps"
                      label={translate('label:path_stepAddEditView.wait_for_previous_steps')}
                      id='id_f_path_step_wait_for_previous_steps'
                    />
                  </Grid>
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

export default Basepath_stepView;
