import React, { FC, useEffect } from "react";
import {
  Box,
  Container, Paper
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import JournalApplicationPopupForm from "../JournalApplicationAddEditView/popupForm";
import LookUp from "../../../components/LookUp";
import PageGridPagination from "components/PageGridPagination";
import dayjs from "dayjs";

type JournalApplicationListViewProps = {};

const JournalApplicationListView: FC<JournalApplicationListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadDocumentJournalss();
    store.loadJournalApplications();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    // {
    //   field: "journal_name",
    //   headerName: translate("label:JournalApplicationListView.journal_id"),
    //   flex: 1
    // },
    {
      field: "outgoing_number",
      headerName: translate("label:JournalApplicationListView.outgoing_number"),
      flex: 1
    },
    {
      field: "application_number",
      headerName: translate("label:JournalApplicationListView.application_id"),
      flex: 1
    },
    {
      field: "status_name",
      headerName: translate("label:JournalApplicationListView.status_name"),
      flex: 1
    },
    {
      field: "service_name",
      headerName: translate("label:JournalApplicationListView.service_name"),
      flex: 1
    },
    {
      field: "arch_object_address",
      headerName: translate("label:JournalApplicationListView.arch_object_address"),
      flex: 1
    },
    {
      field: "customer_name",
      headerName: translate("label:JournalApplicationListView.customer_name"),
      flex: 1
    },
    {
      field: "registration_date",
      headerName: translate("label:JournalApplicationListView.registration_date"),
      flex: 1,
      renderCell: (param) => (
        <span>
          {param.row.registration_date ? dayjs(param.row.registration_date).format('DD.MM.YYYY') : ""}
        </span>
      ),
    },
    {
      field: "deadline",
      headerName: translate("label:JournalApplicationListView.deadline"),
      flex: 1,
      renderCell: (param) => (
        <span>
          {param.row.deadline ? dayjs(param.row.deadline).format('DD.MM.YYYY') : ""}
        </span>
      ),
    },
    {
      field: "application_status_name",
      headerName: translate("label:JournalApplicationListView.application_status_id"),
      flex: 1
    },

  ];

  let type1: string = "form";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGridPagination
        title={translate("label:JournalApplicationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteJournalApplication(id)}
        columns={columns}
        data={store.data}
        hideAddButton
        hideActions
        tableName="JournalApplication"
        page={store.page}
        pageSize={store.pageSize}
        totalCount={store.totalCount}
        changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        changeSort={(sortModel) => store.changeSort(sortModel)}
        searchText={""}
      />;
      break;
    case "popup"
      :
      component = <PopupGrid
        title={translate("label:JournalApplicationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteJournalApplication(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="JournalApplication" />;
      break;
  }


  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <LookUp
            id="id_f_DocumentJournals_journals_id"
            label={translate("label:JournalApplicationListView.journal_id")}
            value={store.journals_id}
            data={store.Journals}
            onChange={(event) => store.handleChange(event)}
            name="journals_id"
            fieldNameDisplay={(i) => i.name}
          />
        </Box>
      </Paper>
      {component}

      <JournalApplicationPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadJournalApplications();
        }}
      />
    </Container>);
});


export default JournalApplicationListView;
