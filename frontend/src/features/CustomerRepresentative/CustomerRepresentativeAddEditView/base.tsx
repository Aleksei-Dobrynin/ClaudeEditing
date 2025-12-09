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
import DateField from "../../../components/DateField";
import CustomCheckbox from "../../../components/Checkbox";
import DateTimeField from "components/DateTimeField";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isDisabled?: boolean;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>
      <Grid container>

        <form id="CustomerRepresentativeForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="CustomerRepresentative_TitleName">
                  {translate('label:CustomerRepresentativeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      disabled={props.isDisabled ? props.isDisabled : false}
                      helperText={store.errorlast_name}
                      error={store.errorlast_name != ''}
                      id='id_f_CustomerRepresentative_last_name'
                      label={translate('label:CustomerRepresentativeAddEditView.last_name')}
                      value={store.last_name}
                      onChange={(event) => store.handleChange(event)}
                      name="last_name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorfirst_name}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      error={store.errorfirst_name != ''}
                      id='id_f_CustomerRepresentative_first_name'
                      label={translate('label:CustomerRepresentativeAddEditView.first_name')}
                      value={store.first_name}
                      onChange={(event) => store.handleChange(event)}
                      name="first_name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorsecond_name}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      error={store.errorsecond_name != ''}
                      id='id_f_CustomerRepresentative_second_name'
                      label={translate('label:CustomerRepresentativeAddEditView.second_name')}
                      value={store.second_name}
                      onChange={(event) => store.handleChange(event)}
                      name="second_name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_start}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id="id_f_date_start"
                      label={translate("label:CustomerRepresentativeAddEditView.date_start")}
                      helperText={store.errordate_start}
                      error={!!store.errordate_start}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_end}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      onChange={(event) => store.handleChange(event)}
                      name="date_end"
                      id="id_f_date_end"
                      label={translate("label:CustomerRepresentativeAddEditView.date_end")}
                      helperText={store.errordate_end}
                      error={!!store.errordate_end}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorrequisites}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      error={store.errorrequisites != ''}
                      id='id_f_CustomerRepresentative_requisites'
                      label={translate('label:CustomerRepresentativeAddEditView.requisites')}
                      value={store.requisites}
                      onChange={(event) => store.handleChange(event)}
                      name="requisites"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorpin}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      error={store.errorpin != ''}
                      id='id_f_CustomerRepresentative_pin'
                      label={translate('label:CustomerRepresentativeAddEditView.pin')}
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_included_to_agreement}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      onChange={(event) => store.handleChange(event)}
                      name="is_included_to_agreement"
                      id="id_f_is_included_to_agreement"
                      label={translate("label:CustomerRepresentativeAddEditView.is_included_to_agreement")}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.notary_number}
                      disabled={props.isDisabled ? props.isDisabled : false}
                      onChange={(event) => store.handleChange(event)}
                      name="notary_number"
                      data-testid="id_f_customer_representative_notary_number"
                      id='id_f_customer_representative_notary_number'
                      label={translate('label:CustomerRepresentativeAddEditView.notary_number')}
                      helperText={store.errornotary_number}
                      error={!!store.errornotary_number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date_document}
                      disabled={props.isDisabled ? props.isDisabled : false}

                      onChange={(event) => store.handleChange(event)}
                      name="date_document"
                      id='id_f_customer_representative_date_document'
                      label={translate('label:CustomerRepresentativeAddEditView.date_document')}
                      helperText={store.errordate_document}
                      error={store.errordate_document != ''}
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
