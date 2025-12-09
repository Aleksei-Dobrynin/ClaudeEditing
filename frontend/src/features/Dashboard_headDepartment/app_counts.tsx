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



const AppCountDashboard = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const columns: GridColDef[] = [
    {
      field: 'all_count', headerName: 'Все заявки', sortable: false, filterable: false, hideable: false, resizable: false,
      flex: 1
    },
    {
      field: 'at_work_count', headerName: 'В работе', sortable: false, filterable: false, hideable: false, resizable: false,
      flex: 1
    },
    {
      field: 'done_count', headerName: 'Реализовано', sortable: false, filterable: false, hideable: false, resizable: false,
      flex: 1
    },
    {
      field: 'tech_accepted_count', headerName: 'Принято (по техсовету)', sortable: false, filterable: false, hideable: false, resizable: false,
      flex: 1
    },
    {
      field: 'tech_declined_count', headerName: 'Отказ (по техсовету)', sortable: false, filterable: false, hideable: false, resizable: false,
      flex: 1
    },
  ]

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            {translate("Заявки по отделам")}
          </h2>
        </Grid>
        <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.app_count_structure_id}
            onChange={(event) => store.changeAppCount(event)}
            name="app_count_structure_id"
            data={store.Structures}
            fieldNameDisplay={(f) => f.structure_name}
            id="app_count_structure_id"
            label={translate("label:Dashboard.Department")}
            helperText={""}
            error={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.app_count_date_start}
            onChange={(event) => store.changeAppCount(event)}
            name="app_count_date_start"
            id="app_count_date_start"
            helperText=''
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.app_count_date_end}
            onChange={(event) => store.changeAppCount(event)}
            name="app_count_date_end"
            id="app_count_date_end"
            helperText=''
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: 120, width: '100%', mt: 2 }}>
        <DataGrid
          rows={store.app_count_data}
          columns={columns}
          editMode="row"
          hideFooter
          rowSelection={false}
        />
      </Box>
      <Box display={"flex"} justifyContent={"flex-end"} sx={{ mt: 1 }}>
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
              store.printPdf()
              setAnchorEl(null)
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
              store.printExcel()
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
    </Paper>
  );

})

const TextLink = styled.span`
  text-decoration: underline;
  color: #337ab7;
  cursor: pointer;
`

export default AppCountDashboard