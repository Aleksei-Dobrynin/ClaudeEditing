import React, { FC, useEffect, useState } from "react";
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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { SelectOrgStructureForWorklofw } from "../../../constants/constant";
import dayjs from "dayjs";
import MainStore from "../../../MainStore";
import LayoutStore from "../../../layouts/MainLayout/store";

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
                    <Autocomplete
                      value={store.Service.find(arch => arch.id === store.service_id) || null}
                      onChange={(event, newValue) => {
                        let value = newValue ? newValue.id : "";
                        store.handleChange({
                          target: { name: "service_id", value: value }
                        });
                      }}
                      options={store.Service}
                      id='id_f_ServicePrice_service_id'
                      getOptionLabel={(Service) => `${Service.name}` || ""}
                      // getOptionDisabled={(option) => {
                      //   const today = dayjs();
                      //   const isWithinDateRange = (!option.date_start || dayjs(option.date_start).isSame(today, 'day') || dayjs(option.date_start).isBefore(today, 'day')) &&
                      //     (!option.date_end || dayjs(option.date_end).isSame(today, 'day') || dayjs(option.date_end).isAfter(today, 'day'));
                      //
                      //   return !option.is_active || !isWithinDateRange;
                      // }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('label:ServicePriceAddEditView.service_id')}
                          helperText={store.errorservice_id}
                          error={store.errorservice_id != ""}
                          size={"small"}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      disabled={MainStore.isHeadStructure}
                      data={store.Structure}
                      id='id_f_ServicePrice_structure_id'
                      label={translate('label:ServicePriceAddEditView.structure_id')}
                      helperText={store.errorstructure_id}
                      error={!!store.errorstructure_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      value={store.Templates.find(arch => arch.id === store.document_template_id) || null}
                      onChange={(event, newValue) => {
                        let value = newValue ? newValue.id : "";
                        store.handleChange({
                          target: { name: "document_template_id", value: value }
                        });
                      }}
                      options={store.Templates}
                      id='id_f_ServicePrice_document_template_id'
                      getOptionLabel={(template) => `${template.name}` || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('label:ServicePriceAddEditView.document_template_id')}
                          helperText={store.errordocument_template_id}
                          error={store.errordocument_template_id != ""}
                          size={"small"}
                        />
                      )}
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
