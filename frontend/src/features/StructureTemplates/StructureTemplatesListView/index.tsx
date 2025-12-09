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
import StructureTemplatesPopupForm from 'features/StructureTemplates/StructureTemplatesAddEditView/popupForm'

type StructureTemplatesListViewProps = {
};

const StructureTemplatesListView: FC<StructureTemplatesListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadStructureTemplatess()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:StructureTemplatesListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_StructureTemplates_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_StructureTemplates_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:StructureTemplatesListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_StructureTemplates_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_StructureTemplates_header_description">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:StructureTemplatesListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStructureTemplates(id)}
        columns={columns}
        data={store.data}
        tableName="StructureTemplates" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:StructureTemplatesListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStructureTemplates(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="StructureTemplates" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <StructureTemplatesPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadStructureTemplatess()
        }}
      />

    </Container>
  );
})



export default StructureTemplatesListView
