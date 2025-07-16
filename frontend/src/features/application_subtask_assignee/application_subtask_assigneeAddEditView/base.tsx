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

type application_subtask_assigneeTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseapplication_subtask_assigneeView: FC<application_subtask_assigneeTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="application_subtask_assigneeForm" id="application_subtask_assigneeForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="application_subtask_assignee_TitleName">
                  {translate('label:application_subtask_assigneeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_employee_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_employee_id"
                      data={store.employee_in_structures}
                      id='id_f_application_subtask_assignee_structure_employee_id'
                      label={translate('label:application_subtask_assigneeAddEditView.structure_employee_id')}
                      helperText={store.errors.structure_employee_id}
                      error={!!store.errors.structure_employee_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_application_subtask_assignee_created_at'
                      label={translate('label:application_subtask_assigneeAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_application_subtask_assignee_updated_at'
                      label={translate('label:application_subtask_assigneeAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_application_subtask_assignee_created_by"
                      id='id_f_application_subtask_assignee_created_by'
                      label={translate('label:application_subtask_assigneeAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_application_subtask_assignee_updated_by"
                      id='id_f_application_subtask_assignee_updated_by'
                      label={translate('label:application_subtask_assigneeAddEditView.updated_by')}
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

export default Baseapplication_subtask_assigneeView;
