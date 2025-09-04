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
import DateField from "components/DateField";

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

        <form id="ServiceForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="Service_TitleName">
                  {translate('label:ServiceAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname != ''}
                      id='id_f_Service_name'
                      label={translate('label:ServiceAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorshort_name}
                      error={store.errorshort_name != ''}
                      id='id_f_Service_short_name'
                      label={translate('label:ServiceAddEditView.short_name')}
                      value={store.short_name}
                      onChange={(event) => store.handleChange(event)}
                      name="short_name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode !== ''}
                      id='id_f_Service_code'
                      label={translate('label:ServiceAddEditView.code')}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ''}
                      id='id_f_Service_description'
                      label={translate('label:ServiceAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorday_count}
                      error={!!store.errorday_count}
                      id='id_f_Service_day_count'
                      label={translate('label:ServiceAddEditView.day_count')}
                      value={store.day_count}
                      onChange={(event) => store.handleChange(event)}
                      name="day_count"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorprice}
                      error={store.errorprice != ''}
                      id='id_f_Service_price'
                      label={translate('label:ServiceAddEditView.price')}
                      value={store.price}
                      onChange={(event) => store.handleChange(event)}
                      name="price"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.workflow_id}
                      onChange={(event) => store.handleChange(event)}
                      name="workflow_id"
                      data={store.Workflows}
                      id='id_f_Service_workflow_id'
                      label={translate('label:ServiceAddEditView.workflow_id')}
                      helperText={store.errorworkflow_id}
                      error={!!store.errorworkflow_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.law_document_id}
                      onChange={(event) => store.handleChange(event)}
                      name="law_document_id"
                      data={store.LawDocuments}
                      id='id_f_Service_law_document_id'
                      label={translate('label:ServiceAddEditView.law_document_id')}
                      helperText={store.errorlaw_document_id}
                      error={!!store.errorlaw_document_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.Structures}
                      id='id_f_Service_id_structure'
                      label={translate('label:ServiceAddEditView.structure_id')}
                      helperText={store.errorstructure_id}
                      error={!!store.errorstructure_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:ServiceAddEditView.is_active')}
                      id='id_f_ServiceAddEditView_is_active'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_start}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id="id_f_ServiceAddEditView_date_start"
                      label={translate("label:ServiceAddEditView.date_start")}
                      helperText={store.errordate_start}
                      error={!!store.errordate_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_end}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id="id_f_ServiceAddEditView_date_end"
                      label={translate("label:ServiceAddEditView.date_end")}
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
