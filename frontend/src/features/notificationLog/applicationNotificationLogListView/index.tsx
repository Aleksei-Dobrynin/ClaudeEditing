import React, { FC, useEffect } from "react";
import {
  Box,
  Container, Grid, IconButton, InputAdornment, Paper
} from "@mui/material";
import PageGridPagination from "components/PageGridPagination";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import dayjs from "dayjs";
import CustomTextField from "../../../components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from "../../../components/Button";
import CustomCheckbox from "../../../components/Checkbox";
import { Link } from "react-router-dom";

type notificationLogListViewProps = {};

const notificationLogListView: FC<notificationLogListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadnotifications();
    return () => {
      store.clearStore();
    };
  }, []);


  const columns: GridColDef[] = [
    {
      field: "phone",
      headerName: translate("Телефон"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_phone"> {param.row.phone} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_phone">{param.colDef.headerName}</div>)
    },
    {
      field: "application_number",
      headerName: translate("label:notificationLogListView.application_number"),
      flex: 1,
      renderCell: (param) => (
        <Link
          style={{ textDecoration: "underline", marginLeft: 5 }}
          to={`/user/Application/addedit?id=${param.row.application_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {param.value}
        </Link>
      ),
      renderHeader: (param) => (
        <div data-testid="table_notification_header_application">{param.colDef.headerName}</div>
      ),
    },
    {
      field: "text",
      headerName: translate("label:notificationLogListView.text"),
      flex: 1,
      renderCell: (param) => (<div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} data-testid="table_notification_column_text"> {param.row.message} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_text">{param.colDef.headerName}</div>)
    },
    {
      field: "date_send",
      headerName: translate("label:notificationLogListView.date_send"),
      flex: 1,
      renderCell: (param) => (
        <span>
          {param.row.date_send ? dayjs(param.row.date_send).format("DD.MM.YYYY  HH:mm") : ""}
        </span>
      ),
      renderHeader: (param) => (<div data-testid="table_notification_header_link">{param.colDef.headerName}</div>)
    },
    {
      field: "type",
      headerName: translate("label:notificationLogListView.type"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_link"> {param.row.type} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_link">{param.colDef.headerName}</div>)
    },
    {
      field: "statusName",
      headerName: translate("Статус"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_link"> {param.row.statusName} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_link">{param.colDef.headerName}</div>)
    }
  ];

  let type1: string = "form";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGridPagination
        title={translate("label:notificationLogListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification(id)}
        columns={columns}
        data={store.data}
        page={store.pageNumber}
        pageSize={store.pageSize}
        totalCount={store.totalCount}
        changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        changeSort={(sortModel) => {
        }}
        searchText={""}
        tableName="notification"
        getRowHeight={() => 'auto'}
        hideActions={true}
        hideAddButton={true}
      />;
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:notificationLogListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="notification"
        hideActions={true}
        hideAddButton={true}
        hideDeleteButton={true} />;
      break;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <CustomTextField
                value={store.search}
                onChange={(e) => store.search = e.target.value}
                name={"searchByCommonFilter"}
                label={translate("label:notificationLogListView.search")}
                onKeyDown={(e) => e.keyCode === 13}
                id={"common_filter"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="common_filter_Search_Btn"
                        onClick={() => {
                          store.search = "";
                          store.loadnotifications();
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <CustomCheckbox
                value={store.showOnlyFailed}
                onChange={(e) => {
                  store.showOnlyFailed = e.target.value;
                }}
                name="showOnlyFailed"
                label={translate("label:notificationLogListView.show_failed_sms")}
                id="show_failed_sms"
              />
            </Grid>
          </Grid>
          <Box display={"flex"} flexDirection={"column-reverse"} sx={{ ml: 2 }} alignItems={"end"}>
            <Box sx={{ minWidth: 80 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.loadnotifications();
                }}
              >
                {translate("search")}
              </CustomButton>
            </Box>
            {(store.search != '' || store.showOnlyFailed != false) && <Box sx={{ mt: 2 }}>
              <CustomButton
                id="clearSearchFilterButton"
                onClick={() => {
                  store.search = "";
                  store.showOnlyFailed = false;
                  store.loadnotifications();
                }}
              >
                {translate("clear")}
              </CustomButton>
            </Box>}
          </Box>
        </Box>

      </Paper>

      {component}

    </Container>
  );
});


export default notificationLogListView;
