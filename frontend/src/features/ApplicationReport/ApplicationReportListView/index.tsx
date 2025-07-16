import React, { FC, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  IconButton
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PageGrid from "components/PageGrid";
import PageGridPagination from "components/PageGridPagination";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import LookUp from "components/LookUp";
import { Clear } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

type ApplicationReportListViewProps = {
  isOrg: boolean;
};


const ApplicationReportListView: FC<ApplicationReportListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.isOrg !== props.isOrg) {
      store.clearFilters();
      store.isOrg = props.isOrg
      store.doLoad();
    }
    return () => {
      store.clearStore();
    };
  }, [props.isOrg]);

  const columns: GridColDef[] = [
    {
      field: "order_number",
      headerName: translate("label:ApplicationReportListView.order_number"),
      flex: 1
    },
    {
      field: "number_data",
      headerName: translate("label:ApplicationReportListView.number_data"),
      flex: 1
    },
    {
      field: "customer_name",
      headerName: translate("label:ApplicationReportListView.customer_name"),
      flex: 1
    },
    {
      field: "arch_object_name",
      headerName: translate("label:ApplicationReportListView.arch_object_name"),
      flex: 1
    },
    {
      field: "price",
      headerName: translate("label:ApplicationReportListView.price"),
      flex: 1
    },
    {
      field: "nds",
      headerName: translate("label:ApplicationReportListView.nds"),
      flex: 1
    },
    {
      field: "nsp",
      headerName: translate("label:ApplicationReportListView.nsp"),
      flex: 1
    },
    {
      field: "sum",
      headerName: translate("label:ApplicationReportListView.sum"),
      flex: 1
    }
  ];

  return (
    <Container maxWidth="xl">
      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Grid container spacing={2}>
          <Grid item md={2} xs={2}>
            <LookUp
              skipEmpty={true}
              label={translate("label:ApplicationReportListView.month")}
              name="month_id"
              id="month_id"
              data={store.monthDict}
              onChange={(event) => {
                store.handleChange(event);
                store.loadApplicationReport();
                console.log(event.target.value)
              }}
              value={store.month_id}
            />
          </Grid>
          <Grid item md={2} xs={2}>
            <LookUp
              skipEmpty={true}
              label={translate("label:ApplicationReportListView.year")}
              name="year_id"
              id="year_id"
              data={store.yearDict}
              onChange={(event) => {
                store.handleChange(event);
                store.loadApplicationReport();
              }}
              value={store.year_id}
            />
          </Grid>
          <Grid item md={2} xs={2}>
            <LookUp
              label={translate("label:ApplicationReportListView.structure")}
              name="structure_id"
              id="structure_id"
              data={store.Structures}
              onChange={(event) => {
                store.handleChange(event);
                store.loadApplicationReport();
              }}
              value={store.structure_id}
            />
          </Grid>

          <Grid item md={2} xs={2}>
            {/* <IconButton size="large">
              <ClearIcon onClick={(event) => {
                store.clearFilters()
              }} />
            </IconButton> */}
            <IconButton size="large">
              <PrintIcon onClick={(event) => {
                store.printApplicationReport()
              }} />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>


      <PageGridPagination
        title={store.title}
        columns={columns}
        page={store.pageNumber}
        pageSize={store.pageSize}
        changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        changeSort={(sortModel) => store.changeSort(sortModel)}
        searchText=''
        totalCount={store.totalCount}
        data={store.data}
        hideActions={true}
        hideAddButton={true}
        tableName="ApplicationReport" />
    </Container>
  );
});


export default ApplicationReportListView;
