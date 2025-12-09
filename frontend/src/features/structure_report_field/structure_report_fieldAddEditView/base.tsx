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

type structure_report_fieldTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basestructure_report_fieldView: FC<structure_report_fieldTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="structure_report_fieldForm" id="structure_report_fieldForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="structure_report_field_TitleName">
                  {translate('label:structure_report_fieldAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.report_id}
                      onChange={(event) => store.handleChange(event)}
                      name="report_id"
                      data-testid="id_f_structure_report_field_report_id"
                      id='id_f_structure_report_field_report_id'
                      label={translate('label:structure_report_fieldAddEditView.report_id')}
                      helperText={store.errors.report_id}
                      error={!!store.errors.report_id}
                    />
                  </Grid> */}
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.field_id}
                      onChange={(event) => store.handleChange(event)}
                      name="field_id"
                      data-testid="id_f_structure_report_field_field_id"
                      id='id_f_structure_report_field_field_id'
                      label={translate('label:structure_report_fieldAddEditView.field_id')}
                      helperText={store.errors.field_id}
                      error={!!store.errors.field_id}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.unit_id}
                      onChange={(event) => store.handleChange(event)}
                      name="unit_id"
                      data={store.Unit_types}
                      disabled={true}
                      id='id_f_structure_report_field_unit_id'
                      label={translate('label:structure_report_fieldAddEditView.unit_id')}
                      helperText={store.errors.unit_id}
                      error={!!store.errors.unit_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      data-testid="id_f_structure_report_field_value"
                      id='id_f_structure_report_field_value'
                      label={translate('label:structure_report_fieldAddEditView.value')}
                      helperText={store.errors.value}
                      error={!!store.errors.value}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_structure_report_field_created_at'
                      label={translate('label:structure_report_fieldAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_structure_report_field_updated_at'
                      label={translate('label:structure_report_fieldAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_structure_report_field_created_by"
                      id='id_f_structure_report_field_created_by'
                      label={translate('label:structure_report_fieldAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_structure_report_field_updated_by"
                      id='id_f_structure_report_field_updated_by'
                      label={translate('label:structure_report_fieldAddEditView.updated_by')}
                      helperText={store.errors.updated_by}
                      error={!!store.errors.updated_by}
                    />
                  </Grid> */}
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

export default Basestructure_report_fieldView;
