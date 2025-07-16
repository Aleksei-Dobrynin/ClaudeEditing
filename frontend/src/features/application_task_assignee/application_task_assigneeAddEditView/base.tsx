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

type application_task_assigneeTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baseapplication_task_assigneeView: FC<application_task_assigneeTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="application_task_assigneeForm" id="application_task_assigneeForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="application_task_assignee_TitleName">
                  {translate('label:application_task_assigneeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.structure_employee_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_employee_id"
                      data-testid="id_f_application_task_assignee_structure_employee_id"
                      id='id_f_application_task_assignee_structure_employee_id'
                      label={translate('label:application_task_assigneeAddEditView.structure_employee_id')}
                      helperText={store.errors.structure_employee_id}
                      error={!!store.errors.structure_employee_id}
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

export default Baseapplication_task_assigneeView;
