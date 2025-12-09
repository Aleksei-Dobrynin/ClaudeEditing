import { FC, useEffect } from 'react';
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Org_structure_templatesPopupForm from './../org_structure_templatesAddEditView/popupForm'
import styled from 'styled-components';
import CustomButton from 'components/Button';


type org_structure_templatesListViewProps = {
  application_id: number;
};


const Org_structure_templatesPrintView: FC<org_structure_templatesListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    // store.loadorg_structure_template()
    return () => store.clearStore()
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:org_structure_templatesListView.template_id"),
      flex: 4,
      renderCell: (param) => (<div data-testid="table_org_structure_templates_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_templates_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'template_id',
      headerName: translate("label:org_structure_templatesListView.print"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_org_structure_templates_column_name">
        <CustomButton onClick={() => store.printDocument(param.row.template_id, param.row.language_code)} variant='contained'>
          {translate("common:print")}
        </CustomButton>
      </div>),
      renderHeader: (param) => (<div data-testid="table_org_structure_templates_header_name">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <Dialog open={store.openPanel} onClose={() => store.closePanel()} maxWidth="md" fullWidth>
      <DialogContent>
        <Container maxWidth='xl' sx={{ mt: 4 }}>
          <PageGrid
            hideActions
            hideAddButton
            title={translate("label:org_structure_templatesListView.entityTitle")}
            columns={columns}
            data={store.data}
            tableName="org_structure_templates" />
        </Container>
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_org_structure_templatesCancelButton"
          name={'org_structure_templatesAddEditView.cancel'}
          onClick={() => store.closePanel()}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions >
    </Dialog >
  );
})



export default Org_structure_templatesPrintView
