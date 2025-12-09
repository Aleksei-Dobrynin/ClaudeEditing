import * as React from "react";
import { observer } from "mobx-react";
import { Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

import store from "./store";
import ReactApexChart from "react-apexcharts";
import { TelegramChars } from "../../../constants/TelegramAdmin/TelegramChars";
import { toJS } from "mobx";
import DateField from "components/DateField";

type Props = {
  questionsCount?: TelegramChars[];
}

const DiagramQuestions = observer((props: Props) => {
  const { t } = useTranslation();
  const translate = t;
  
  // Get data and sort by count in descending order
  const diagramData = props?.questionsCount
    ?.map(item => ({
      name: item?.name || "Без имени",
      count: Number(item?.count ?? 0),
    }))
    .sort((a, b) => b.count - a.count);

  console.log(toJS((diagramData)))
  const questionNames = diagramData?.map(item => item.name)
  const questionCounts = diagramData?.map(item => item.count)

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            Статистика по вопросам
          </h2>
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.startDateQuestionsDiagram}
            onChange={(event) => store.handleChange(event)}
            name="startDateQuestionsDiagram"
            id="startDateQuestionsDiagram"
            label={translate("label:TelegramAdminListView.startDate")}
            helperText="Select the start date"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.endDateQuestionsDiagram}
            onChange={(event) => store.handleChange(event)}
            name="endDateQuestionsDiagram"
            id="cendDateQuestionsDiagram"
            label={translate("label:TelegramAdminListView.endDate")}
            helperText="Select the end date"
          />
        </Grid>
      </Grid>
      <ReactApexChart
        options={{
          chart: {
            type: 'bar',
            height: 350,
            toolbar: {
              show: true
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: 'top',
              },
              barHeight: '70%', // Reduces the height of each bar, increasing space between them
              distributed: false,
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toString();
            },
            offsetX: 20,
            style: {
              fontSize: '12px',
              colors: ['#304758']
            }
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
          },
          xaxis: {
            categories: questionNames,
            labels: {
              formatter: function(value) {
                // Truncate long labels for x-axis
                return value.length > 20 ? value.substring(0, 20) + '...' : value;
              },
              style: {
                fontSize: '13px', // Increased font size for axis labels
              }
            },
            title: {
              text: 'Количество запросов',
              style: {
                fontSize: '14px', // Increased font size for axis title
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '13px', // Increased font size for y-axis labels
              }
            },
            title: {
              text: 'Вопросы',
              style: {
                fontSize: '14px', // Increased font size for y-axis title
              }
            }
          },
          legend: {
            position: 'right',
            offsetY: 40,
            height: 230,
            fontSize: '14px', // Increased font size for legend text
            itemMargin: {
              vertical: 8 // Increased vertical spacing between legend items
            },
            formatter: function(seriesName, opts) {
              // For legend items
              return seriesName.length > 25 ? seriesName.substring(0, 25) + '...' : seriesName;
            }
          },

        }}
        series={[{
          name: 'Количество',
          data: questionCounts
        }]}
        type="bar"
        height={550}
      />
    </Paper>
  );
})

export default DiagramQuestions