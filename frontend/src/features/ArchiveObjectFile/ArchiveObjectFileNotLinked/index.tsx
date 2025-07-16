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
import { Link } from "react-router-dom";
import PopupGrid from 'components/PopupGrid';
import ArchiveObjectFilePopupForm from './../ArchiveObjectFileAddEditView/popupForm';
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Create";
import Archive_file_tagsPopupForm from 'features/archive_file_tags/archive_file_tagsAddEditView/popupForm';
import { CheckBox } from '@mui/icons-material';
import CustomButton from 'components/Button';
import PopupFormToFolder from '../ArchiveObjectFileToFolder/popupForm';

type ArchiveObjectFileListViewProps = {
  // idArchiveObject: number;
  // idFolder: number;
};


const ArchiveObjectFileNotLinkedView: FC<ArchiveObjectFileListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadArchiveObjectFilesNotInFolder();

    // return () => {
    //   store.clearStore()

    // }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'object_number',
      headerName: translate("label:ArchiveObjectFileListView.object_number"),
      flex: 1,
      renderCell: (params) => {
        return <Link
          style={{ textDecoration: "underline", marginLeft: 5 }}
          to={`/user/ArchiveObject/addedit?id=${params.row.archive_object_id}`}>
          {params.row.object_number + " (" + params.row.object_address + ")"}
        </Link>;
      }
    },
    {
      field: 'name',
      headerName: translate("label:ArchiveObjectFileListView.name"),
      flex: 1
    },
    {
      field: 'archive_folder_id',
      headerName: translate("Выбрать"),
      flex: 1,
      renderCell: (param) => {
        return <>
          <Checkbox checked={!!param.row.checked} onChange={(e) => store.clickCheckbox(param.row.id, !param.row.checked)} />
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
    // {
    //   field: 'tags',
    //   headerName: translate("тэги"),
    //   flex: 1,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (param) => {
    //     return <>

    //       {(param.row.tags != null) && param.row.tags.map(tag => {
    //         return <Chip key={tag.id} size='small' sx={{ mr: 1, mb: 1 }} label={tag.name} />
    //       })}

    //       <Tooltip title="Редактировать тэги">
    //         <IconButton size="small" onClick={() => store.onEditTags(true, param.row.id)}>
    //           <EditIcon fontSize="small" />
    //         </IconButton>
    //       </Tooltip>
    //     </>
    //   }
    // },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ArchiveObjectFileListView.notInFolder")}
        onDeleteClicked={(id: number) => store.deleteArchiveObjectFile(id)}
        columns={columns}
        data={store.data}
        tableName="ArchiveObjectFile"
        hideAddButton={true}
      />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ArchiveObjectFileListView.notInFolder")}
        onDeleteClicked={(id: number) => store.deleteArchiveObjectFile(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        hideDeleteButton={true}
        customBottom={<>
          {store.data.find(x => x.checked) && <CustomButton sx={{ mb: 1, ml: 1 }} variant='contained' onClick={() => store.sendToFolder(true)}>
            Добавить в папку
          </CustomButton>}</>}
        hideEditButton
        hideActions
        data={store.data}
        hideAddButton={true}
        tableName="ArchiveObjectFile" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ArchiveObjectFilePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idArchiveObject={store.idArchiveObject}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadArchiveObjectFilesNotInFolder()
        }}
      />

      <Archive_file_tagsPopupForm
        openPanel={store.openPanelEditTags}
        file_id={store.currentId}
        onBtnCancelClick={() => store.onEditTags(false, 0)}
        onSaveClick={() => {
          store.onEditTags(false, 0)
          store.loadArchiveObjectFilesNotInFolder()
        }}
      />
      {/* <PopupFormToFolder
        openPanel={store.openPanelSendFolder}
        fileIds={store.data.filter(x => x.checked).map(x => x.id)}
        onBtnCancelClick={() => store.sendToFolder(false)}
        onSaveClick={() => {
          store.sendToFolder(false)
          store.clearCheckeds()
          store.loadArchiveObjectFilesNotInFolder()
        }}
      /> */}

    </Container>
  );
})




export default ArchiveObjectFileNotLinkedView
