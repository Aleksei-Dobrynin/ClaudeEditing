import { FC, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import CustomButton from "components/Button";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Application_in_reestrPopupForm from './../application_in_reestrAddEditView/popupForm'
import styled from 'styled-components';
import OtchetTable from './otchet'
import { ReestrCode } from "constants/constant";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { MONTHS } from "constants/constant";

type application_in_reestrListViewProps = {
  idMain: number;
};


const application_in_reestrListView: FC<application_in_reestrListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  useEffect(() => {
    // store.doLoad()
    return () => store.clearStore()
  }, [])


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadapplication_in_reestrs()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'application_id',
      headerName: translate("label:application_in_reestrListView.application_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_in_reestr_column_application_id"> {param.row.application_id} </div>),
      renderHeader: (param) => (<div data-testid="table_application_in_reestr_header_application_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:application_in_reestrListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_in_reestr_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_application_in_reestr_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:application_in_reestrListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_in_reestr_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_application_in_reestr_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:application_in_reestrListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_in_reestr_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_application_in_reestr_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:application_in_reestrListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_in_reestr_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_application_in_reestr_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:application_in_reestrListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_in_reestr(id)}
        columns={columns}
        data={store.data}
        tableName="application_in_reestr" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:application_in_reestrListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_in_reestr(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="application_in_reestr" />
      break
  }



  const printTable = () => {
    const tableContent = document.getElementById("printableTableReestr1")?.outerHTML;
    if (tableContent) {
      const printWindow = window.open("", "_blank", "fullscreen=yes");
      printWindow?.document.write(`
        <html>
          <head>
              Реестр выполненых работ: [`+ store?.reestr?.year + ` ` + MONTHS.find(x => x.id == store?.reestr?.month)?.name + `] ` + store?.reestr?.name + `

            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 4px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            ${tableContent}
          </body>
        </html>
      `);
      printWindow?.print();
    }
  };

  return (
    <>
      <Box sx={{ marginBottom: "5px", width: 10 }}>
        <CustomButton startIcon={<KeyboardBackspaceIcon />} onClick={() => navigate("/user/reestr")} variant="outlined">
          Назад
        </CustomButton>
      </Box>

      <Box display="flex" m={1}>
        <CustomButton style={{ margin: 10 }} onClick={() => { printTable(); }} variant='contained'>
          Печать
        </CustomButton>
      </Box>

      <Box sx={{ m: 3 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 500 }}>
          {translate("common:Register_of_completed_works")} {store.reestr?.name}
        </Typography>
      </Box>
      <OtchetTable />

      <Box sx={{ m: 3 }}>
        <CustomButton
          name="AlertButtonYes"
          color={store.reestr?.status_code === ReestrCode.ACCEPTED ? "primary" : "secondary"}
          variant="contained"
          onClick={(e) => {
            store.changeStatusReestr();
          }}
        >
          {store.reestr?.status_code === ReestrCode.ACCEPTED ? "Отредактировать реестр" : "Сформировать реестр"}
        </CustomButton>
      </Box>

      {store.reestr?.status_code === ReestrCode.ACCEPTED &&

        <Box sx={{ m: 3 }}>
          <CustomButton
            name="AlertButtonYes"
            color={"secondary"}
            variant="contained"
            onClick={(e) => {
              store.changeAllStatuses();
            }}
          >
            Отметить все договора как реализованные
          </CustomButton>
        </Box>
      }
    </>
    // <Container maxWidth='xl' sx={{ mt: 4 }}>

    //   <OtchetTable />
    //   {component}

    //   <Application_in_reestrPopupForm
    //     openPanel={store.openPanel}
    //     id={store.currentId}
    //     onBtnCancelClick={() => store.closePanel()}
    //     onSaveClick={() => {
    //       store.closePanel()
    //       store.loadapplication_in_reestrs()
    //     }}
    //   />

    // </Container>
  );
})



export default application_in_reestrListView
