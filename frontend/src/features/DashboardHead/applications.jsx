import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import store from './store';
import DateField from 'components/DateField';
import LookUp from 'components/LookUp';
import AutocompleteCustom from 'components/Autocomplete';
import styled from 'styled-components';



const ApplcationDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
          {translate("label:Dashboard.Number_of_registered_applications")}
          </h2>
        </Grid>
        <Grid item md={6} xs={12}>
          <AutocompleteCustom
            disabled={true}
            value={store.pie_structure_id}
            onChange={(event) => store.changeApplications(event)}
            name="pie_structure_id"
            data={store.Structures}
            fieldNameDisplay={(f) => f.name}
            id="pie_structure_id"
            label={translate("label:Dashboard.Department")}
            helperText={""}
            error={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.pie_date_start}
            onChange={(event) => store.changeApplications(event)}
            name="pie_date_start"
            id="id_f_date_start"
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.pie_date_end}
            onChange={(event) => store.changeApplications(event)}
            name="pie_date_end"
            id="id_f_date_start"
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>
      {store.pie_selected_status !== "" && <div style={{marginTop: 10, marginLeft: 10}}>
        <TextLink onClick={() => store.changeApplications({ target: { value: "", name: "pie_selected_status" } })}>Все заявки</TextLink> {">"} {store.pie_selected_status}
      </div>}
      <Chart
        options={{
          chart: {
            type: 'donut',
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                if(store.pie_selected_status === ""){
                  const value = opts.w.globals.labels[opts.dataPointIndex]
                  store.onClickApplicationDashboard(value)
                }
              }
            }
          },
          labels: store.pie_selected_status === "" ? store.pieStatuses : store.pieEmployees,
          plotOptions: {
            pie: {
              customScale: 0.8,
              donut: {
                labels: {
                  show: true,
                  name: {
                    formatter: (w) => `Общее количество`
                  },
                  total: {
                    show: true,
                    showAlways: true,
                  }
                },
              }
            }
          }
        }}
        series={store.pie_selected_status === "" ? store.pieStatusCounts : store.pieEmployeeAppCounts}
        type="donut"
      />

      {/* {store.pie_selected_status === "" ? <ReactApexChart
        options={{
          chart: {
            type: 'donut',
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                const value = opts.w.globals.labels[opts.dataPointIndex]
                store.onClickApplicationDashboard(value)
              }
            }
          },
          labels: store.pieStatuses,
          plotOptions: {
            pie: {
              customScale: 0.8,
              donut: {
                labels: {
                  show: true,
                  name: {
                    formatter: (w) => `Общее количество`
                  },
                  total: {
                    show: true,
                    showAlways: true,
                  }
                },
              }
            }
          }
        }}
        series={store.pieStatusCounts}
        type="donut"
      />
        :
        <ReactApexChart
          options={{
            chart: {
              type: 'donut',
              events: {
                dataPointSelection: (event, chartContext, opts) => {
                }
              }
            },
            labels: store.pieEmployees,
            plotOptions: {
              pie: {
                customScale: 0.8,
                donut: {
                  labels: {
                    show: true,
                    name: {
                      formatter: (w) => `Общее количество`
                    },
                    total: {
                      show: false,
                      showAlways: true,
                    }
                  },
                }
              }
            }
          }}
          series={store.pieEmployeeAppCounts}
          type="donut"
        />} */}
    </Paper>
  );

})

const TextLink = styled.span`
  text-decoration: underline;
  color: #337ab7;
  cursor: pointer;
`

export default ApplcationDashboard