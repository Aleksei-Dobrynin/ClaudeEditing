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
import MtmLookup from "components/mtmLookup";

type structure_report_field_configTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basestructure_report_field_configView: FC<structure_report_field_configTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="structure_report_field_configForm" id="structure_report_field_configForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="structure_report_field_config_TitleName">
                  {translate('label:structure_report_field_configAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.structure_report_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_report_id"
                      data-testid="id_f_structure_report_field_config_structure_report_id"
                      id='id_f_structure_report_field_config_structure_report_id'
                      label={translate('label:structure_report_field_configAddEditView.structure_report_id')}
                      helperText={store.errors.structure_report_id}
                      error={!!store.errors.structure_report_id}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.field_name}
                      onChange={(event) => store.handleChange(event)}
                      name="field_name"
                      data-testid="id_f_structure_report_field_config_field_name"
                      id='id_f_structure_report_field_config_field_name'
                      label={translate('label:structure_report_field_configAddEditView.field_name')}
                      helperText={store.errors.field_name}
                      error={!!store.errors.field_name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.report_item}
                      onChange={(event) => store.handleChange(event)}
                      name="report_item"
                      data-testid="id_f_structure_report_field_config_report_item"
                      id='id_f_structure_report_field_config_report_item'
                      label={translate('label:structure_report_field_configAddEditView.report_item')}
                      helperText={store.errors.report_item}
                      error={!!store.errors.report_item}
                    />
                  </Grid>
                  {props.isPopup && <Grid item md={12} xs={12}>
                    <MtmLookup
                      value={store.id_UnitTypes}
                      onChange={(name, value) => store.changeUnitTipes(value)}
                      name="tags"
                      data={store.UnitTypes}
                      label={translate("label:structure_report_field_configAddEditView.unitTypes")}
                    />
                  </Grid>}
                  {/* <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_structure_report_field_config_created_at'
                      label={translate('label:structure_report_field_configAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_structure_report_field_config_updated_at'
                      label={translate('label:structure_report_field_configAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_structure_report_field_config_created_by"
                      id='id_f_structure_report_field_config_created_by'
                      label={translate('label:structure_report_field_configAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_structure_report_field_config_updated_by"
                      id='id_f_structure_report_field_config_updated_by'
                      label={translate('label:structure_report_field_configAddEditView.updated_by')}
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

export default Basestructure_report_field_configView;
