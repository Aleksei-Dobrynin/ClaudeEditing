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
import JournalPlaceholderPopupForm from "../JournalPlaceholderAddEditView/popupForm";

type JournalPlaceholderListViewProps = {};

const JournalPlaceholderListView: FC<JournalPlaceholderListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadJournalPlaceholders();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: "order_number",
      headerName: translate("label:JournalPlaceholderListView.order_number"),
      flex: 1
    },
    {
      field: "template_id",
      headerName: translate("label:JournalPlaceholderListView.template_id"),
      flex: 1
    },
    {
      field: "journal_id",
      headerName: translate("label:JournalPlaceholderListView.journal_id"),
      flex: 1
    }
  ];

  let type1: string = "form";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:JournalPlaceholderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteJournalPlaceholder(id)}
        columns={columns}
        data={store.data}
        tableName="JournalPlaceholder" />;
      break;
    case "popup"
    :
      component = <PopupGrid
        title={translate("label:JournalPlaceholderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteJournalPlaceholder(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="JournalPlaceholder" />;
      break;
  }


  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      {component}

      <JournalPlaceholderPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadJournalPlaceholders();
        }}
      />
    </Container>);
});


export default JournalPlaceholderListView;
