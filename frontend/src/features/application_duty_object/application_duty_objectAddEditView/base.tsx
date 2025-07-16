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

type application_duty_objectTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseapplication_duty_objectView: FC<application_duty_objectTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="application_duty_objectForm" id="application_duty_objectForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="application_duty_object_TitleName">
                  {translate('label:application_duty_objectAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.dutyplan_object_id}
                      onChange={(event) => store.handleChange(event)}
                      name="dutyplan_object_id"
                      data={store.dutyplan_objects}
                      id='id_f_application_duty_object_dutyplan_object_id'
                      label={translate('label:application_duty_objectAddEditView.dutyplan_object_id')}
                      helperText={store.errors.dutyplan_object_id}
                      error={!!store.errors.dutyplan_object_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                      data={store.architecture_processes}
                      id='id_f_application_duty_object_application_id'
                      label={translate('label:application_duty_objectAddEditView.application_id')}
                      helperText={store.errors.application_id}
                      error={!!store.errors.application_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_application_duty_object_created_at'
                      label={translate('label:application_duty_objectAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_application_duty_object_updated_at'
                      label={translate('label:application_duty_objectAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_application_duty_object_created_by"
                      id='id_f_application_duty_object_created_by'
                      label={translate('label:application_duty_objectAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_application_duty_object_updated_by"
                      id='id_f_application_duty_object_updated_by'
                      label={translate('label:application_duty_objectAddEditView.updated_by')}
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

export default Baseapplication_duty_objectView;
