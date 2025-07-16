import { FC, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from './store'
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import styled from 'styled-components';
import { MONTHS } from 'constants/constant';
import CustomButton from 'components/Button';
import { Link } from "react-router-dom";
import LookUp from 'components/LookUp';
import StructureReportField from 'features/structure_report_field/structure_report_fieldListView'


type ReportViewProps = {
};


const StructureReportConfigView: FC<ReportViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.doLoad()
    return () => {
      store.clearStore()
    }
  }, [])

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      <Card component={Paper} elevation={5}>
        <CardHeader title={
          <span id="reports">
            Шаблоны отчетов
          </span>
        } />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={6}>
              <LookUp
                value={store.reportConfig_id}
                onChange={(event) => store.handleChange(event)}
                name="reportConfig_id"
                data={store.Templates}
                skipEmpty
                id='reportConfig_id'
                label={"Отчет"}
                helperText={store.errors.reportConfig_id}
                error={!!store.errors.reportConfig_id}
              />
            </Grid>
            {/* <Grid item md={3} xs={6}>
              <LookUp
                value={store.language_id}
                onChange={(event) => store.handleChange(event)}
                name="language_id"
                data={store.Languages}
                skipEmpty
                id='language_id'
                label={"Язык"}
                helperText={store.errors.language_id}
                error={!!store.errors.language_id}
              />
            </Grid> */}
            <Grid item md={4} xs={6}>
              <LookUp
                value={store.year}
                onChange={(event) => store.handleChange(event)}
                name="year"
                data={store.years}
                skipEmpty
                id='id_f_reestr_year'
                label={translate('label:reestrAddEditView.year')}
                helperText={store.errors.year}
                error={!!store.errors.year}
              />
            </Grid>
            {/* <Grid item md={2} xs={6}>
              <LookUp
                value={store.filter_type}
                onChange={(event) => store.handleChange(event)}
                name="filter_type"
                data={store.filterTypes}
                id='filter_type'
                skipEmpty
                label={"Период"}
                helperText={store.errors.filter_type}
                error={!!store.errors.filter_type}
              />
            </Grid> */}
            <Grid item md={4} xs={6}>
              <LookUp
                value={store.month}
                onChange={(event) => store.handleChange(event)}
                name="month"
                skipEmpty
                data={store.months}
                id='months'
                label={translate('label:reestrAddEditView.month')}
                helperText={store.errors.month}
                error={!!store.errors.month}
              />
            </Grid>
            {/* {store.filter_type_code === "kvartal" && <Grid item md={2} xs={6}>
              <LookUp
                value={store.kvartal}
                onChange={(event) => store.handleChange(event)}
                name="kvartal"
                skipEmpty
                data={store.kvartals}
                id='kvartal'
                label={"Квартал"}
                helperText={store.errors.kvartal}
                error={!!store.errors.kvartal}
              />
            </Grid>}
            {store.filter_type_code === "halfYear" && <Grid item md={2} xs={6}>
              <LookUp
                value={store.polgoda}
                onChange={(event) => store.handleChange(event)}
                name="polgoda"
                skipEmpty
                data={store.polGods}
                id='polgoda'
                label={"Полгодие"}
                helperText={store.errors.polgoda}
                error={!!store.errors.polgoda}
              />
            </Grid>} */}

            <Grid item md={12} xs={12} display={"flex"} justifyContent={"flex-end"}>
              <CustomButton variant='contained' onClick={() => store.createReport()}>
                Загрузить поля отчета
              </CustomButton>
            </Grid>
          </Grid>

        </CardContent>
      </Card>
      {store.id_structure_report > 0 && <StructureReportField
      idReport={store.id_structure_report}
      hideAdd={true}
      />}
    </Container>
  );
})

export default StructureReportConfigView
