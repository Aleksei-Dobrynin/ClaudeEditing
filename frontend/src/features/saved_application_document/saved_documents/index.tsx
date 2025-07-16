import { FC, useEffect } from 'react';
import {
  Checkbox,
  Container,
  IconButton,
  Tooltip
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import DownloadIcon from "@mui/icons-material/Download";

type SavedApplicationDocumentListViewProps = {
  application_id: number;
};


const SavedApplicationDocumentListView: FC<SavedApplicationDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.application_id !== props.application_id) {
      store.application_id = props.application_id
    }
    store.loadSavedApplicationDocuments()
    return () => store.clearStore()
  }, [props.application_id])


  const columns: GridColDef[] = [
    {
      field: 'template_name',
      headerName: translate("label:saved_application_documentListView.template_name"),
      flex: 1
    },
    {
      field: 'language_name',
      headerName: translate("label:saved_application_documentListView.language_name"),
      flex: 1
    },
    {
      field: 'id',
      headerName: translate("label:saved_application_documentListView.download"),
      flex: 1,
      renderCell: params => {
        return (
          <Tooltip title={"Скачать"}>
          <IconButton size='small' onClick={() => store.downloadFile(params.row.body)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        )
      }
    }
  ];

  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      <PageGrid
        title={translate("label:saved_application_documentListView.entityTitle")}
        columns={columns}
        hideActions
        hideAddButton
        data={store.data}
        tableName="SavedApplicationDocument" />
    </Container>
  );
})




export default SavedApplicationDocumentListView
