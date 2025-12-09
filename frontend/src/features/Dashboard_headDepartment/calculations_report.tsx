import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Grid, Menu, MenuItem, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import store from './store';
import DateField from 'components/DateField';
import LookUp from 'components/LookUp';
import AutocompleteCustom from 'components/Autocomplete';
import styled from 'styled-components';
import ChartTable from 'components/dashboard/ChartTable';
import PageGrid from 'components/PageGrid';
import {
  DataGrid,
  GridColDef,
} from '@mui/x-data-grid';
import CustomButton from 'components/Button';
import printJS from 'print-js';



const CalculcationReport = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const columns = [
    {
      key: 'number', label: 'Номер',
      renderCell: (row) => {
        return <span>{row.number}</span>;
      }
    },
    { key: "customer", label: 'Заказчик' },
    { key: "address", label: 'Адрес' },
    { key: "employee", label: 'Сотрудник' },
    { key: "all_sum", label: 'Сумма' },
    { key: "wo_nalog", label: 'Без налогов' },
    { key: "discount", label: 'Есть скидка' },
  ]


  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            {translate("Калькуляции по сотрудникам")}
          </h2>
        </Grid>
        <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.calculation_structure_id}
            onChange={(event) => store.changeEmployeeCalculations(event)}
            name="calculation_structure_id"
            data={store.Structures}
            fieldNameDisplay={(f) => f.structure_name}
            id="calculation_structure_id"
            label={translate("label:Dashboard.Department")}
            helperText={""}
            error={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.calculation_date_start}
            onChange={(event) => store.changeEmployeeCalculations(event)}
            name="calculation_date_start"
            id="calculation_date_start"
            helperText=''
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.calculation_date_end}
            onChange={(event) => store.changeEmployeeCalculations(event)}
            name="calculation_date_end"
            id="calculation_date_end"
            helperText=''
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <LookUp
            value={store.calculation_order_id}
            onChange={(event) => store.changeEmployeeCalculations(event)}
            name="calculation_order_id"
            data={store.calculation_order_data}
            skipEmpty
            id="calculation_order_id"
            label={translate("Сортировать по")}
            helperText={""}
            error={false}
          />
        </Grid>
        <Grid item md={8} xs={12}>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <CustomButton
              customColor={"#718fb8"}
              size="small"
              variant="contained"
              sx={{ mb: "5px", mr: 1 }}
              onClick={handleClick}
            >
              Печать
            </CustomButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  store.printCalculation()
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#718fb8",
                    color: "#FFFFFF"
                  },
                  "&:hover .MuiListItemText-root": {
                    color: "#FFFFFF"
                  }
                }}
              >
                PDF
              </MenuItem>
              <MenuItem
            onClick={() => {
              setAnchorEl(null)
              store.getDashboardEmployeeCalculationsExcel()
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#718fb8",
                color: "#FFFFFF"
              },
              "&:hover .MuiListItemText-root": {
                color: "#FFFFFF"
              }
            }}
          >
            Excel
          </MenuItem>
            </Menu>
          </Box>
        </Grid>
      </Grid>

      <ChartTable
        columns={columns}
        initialData={store.calculation_data}
      />
    </Paper>
  );

})


export default CalculcationReport