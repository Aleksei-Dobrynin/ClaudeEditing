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

        <form id="ServicePriceForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ServicePrice_TitleName">
                  {translate('label:ServicePriceAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.service_id}
                      onChange={(event) => store.handleChange(event)}
                      name="service_id"
                      data={store.Service}
                      id='id_f_ServicePrice_service_id'
                      label={translate('label:ServicePriceAddEditView.service_id')}
                      helperText={store.errorservice_id}
                      error={!!store.errorservice_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.Structure}
                      id='id_f_ServicePrice_structure_id'
                      label={translate('label:ServicePriceAddEditView.structure_id')}
                      helperText={store.errorstructure_id}
                      error={!!store.errorstructure_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorprice}
                      error={store.errorprice != ''}
                      id='id_f_ServicePrice_price'
                      label={translate('label:ServicePriceAddEditView.price')}
                      value={store.price}
                      onChange={(event) => store.handleChange(event)}
                      name="price"
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
