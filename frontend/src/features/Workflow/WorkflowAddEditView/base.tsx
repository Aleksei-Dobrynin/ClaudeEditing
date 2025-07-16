import React, { FC, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "../../../components/Checkbox";
import DateField from "../../../components/DateField";

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

        <form id="WorkflowForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="Workflow_TitleName">
                  {translate('label:WorkflowAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname != ''}
                      id='id_f_Workflow_name'
                      label={translate('label:WorkflowAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:WorkflowAddEditView.is_active')}
                      id='id_f_Workflow_is_active'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_start}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id='id_f_workflow_date_start'
                      label={translate('label:WorkflowAddEditView.date_start')}
                      helperText={store.errordate_start}
                      error={!!store.errordate_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_end}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id='id_f_workflow_date_end'
                      label={translate('label:WorkflowAddEditView.date_end')}
                      helperText={store.errordate_end}
                      error={!!store.errordate_end}
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
})


export default BaseView;
