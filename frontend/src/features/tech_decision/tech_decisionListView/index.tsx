import { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Tech_decisionPopupForm from 'features/tech_decision/tech_decisionAddEditView/popupForm';
import styled from 'styled-components';

type tech_decisionListViewProps = {};

const tech_decisionListView: FC<tech_decisionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadtech_decisions();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:tech_decisionListView.name"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_name">
          {param.row.name}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_name">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'code',
      headerName: translate("label:tech_decisionListView.code"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_code">
          {param.row.code}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_code">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'description',
      headerName: translate("label:tech_decisionListView.description"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_description">
          {param.row.description}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_description">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'name_kg',
      headerName: translate("label:tech_decisionListView.name_kg"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_name_kg">
          {param.row.name_kg}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_name_kg">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'description_kg',
      headerName: translate("label:tech_decisionListView.description_kg"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_description_kg">
          {param.row.description_kg}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_description_kg">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'text_color',
      headerName: translate("label:tech_decisionListView.text_color"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_text_color">
          {param.row.text_color}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_text_color">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'background_color',
      headerName: translate("label:tech_decisionListView.background_color"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_background_color">
          {param.row.background_color}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_background_color">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'created_at',
      headerName: translate("label:tech_decisionListView.created_at"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_created_at">
          {param.row.created_at}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_created_at">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'updated_at',
      headerName: translate("label:tech_decisionListView.updated_at"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_updated_at">
          {param.row.updated_at}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_updated_at">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'created_by',
      headerName: translate("label:tech_decisionListView.created_by"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_created_by">
          {param.row.created_by}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_created_by">
          {param.colDef.headerName}
        </div>
      ),
    },
    {
      field: 'updated_by',
      headerName: translate("label:tech_decisionListView.updated_by"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_tech_decision_column_updated_by">
          {param.row.updated_by}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_tech_decision_header_updated_by">
          {param.colDef.headerName}
        </div>
      ),
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = (
        <PageGrid
          title={translate("label:tech_decisionListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deletetech_decision(id)}
          columns={columns}
          data={store.data}
          tableName="tech_decision"
        />
      );
      break;
    case 'popup':
      component = (
        <PopupGrid
          title={translate("label:tech_decisionListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deletetech_decision(id)}
          onEditClicked={(id: number) => store.onEditClicked(id)}
          columns={columns}
          data={store.data}
          tableName="tech_decision"
        />
      );
      break;
  }

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}
      <Tech_decisionPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadtech_decisions();
        }}
      />
    </Container>
  );
});

export default tech_decisionListView;