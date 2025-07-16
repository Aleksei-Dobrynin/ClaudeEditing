import { FC, useEffect } from 'react';
import {
  Checkbox,
  Chip,
  Container, IconButton, Tooltip
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Create";
import Archive_file_tagsPopupForm from 'features/archive_file_tags/archive_file_tagsAddEditView/popupForm';
import { CheckBox } from '@mui/icons-material';
import CustomButton from 'components/Button';
import MainStore from 'MainStore';

type ArchiveObjectFileListViewProps = {
  idArchiveObject: number;
  onChangeFiles: (ids: number[]) => void;
};


const PickFilesToDivideForm: FC<ArchiveObjectFileListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idArchiveObject !== props.idArchiveObject) {
      store.idArchiveObject = props.idArchiveObject
    }
    if (props.idArchiveObject !== 0) {
      store.loadArchiveObjectFilesByArchiveObject()
    }

    return () => {
      store.clearStore()
    }
  }, [props.idArchiveObject])

  const columns: GridColDef[] = [
    {
      field: 'archive_folder_id',
      headerName: translate("Выбрать"),
      flex: 1,
      renderCell: (param) => {
        return <>
          <Checkbox
            checked={!!param.row.checked} onChange={(e) => {
              store.clickCheckbox(param.row.id, !param.row.checked)
              props.onChangeFiles(store.data.filter(x => x.checked).map(x => x.id))
            }} />
        </>
      }
    },
    {
      field: 'name',
      headerName: translate("label:ArchiveObjectFileListView.name"),
      flex: 1
    },
    {
      field: 'archive_folder_name',
      headerName: translate("Папка"),
      flex: 1
    },
    {
      field: 'file_name',
      headerName: translate("label:ArchiveObjectFileListView.file_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
        {param.row.file_name}
        {param.row.file_id && <Tooltip title={"Скачать"}>
          <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>}
      </div>),
    },
    {
      field: 'tags',
      headerName: translate("Тэги"),
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (param) => {
        return <>
          {param.row.tags.map(tag => {
            return <Chip key={tag.id} size='small' sx={{ mr: 1, mb: 1 }} label={tag.name} />
          })}
        </>
      }
    },
  ];

  return (
    <Container maxWidth='xl' style={{ marginTop: 30, marginBottom: 30 }}>
      <PopupGrid
        title={translate("Выберите файлы для разделения")}
        onDeleteClicked={(id: number) => store.deleteArchiveObjectFile(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        hideEditButton={true}
        hideAddButton
        hideActions
        data={store.data}
        tableName="ArchiveObjectFile" />
    </Container>
  );
})




export default PickFilesToDivideForm
