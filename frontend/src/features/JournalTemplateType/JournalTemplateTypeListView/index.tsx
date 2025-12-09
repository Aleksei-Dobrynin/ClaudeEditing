import { FC, useEffect } from "react";
import {
  Container
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import JournalTemplateTypePopupForm from "../JournalTemplateTypeAddEditView/popupForm";

type JournalTemplateTypeListViewProps = {};

const JournalTemplateTypeListView: FC<JournalTemplateTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadJournalTemplateTypes();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: translate("label:JournalTemplateTypeListView.name"),
      flex: 1
    },
    {
      field: "code",
      headerName: translate("label:JournalTemplateTypeListView.code"),
      flex: 1
    },
    {
      field: "raw_value",
      headerName: translate("label:JournalTemplateTypeListView.raw_value"),
      flex: 1
    },
    {
      field: "placeholder_name",
      headerName: translate("label:JournalTemplateTypeListView.placeholder_id"),
      flex: 1
    },
    {
      field: "example",
      headerName: translate("label:JournalTemplateTypeListView.example"),
      flex: 1
    }


  ];

  let type1: string = "form";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:JournalTemplateTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteJournalTemplateType(id)}
        columns={columns}
        data={store.data}
        tableName="JournalTemplateType" />;
      break;
    case "popup"
    :
      component = <PopupGrid
        title={translate("label:JournalTemplateTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteJournalTemplateType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="JournalTemplateType" />;
      break;
  }


  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      {component}

      <JournalTemplateTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadJournalTemplateTypes();
        }}
      />
    </Container>);
});


export default JournalTemplateTypeListView;
