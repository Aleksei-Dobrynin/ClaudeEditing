import { FC, useEffect } from 'react';
import {
  Container,
  Checkbox,
  Box
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import AddIcon from '@mui/icons-material/Add';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Employee_contactPopupForm from './../employee_contactAddEditView/popupForm'
import styled from 'styled-components';
import CustomButton from 'components/Button';


type employee_contactListViewProps = {
  idMain: number;
  isMyContacts?: boolean;
  myGuid?: string;
};


const Employee_contactListView: FC<employee_contactListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loademployee_contacts()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'value',
      headerName: translate("label:employee_contactListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_employee_contact_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_employee_contact_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'type_name',
      headerName: translate("label:employee_contactListView.type_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_employee_contact_column_employee_id"> {param.row.type_name} </div>),
      renderHeader: (param) => (<div data-testid="table_employee_contact_header_employee_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'allow_notification',
      headerName: translate("label:employee_contactListView.allow_notification"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_employee_contact_column_allow_notification"> {<Checkbox checked={param.row.allow_notification} disabled />} </div>),
      renderHeader: (param) => (<div data-testid="table_employee_contact_header_allow_notification">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:employee_contactListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteemployee_contact(id)}
        columns={columns}
        data={store.data}
        tableName="employee_contact" />
      break
    case 'popup':
      component = (
        <PopupGrid
          title={translate("label:employee_contactListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deleteemployee_contact(id)}
          onEditClicked={(id: number) => store.onEditClicked(id)}
          columns={columns}
          hideAddButton
          customBottom={
            <Box>
              <CustomButton
                variant='contained'
                sx={{ mb: 1 }}
                id={`employee_contactAddButton`}
                onClick={() => store.onEditClicked(0)}
                endIcon={<AddIcon />}
              >
                {translate('add')}
              </CustomButton>
              {props.isMyContacts && props.myGuid && (
                <CustomButton
                  variant='contained'
                  sx={{ mb: 1, ml: 1 }}
                  id={`employee_contactAddButton`}
                  onClick={() => window.open(`https://t.me/bga_employee_notification_bot?start=guid_${props.myGuid}`, '_blank').focus()}
                >
                  {translate("common:Attach_telegram")}
                </CustomButton>
              )}
            </Box>
          }
          data={store.data}
          tableName="employee_contact"
          canEdit={(row) => row.type_name !== "Telegram"}
          canDelete={(row) => row.type_name !== "Telegram"}
        />
      );
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Employee_contactPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loademployee_contacts()
        }}
      />

    </Container>
  );
})



export default Employee_contactListView
