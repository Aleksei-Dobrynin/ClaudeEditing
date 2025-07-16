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
import ArchiveObjectFilePopupForm from './../ArchiveObjectFileAddEditView/popupForm';
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Create";
import Archive_file_tagsPopupForm from 'features/archive_file_tags/archive_file_tagsAddEditView/popupForm';
import { CheckBox } from '@mui/icons-material';
import CustomButton from 'components/Button';
import PopupFormToFolder from '../ArchiveObjectFileToFolder/popupForm';
import MainStore from 'MainStore';

type ArchiveObjectFileListViewProps = {
  idArchiveObject: number;
  idFolder?: number;
};


const ArchiveObjectFileListView: FC<ArchiveObjectFileListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idArchiveObject !== props.idArchiveObject) {
      store.idArchiveObject = props.idArchiveObject
    }
    if (props.idArchiveObject !== 0) {
      store.loadArchiveObjectFilesByArchiveObject()
    }

    if (store.idArchiveFolder !== props.idFolder) {
      store.idArchiveFolder = props.idFolder
    }
    if (props.idFolder) {
      store.loadArchiveObjectFilesByArchiveFolder()
    }

    return () => {
      store.clearStore()
    }
  }, [props.idArchiveObject, props.idFolder])

  const columns: GridColDef[] = [
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
      field: 'archive_folder_id',
      headerName: translate("Выбрать"),
      flex: 1,
      renderCell: (param) => {
        return <>
          <Checkbox
            disabled={!(MainStore.isArchive || MainStore.isAdmin)} checked={!!param.row.checked} onChange={(e) => store.clickCheckbox(param.row.id, !param.row.checked)} />
        </>
      }
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
      headerName: translate("тэги"),
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (param) => {
        return <>
          {param.row.tags.map(tag => {
            return <Chip key={tag.id} size='small' sx={{ mr: 1, mb: 1 }} label={tag.name} />
          })}

          <Tooltip title="Редактировать тэги">
            <IconButton size="small" onClick={() => store.onEditTags(true, param.row.id)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      }
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ArchiveObjectFileListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchiveObjectFile(id)}
        columns={columns}
        data={store.data}
        tableName="ArchiveObjectFile" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ArchiveObjectFileListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchiveObjectFile(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        customBottom={<>
          {store.data.find(x => x.checked) && <CustomButton sx={{ mb: 1, ml: 1 }} variant='contained' onClick={() => store.sendToFolder(true)}>
            Добавить в папку
          </CustomButton>}</>}
        hideEditButton={true}
        data={store.data}
        tableName="ArchiveObjectFile" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30, marginBottom: 30 }}>
      {component}

      <ArchiveObjectFilePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idArchiveObject={store.idArchiveObject}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadArchiveObjectFilesByArchiveObject()
        }}
      />

      <Archive_file_tagsPopupForm
        openPanel={store.openPanelEditTags}
        file_id={store.currentId}
        onBtnCancelClick={() => store.onEditTags(false, 0)}
        onSaveClick={() => {
          store.onEditTags(false, 0)
          store.loadArchiveObjectFilesByArchiveObject()
        }}
      />

      <PopupFormToFolder
        openPanel={store.openPanelSendFolder}
        fileIds={store.data.filter(x => x.checked).map(x => x.id)}
        onBtnCancelClick={() => store.sendToFolder(false)}
        object_id={props.idArchiveObject}
        onSaveClick={() => {
          store.sendToFolder(false)
          store.clearCheckeds()
          store.loadArchiveObjectFilesByArchiveObject()
        }}
      />

    </Container>
  );
})




export default ArchiveObjectFileListView
