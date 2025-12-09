import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Menu, MenuItem, Paper } from '@mui/material';
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
import MainStore from 'MainStore';
import RichTextEditor from 'components/richtexteditor/RichTextWithTabs';



const Reports = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  
  React.useEffect(() => {
    if (props.custom === true)
      store.getReports();
  }, [])

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} display={"flex"} justifyContent={"center"}>
          <h2>
            {translate("Печать отчетов")}
          </h2>
        </Grid>
        <Grid item md={6} xs={12}>
          <AutocompleteCustom
            value={store.reports_report_id}
            onChange={(event) => store.handleChange(event)}
            name="reports_report_id"
            data={store.Reports}
            fieldNameDisplay={(f) => f.name}
            id="reports_report_id"
            label={translate("Отчет")}
            helperText={""}
            error={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.reports_date_start}
            onChange={(event) => store.handleChange(event)}
            name="reports_date_start"
            id="reports_date_start"
            helperText=''
            label={translate("label:Dashboard.startDate")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DateField
            value={store.reports_date_end}
            onChange={(event) => store.handleChange(event)}
            name="reports_date_end"
            id="reports_date_end"
            helperText=''
            label={translate("label:Dashboard.endDate")}
          />
        </Grid>
      </Grid>
      {/* <Box sx={{ height: 120, width: '100%', mt: 2 }}>
        
      </Box> */}
      <Box display={"flex"} justifyContent={"flex-end"} sx={{ mt: 1 }}>
        <CustomButton
          customColor={"#718fb8"}
          size="small"
          variant="contained"
          sx={{ mb: "5px", mr: 1 }}
          onClick={() => {
            store.printDocument()
          }}
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
        </Menu>
      </Box>
      <Dialog open={store.report_editor_panel} fullWidth maxWidth={"lg"} onClose={() => store.onChangePanel(false)}>
        <DialogTitle>{translate('Отчет')}</DialogTitle>
        <DialogContent sx={{minHeight: 700}}>

          <RichTextEditor
            id={"RichTextEditorDocument"}
            name={"report_html"}
            value={store.report_html}
            changeValue={(value, name) => store.handleChange({ target: { value: value, name: "report_html" } })}
            minHeight={900}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_DiscountTypeSaveButton"
            onClick={() => {
              printJS({
                printable: store.report_html,
                type: "raw-html",
                targetStyles: ["*"],
              });
            }}
          >
            {translate("common:print")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_DiscountTypeCancelButton"
            onClick={() => {
              store.onChangePanel(false)
            }}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions >
      </Dialog >
    </Paper>
  );

})

const TextLink = styled.span`
  text-decoration: underline;
  color: #337ab7;
  cursor: pointer;
`

export default Reports