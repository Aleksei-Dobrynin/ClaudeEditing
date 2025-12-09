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
import TagPopupForm from './../TagAddEditView/popupForm';

type TagListViewProps = {};


const TagListView: FC<TagListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadTags()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:TagListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:TagListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:TagListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:TagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTag(id)}
        columns={columns}
        data={store.data}
        tableName="Tag" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTag(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Tag" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <TagPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadTags()
        }}
      />

    </Container>
  );
})




export default TagListView
