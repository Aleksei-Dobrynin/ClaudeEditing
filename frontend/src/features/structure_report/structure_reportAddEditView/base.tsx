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

type structure_reportTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basestructure_reportView: FC<structure_reportTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="structure_reportForm" id="structure_reportForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="structure_report_TitleName">
                  {translate('label:structure_reportAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.quarter}
                      onChange={(event) => store.handleChange(event)}
                      name="quarter"
                      data-testid="id_f_structure_report_quarter"
                      id='id_f_structure_report_quarter'
                      label={translate('label:structure_reportAddEditView.quarter')}
                      helperText={store.errors.quarter}
                      error={!!store.errors.quarter}
                      disabled={true}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data-testid="id_f_structure_report_structure_id"
                      id='id_f_structure_report_structure_id'
                      label={translate('label:structure_reportAddEditView.structure_id')}
                      helperText={store.errors.structure_id}
                      error={!!store.errors.structure_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.status_id}
                      onChange={(event) => store.handleChange(event)}
                      name="status_id"
                      data-testid="id_f_structure_report_status_id"
                      id='id_f_structure_report_status_id'
                      label={translate('label:structure_reportAddEditView.status_id')}
                      helperText={store.errors.status_id}
                      error={!!store.errors.status_id}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.report_config_id}
                      onChange={(event) => {
                        store.handleChange(event)
                        // store.Setreport_config_id(event.target.value - 0)
                      }}
                      name="report_config_id"
                      data={store.Report_configs}

                      id='id_f_structure_report_config_id'
                      label={translate('label:structure_reportAddEditView.report_config_id')}
                      disabled={true}

                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => {
                        store.handleChange(event)
                        // store.setStructureID(event.target.value - 0)
                      }}
                      name="structure_id"
                      data={store.org_structures}

                      id='id_f_application_task_structure_id'
                      label={translate('label:application_taskAddEditView.structure_id')}
                      disabled={true}

                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_structure_report_created_at'
                      label={translate('label:structure_reportAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_structure_report_updated_at'
                      label={translate('label:structure_reportAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_structure_report_created_by"
                      id='id_f_structure_report_created_by'
                      label={translate('label:structure_reportAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_structure_report_updated_by"
                      id='id_f_structure_report_updated_by'
                      label={translate('label:structure_reportAddEditView.updated_by')}
                      helperText={store.errors.updated_by}
                      error={!!store.errors.updated_by}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.month}
                      onChange={(event) => store.handleChange(event)}
                      name="month"
                      data-testid="id_f_structure_report_month"
                      id='id_f_structure_report_month'
                      label={translate('label:structure_reportAddEditView.month')}
                      helperText={store.errors.month}
                      error={!!store.errors.month}
                      disabled={true}

                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.year}
                      onChange={(event) => store.handleChange(event)}
                      name="year"
                      data-testid="id_f_structure_report_year"
                      id='id_f_structure_report_year'
                      label={translate('label:structure_reportAddEditView.year')}
                      helperText={store.errors.year}
                      error={!!store.errors.year}
                      disabled={true}

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

export default Basestructure_reportView;
