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
          <form data-testid="SmProjectForm" id="SmProjectForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="SmProject_TitleName">
                  {translate('label:SmProjectAddEditView.entityTitle')}
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
                      data-testid="id_f_SmProject_name"
                      id='id_f_SmProject_name'
                      label={translate('label:SmProjectAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.projecttype_id}
                      onChange={(event) => store.handleChange(event)}
                      name="projecttype_id"
                      data={store.SmProjectTypes}
                      id='id_f_SmProject_projecttype_id'
                      label={translate('label:SmProjectAddEditView.projecttype_id')}
                      helperText={store.errors.projecttype_id}
                      error={!!store.errors.projecttype_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.test}
                      onChange={(event) => store.handleChange(event)}
                      name={"test"}
                      label={translate('label:SmProjectAddEditView.test')}
                      id='id_f_SmProject_test'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.status_id}
                      onChange={(event) => store.handleChange(event)}
                      name="status_id"
                      data={store.SmProjectStatuses}
                      id='id_f_SmProject_status_id'
                      label={translate('label:SmProjectAddEditView.status_id')}
                      helperText={store.errors.status_id}
                      error={!!store.errors.status_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.min_responses.toString()}
                      onChange={(event) => store.handleChange(event)}
                      name="min_responses"
                      type="number"
                      id='id_f_SmProject_min_responses'
                      label={translate('label:SmProjectAddEditView.min_responses')}
                      helperText={store.errors.min_responses}
                      error={!!store.errors.min_responses}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date_end}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id='id_f_SmProject_date_end'
                      label={translate('label:SmProjectAddEditView.date_end')}
                      helperText={store.errors.date_end}
                      error={!!store.errors.date_end}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.access_link}
                      onChange={(event) => store.handleChange(event)}
                      name="access_link"
                      id='id_f_SmProject_access_link'
                      label={translate('label:SmProjectAddEditView.access_link')}
                      helperText={store.errors.access_link}
                      error={!!store.errors.access_link}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.entity_id}
                      onChange={(event) => store.handleChange(event)}
                      name="entity_id"
                      data={store.Entities}
                      id='id_f_SmProject_entity_id'
                      label={translate('label:SmProjectAddEditView.entity_id')}
                      helperText={store.errors.entity_id}
                      error={!!store.errors.entity_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.frequency_id}
                      onChange={(event) => store.handleChange(event)}
                      name="frequency_id"
                      data={store.SmProjectFrequencies}
                      id='id_f_SmProject_frequency_id'
                      label={translate('label:SmProjectAddEditView.frequency_id')}
                      helperText={store.errors.frequency_id}
                      error={!!store.errors.frequency_id}
                      fieldNameDisplay={(e) => e.cron}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_triggers_required}
                      onChange={(event) => store.handleChange(event)}
                      name={"is_triggers_required"}
                      label={translate('label:SmProjectAddEditView.is_triggers_required')}
                      id='id_f_SmProject_is_triggers_required'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.date_attribute_milestone_id}
                      onChange={(event) => store.handleChange(event)}
                      name="date_attribute_milestone_id"
                      data={store.EntityAttributes}
                      id='id_f_SmProject_date_attribute_milestone_id'
                      label={translate('label:SmProjectAddEditView.date_attribute_milestone_id')}
                      helperText={store.errors.date_attribute_milestone_id}
                      error={!!store.errors.date_attribute_milestone_id}
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
