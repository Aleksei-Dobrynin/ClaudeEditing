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
import TreeLookUp from "components/TreeLookup";

type org_structureTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baseorg_structureView: FC<org_structureTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="org_structureForm" id="org_structureForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="org_structure_TitleName">
                  {translate('label:org_structureAddEditView.entityTitle')}
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
                      data-testid="id_f_org_structure_name"
                      id='id_f_org_structure_name'
                      label={translate('label:org_structureAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.short_name}
                      onChange={(event) => store.handleChange(event)}
                      name="short_name"
                      data-testid="id_f_org_structure_short_name"
                      id='id_f_org_structure_short_name'
                      label={translate('label:org_structureAddEditView.short_name')}
                      helperText={store.errors.short_name}
                      error={!!store.errors.short_name}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.version}
                      onChange={(event) => store.handleChange(event)}
                      name="version"
                      type="number"
                      data-testid="id_f_org_structure_version"
                      id='id_f_org_structure_version'
                      label={translate('label:org_structureAddEditView.version')}
                      helperText={store.errors.version}
                      error={!!store.errors.version}
                    />
                  </Grid> */}

                  <Grid item md={12} xs={12}>
                    {/* <CustomTextField
                      value={store.parent_id}
                      onChange={(event) => store.handleChange(event)}
                      name="parent_id"
                      data-testid="id_f_org_structure_parent_id"
                      id='id_f_org_structure_parent_id'
                      label={translate('label:org_structureAddEditView.parent_id')}
                      helperText={store.errors.parent_id}
                      error={!!store.errors.parent_id}
                    /> */}
                    <TreeLookUp 
                      data={store.org_structures}
                      value={store.parent_id}
                      id='id_f_org_structure_parent_id'
                      label={translate('label:org_structureAddEditView.parent_id')}
                      onChange={(event) => store.handleChange(event)}
                      name="parent_id"
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:org_structureAddEditView.is_active')}
                      id='id_f_org_structure_is_active'
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date_start}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id='id_f_org_structure_date_start'
                      label={translate('label:org_structureAddEditView.date_start')}
                      helperText={store.errors.date_start}
                      error={!!store.errors.date_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date_end}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id='id_f_org_structure_date_end'
                      label={translate('label:org_structureAddEditView.date_end')}
                      helperText={store.errors.date_end}
                      error={!!store.errors.date_end}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.unique_id}
                      onChange={(event) => store.handleChange(event)}
                      name="unique_id"
                      data-testid="id_f_org_structure_unique_id"
                      id='id_f_org_structure_unique_id'
                      label={translate('label:org_structureAddEditView.unique_id')}
                      helperText={store.errors.unique_id}
                      error={!!store.errors.unique_id}
                    />
                  </Grid> */}
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.remote_id}
                      onChange={(event) => store.handleChange(event)}
                      name="remote_id"
                      data-testid="id_f_org_structure_remote_id"
                      id='id_f_org_structure_remote_id'
                      label={translate('label:org_structureAddEditView.remote_id')}
                      helperText={store.errors.remote_id}
                      error={!!store.errors.remote_id}
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

export default Baseorg_structureView;
