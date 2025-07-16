import * as React from 'react';
import { observer } from 'mobx-react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Chart from "react-apexcharts";
import store from './store';
import DateField from 'components/DateField';
import AutocompleteCustom from 'components/Autocomplete';

const ArchiveDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
          {translate("label:Dashboard.Archival_documents")}
          </h2>
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.archive_count_date_start}
            onChange={(event) => store.changeArchiveCountWeek(event)}
            name="archive_count_date_start"
            id="id_f_archive_count_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateField
            value={store.archive_count_date_end}
            onChange={(event) => store.changeArchiveCountWeek(event)}
            name="archive_count_date_end"
            id="id_f_archive_count_date_end"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>

      <Chart
        options={{
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: store.archive_Status
          }
        }}
        series={[
          {
            name: "Документов",
            data: store.archive_Counts
          }
        ]}
        type="bar"
      />
    </Paper>
  );

})


export default ArchiveDashboard