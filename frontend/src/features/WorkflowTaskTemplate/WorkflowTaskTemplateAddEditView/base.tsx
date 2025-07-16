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

        <form id="WorkflowTaskTemplateForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="WorkflowTaskTemplate_TitleName">
                  {translate('label:WorkflowTaskTemplateAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname != ''}
                      id='id_f_WorkflowTaskTemplate_name'
                      label={translate('label:WorkflowTaskTemplateAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errororder}
                      error={store.errororder != ''}
                      id='id_f_WorkflowTaskTemplate_order'
                      label={translate('label:WorkflowTaskTemplateAddEditView.order')}
                      value={store.order}
                      onChange={(event) => store.handleChange(event)}
                      name="order"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:WorkflowTaskTemplateAddEditView.is_active')}
                      id='id_f_WorkflowTaskTemplate_is_active'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:WorkflowTaskTemplateAddEditView.is_required')}
                      id='id_f_WorkflowTaskTemplate_is_required'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ''}
                      id='id_f_WorkflowTaskTemplate_description'
                      label={translate('label:WorkflowTaskTemplateAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.Structures}
                      id='id_f_S_WorkflowTaskTemplate_structure_id'
                      label={translate('label:WorkflowTaskTemplateAddEditView.structure_id')}
                      helperText={store.errorstructure_id}
                      error={!!store.errorstructure_id}
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
