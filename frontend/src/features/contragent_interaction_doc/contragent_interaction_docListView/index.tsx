import { FC, useEffect } from 'react';
import {
  Container, IconButton, Tooltip
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Contragent_interaction_docPopupForm from './../contragent_interaction_docAddEditView/popupForm'
import styled from 'styled-components';

import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "../../../components/Button";
import ContragentInteractionFastInputView from "../contragent_interaction_docAddEditView/fastInput";

type contragent_interaction_docListViewProps = {
  idMain: number;
};


const contragent_interaction_docListView: FC<contragent_interaction_docListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadcontragent_interaction_docs()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'file_id',
      headerName: translate("label:contragent_interaction_docListView.file_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationWorkDocument_column_file_name">
        sdf
        {param.row.file_id && <Tooltip title={translate("downloadFile")}>
          <IconButton size="small" onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>}
      </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_doc_header_file_id">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:contragent_interaction_docListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecontragent_interaction_doc(id)}
        columns={columns}
        data={store.data}
        tableName="contragent_interaction_doc" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:contragent_interaction_docListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecontragent_interaction_doc(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="contragent_interaction_doc" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}
      <Contragent_interaction_docPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadcontragent_interaction_docs()
        }}
      />
      {store.idMain > 0 && <ContragentInteractionFastInputView
        idMain={store.idMain}
      />}

    </Container>
  );
})



export default contragent_interaction_docListView
