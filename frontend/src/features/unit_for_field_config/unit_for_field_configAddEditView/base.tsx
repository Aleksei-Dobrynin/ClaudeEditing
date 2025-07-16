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

type unit_for_field_configTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseunit_for_field_configView: FC<unit_for_field_configTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="unit_for_field_configForm" id="unit_for_field_configForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="unit_for_field_config_TitleName">
                  {translate('label:unit_for_field_configAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.unit_id}
                      onChange={(event) => store.handleChange(event)}
                      name="unit_id"
                      data={store.Unit_types}
                      id="unit_id"
                      label={translate('label:unit_for_field_configAddEditView.unit_id')}
                      helperText={store.errors.unit_id}
                      error={!!store.errors.unit_id}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.field_id}
                      onChange={(event) => store.handleChange(event)}
                      name="field_id"
                      data={store.Fields}
                      id="id_f_unit_for_field_config_field_id"
                      label={translate('label:unit_for_field_configAddEditView.field_id')}
                      helperText={store.errors.field_id}
                      error={!!store.errors.field_id}
                    />
                  </Grid> */}
                  {/* <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_unit_for_field_config_created_at'
                      label={translate('label:unit_for_field_configAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_unit_for_field_config_updated_at'
                      label={translate('label:unit_for_field_configAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_unit_for_field_config_created_by"
                      id='id_f_unit_for_field_config_created_by'
                      label={translate('label:unit_for_field_configAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_unit_for_field_config_updated_by"
                      id='id_f_unit_for_field_config_updated_by'
                      label={translate('label:unit_for_field_configAddEditView.updated_by')}
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

export default Baseunit_for_field_configView;
