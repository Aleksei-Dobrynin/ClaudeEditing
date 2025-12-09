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
import StructurePostPopupForm from './../StructurePostAddEditView/popupForm';

type StructurePostListViewProps = {};


const StructurePostListView: FC<StructurePostListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadStructurePosts()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:StructurePostListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:StructurePostListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:StructurePostListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:StructurePostListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStructurePost(id)}
        columns={columns}
        data={store.data}
        tableName="StructurePost" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:StructurePostListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStructurePost(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="StructurePost" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <StructurePostPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadStructurePosts()
        }}
      />

    </Container>
  );
})




export default StructurePostListView
