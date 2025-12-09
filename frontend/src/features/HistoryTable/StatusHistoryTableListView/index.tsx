import { FC, useEffect } from "react";
import { useLocation } from "react-router";

import {
  Container,
  Box
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import PopupGrid from "components/PopupGrid";
import dayjs from "dayjs";
import CustomButton from 'components/Button';
import { useNavigate } from 'react-router-dom';


// import HistoryTablePopupForm from './../HistoryTableAddEditView/popupForm';

type HistoryTableListViewProps = {
  ApplicationID: number;
};


const ApplicationStatusHistoryListView: FC<HistoryTableListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate()
  const query = useQuery();
  const id = query.get("id");
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  useEffect(() => {
    if (id) {
      const applicationId = Number(id); // Преобразуем в число
      if (store.ApplicationID !== applicationId) {
        store.ApplicationID = applicationId;
      }
      store.loadHistoryTables();
    }else{
      store.ApplicationID = props.ApplicationID
    }

    // return () => {
    //   store.clearStore();
    // };
  }, [id]);

  useEffect(() => {
    store.ApplicationID = props.ApplicationID
    store.loadHistoryTables();
  }, [props.ApplicationID]);

  const formatJson = (jsonString, table) => {
    try {
      const jsonObject = JSON.parse(jsonString);
      return (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {Object.entries(jsonObject).map(([key, value], index) => (
            <div key={index}>
              <strong>{translate(`label:${table}ListView.${key}`)}: </strong> {value ? String(value) : ""}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return <div>Error parsing JSON</div>;
    }
  };

  const columns: GridColDef[] = [
    // {
    //   field: "operation",
    //   headerName: translate("label:HistoryTableListView.operation"),
    //   flex: 1,
    //   renderCell: (params) => (
    //     <span>
    //       {translate(`label:HistoryTableListView.db_action_${params.value}`)}
    //     </span>
    //   )
    // },
    // {
    //   field: "entity_type",
    //   headerName: translate("label:HistoryTableListView.entity_type"),
    //   flex: 1,
    //   renderCell: (params) => (
    //     <span>
    //       {translate(`label:${params.value}ListView.entityTitle`)}
    //     </span>
    //   )
    // },
    {
      field: "date_change",
      headerName: translate("label:HistoryTableListView.created_at"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
    {
      field: "full_name",
      headerName: translate("label:HistoryTableListView.full_name"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {params.value ? params.value : ""}
        </div>
      )
    },
    {
      field: "old_status_navName",
      headerName: translate("label:HistoryTableListView.old_value"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {params.value ? params.value : ""}
        </div>
      )
    },
    {
      field: "status_navName",
      headerName: translate("label:HistoryTableListView.new_value"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {params.value ? params.value : ""}
        </div>
      )
    },
  ];

  let type1: string = "popup";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:HistoryTableListView.entityTitle")}
        columns={columns}
        data={store.data}
        hideAddButton={true}
        customBottom={<CustomButton
          variant='contained'
          sx={{ m: 1 }}
          id={`returnButton`}
          onClick={() => navigate(`/user/Application/addedit?id=${id}`)}
        >
          {translate('back')}
        </CustomButton>
        }
        hideActions={true}
        getRowHeight={() => 'auto'}
        tableName="HistoryTable" />;
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:HistoryTableListView.entityTitle")}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="HistoryTable"
        hideAddButton={true}
        hideActions={true}
        onDeleteClicked={() => {
        }} />;
      break;
  }


  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      {component}

      {/*<HistoryTablePopupForm*/}
      {/*  openPanel={store.openPanel}*/}
      {/*  id={store.currentId}*/}
      {/*  onBtnCancelClick={() => store.closePanel()}*/}
      {/*  onSaveClick={() => {*/}
      {/*    store.closePanel()*/}
      {/*    store.loadHistoryTables()*/}
      {/*  }}*/}
      {/*/>*/}

    </Container>
  );
});


export default ApplicationStatusHistoryListView;
