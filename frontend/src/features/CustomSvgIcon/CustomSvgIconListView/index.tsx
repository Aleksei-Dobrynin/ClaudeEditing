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
import CustomSvgIconPopupForm from './../CustomSvgIconAddEditView/popupForm'
import styled from 'styled-components';


type CustomSvgIconListViewProps = {
};


const CustomSvgIconListView: FC<CustomSvgIconListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadCustomSvgIcons()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:CustomSvgIconListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomSvgIcon_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomSvgIcon_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'svgPath',
      headerName: translate("label:CustomSvgIconListView.svgPath"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomSvgIcon_column_svgPath"> {param.row.svgPath} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomSvgIcon_header_svgPath">{param.colDef.headerName}</div>)
    },
    {
      field: 'usedTables',
      headerName: translate("label:CustomSvgIconListView.usedTables"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomSvgIcon_column_usedTables"> {param.row.usedTables} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomSvgIcon_header_usedTables">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:CustomSvgIconListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomSvgIcon(id)}
        columns={columns}
        data={store.data}
        tableName="CustomSvgIcon" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:CustomSvgIconListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomSvgIcon(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="CustomSvgIcon" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <CustomSvgIconPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadCustomSvgIcons()
        }}
      />

    </Container>
  );
})



export default CustomSvgIconListView
