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
import Org_structure_templatesPopupForm from './../org_structure_templatesAddEditView/popupForm'
import styled from 'styled-components';


type org_structure_templatesListViewProps = {
  idMain: number;
};


const Org_structure_templatesListView: FC<org_structure_templatesListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadorg_structure_template()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'template_name',
      headerName: translate("label:org_structure_templatesListView.template_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_templates_column_template_id"> {param.row.template_name} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_templates_header_template_id">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:org_structure_templatesListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteorg_structure_templates(id)}
        columns={columns}
        data={store.data}
        tableName="org_structure_templates" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:org_structure_templatesListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteorg_structure_templates(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="org_structure_templates" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Org_structure_templatesPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        structure_id={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadorg_structure_template()
        }}
      />

    </Container>
  );
})



export default Org_structure_templatesListView
