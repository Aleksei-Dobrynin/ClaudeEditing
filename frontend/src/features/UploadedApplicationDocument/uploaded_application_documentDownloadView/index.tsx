import { FC, useEffect } from 'react';
import { Box, IconButton, Tooltip, } from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import CustomButton from 'components/Button';

type uploaded_application_documentListViewProps = {
  idMain: number;
  hideAddButton?: boolean;
};


const Uploaded_application_documentListView: FC<uploaded_application_documentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loaduploaded_application_documents()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'doc_name',
      headerName: translate("label:uploaded_application_documentListView.doc_name"),
      flex: 4,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
        {param.row.file_id && <Tooltip title={translate("common:download")}>
          <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>}
        {param.row.doc_name}
      </div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:uploaded_application_documentListView.created_at"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
        </span>
      )},
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        onDeleteClicked={(id: number) => store.deleteuploaded_application_document(id)}
        columns={columns}
        data={store.incomingData}
        tableName="uploaded_application_document"
        pageSize={25} />
      break
    case 'popup':
      component = <PopupGrid
        onDeleteClicked={(id: number) => store.deleteuploaded_application_document(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        hideAddButton
        hideTitle
        customBottom={
          <Box display={"flex"} alignItems={"center"}>
            <h1 data-testid={`uploaded_application_documentHeaderTitle`}>
              {translate("label:uploaded_application_documentListView.incoming_entityTitle")}
            </h1>
            {props.hideAddButton != true && <CustomButton sx={{ ml: 2 }} onClick={() => store.onEditNewClicked(0)} variant='contained' size="small" >{translate("common:addDocument")}</CustomButton>}
          </Box>}
        hideActions
        data={store.incomingData}
        tableName="uploaded_application_document"
        pageSize={25} />
      break
  }


  return (
    <>
      {component}
    </>
  );
})



export default Uploaded_application_documentListView
