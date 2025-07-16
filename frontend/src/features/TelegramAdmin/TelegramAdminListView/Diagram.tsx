import * as React from "react";
import { observer } from "mobx-react";
import { Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

import Chart from "react-apexcharts";
import store from "./store";
import DateField from "components/DateField";
import { TelegramChars } from "../../../constants/TelegramAdmin/TelegramChars";

type Props = {
  chars: TelegramChars[];
}


const Diagram = observer((props: Props) => {
  const { t } = useTranslation();
  const translate = t;

  const categories = props.chars?.map((item) => item.name);
  const data = props.chars?.map((item) => item.count);
  const total = data?.reduce((sum, current) => sum + current, 0);

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            Количество чатов по дням
          </h2>
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.startDate}
            onChange={(event) => store.handleChange(event)}
            name="startDate"
            id="chats_date_start"
            label={translate("label:TelegramAdminListView.startDate")}
            helperText="Select the start date"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.endDate}
            onChange={(event) => store.handleChange(event)}
            name="endDate"
            id="chats_date_end"
            label={translate("label:TelegramAdminListView.endDate")}
            helperText="Select the end date"
          />
        </Grid>
      </Grid>
      <Chart
        options={{
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: categories,
          },
          yaxis: {
            labels: {
              formatter: (val) => Math.round(val).toString(),
            },
            tickAmount: 5,
          },
          title: {
            text: `Общее количество чатов: ${total}`,
            align: 'center',
            margin: 10,
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'blue',
            },
          },
        }}
        series={[{
          name: "Количество",
          data: data,
        }]}
        type="area"
      />
    </Paper>
  );
})


export default Diagram;