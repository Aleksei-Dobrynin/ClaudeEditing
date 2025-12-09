import { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import dayjs from 'dayjs';

type FileDownloadLogListViewProps = {
};

const FileDownloadLogListView: FC<FileDownloadLogListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadFileDownloadLogs()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    {
      field: 'file_name',
      headerName: translate("label:FileDownloadLogListView.file_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_FileDownloadLog_column_file_name"> {param.row.file_name} </div>),
    },
    {
      field: 'username',
      headerName: translate("label:FileDownloadLogListView.username"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_FileDownloadLog_column_username"> {param.row.username} </div>),
    },
    {
      field: 'download_time',
      headerName: translate("label:FileDownloadLogListView.download_time"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_FileDownloadLog_column_download_time">
        {param.row.download_time ? dayjs(param.row.download_time).format("DD.MM.YYYY HH:mm") : ""}
      </div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        hideAddButton={true}
        hideActions={true}
        title={translate("label:FileDownloadLogListView.entityTitle")}
        onDeleteClicked={(id: number) => {}}
        columns={columns}
        data={store.data}
        tableName="FileDownloadLog" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:FileDownloadLogListView.entityTitle")}
        onDeleteClicked={(id: number) => {}}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="FileDownloadLog" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}
    </Container>
  );
})



export default FileDownloadLogListView
