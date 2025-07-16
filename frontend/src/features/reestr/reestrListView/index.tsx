import { FC, useEffect } from 'react';
import {
  Container,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import ReestrPopupForm from './../reestrAddEditView/popupForm'
import styled from 'styled-components';
import { MONTHS } from 'constants/constant';
import CustomButton from 'components/Button';
import { Link } from "react-router-dom";


type reestrListViewProps = {
  fromApplicatoin?: boolean;
  onClickReestr?: (id: number, name: string) => void;
  application_id?: number;
};


const ReestrListView: FC<reestrListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadreestrs()
    return () => {
      store.clearStore()
    }
  }, [])

  // Обработчик изменения чекбокса
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.setShowMyOnly(event.target.checked);
  };

  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:reestrListView.name"),
      flex: 2,
      renderCell: (params) => {
        return <Link
          style={{ textDecoration: "underline", marginLeft: 5 }}
          to={`/user/reestr/addedit?id=${params.row.id}`}>
          {params.value}
        </Link>
      },
      renderHeader: (param) => (<div data-testid="table_reestr_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'year',
      headerName: translate("label:reestrListView.datetime"),
      flex: 1,
      renderHeader: (param) => (<div data-testid="table_reestr_header_month">{param.colDef.headerName}</div>),
      renderCell: (param) => {
        let month = MONTHS.find(x => x.id === param.row.month)
        return <div data-testid="table_reestr_column_month">
          {param.row.year} {month?.name}
        </div>
      },
    },
    {
      field: 'status_name',
      headerName: translate("label:reestrListView.status_id"),
      flex: 1,
      renderCell: (param) => {

        return <div style={{ color: param.row.status_code === "accepted" ? "green" : null }} data-testid="table_reestr_column_status_id"> {param.row.status_name} </div>
      },
      renderHeader: (param) => (<div data-testid="table_reestr_header_status_id">{param.colDef.headerName}</div>)
    },
  ];

  if (props.fromApplicatoin) {
    columns.unshift(
      {
        field: 'id',
        headerName: translate("label:reestrListView.Choose"),
        flex: 1,
        renderCell: (param) => (<div data-testid="table_reestr_column_status_id">
          <CustomButton disabled={param.row.status_code === "accepted"} onClick={() => {
            if (props.application_id) {
              store.setApplicationToReestr(props.application_id, param.row.id, () => {
                props.onClickReestr?.(param.row.id, param.row.name);
              });
            } else {
              props.onClickReestr?.(param.row.id, param.row.name);
            }
          }}>
            {translate("common:Choose")}
          </CustomButton>
        </div>),
        renderHeader: (param) => (<div data-testid="table_reestr_header_status_id">{param.colDef.headerName}</div>)
      })
  } else {
    columns.unshift({
      field: 'id',
      headerName: "id",
      flex: 1,
      renderHeader: (param) => (<div data-testid="table_reestr_header_id">{param.colDef.headerName}</div>),
      renderCell: (param) => {
        return <div data-testid="table_reestr_column_id">
          {param.row.id}
        </div>
      },
    });
  }

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:reestrListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletereestr(id)}
        columns={columns}
        data={store.data}
        tableName="reestr" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:reestrListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletereestr(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        pageSize={100}
        tableName="reestr" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {/* Фильтр чекбокс */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={store.showMyOnly}
              onChange={handleFilterChange}
              color="primary"
            />
          }
          label={"Показать только мои реестры"}
        />
      </Box>

      {component}

      <ReestrPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadreestrs()
        }}
      />

    </Container>
  );
})



export default ReestrListView