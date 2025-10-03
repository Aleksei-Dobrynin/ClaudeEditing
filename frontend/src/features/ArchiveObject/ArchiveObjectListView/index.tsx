import React, { FC, useEffect, useRef, useState } from "react";
import {
  Box,
  Container, Grid, IconButton, InputAdornment, Paper, Typography, Chip, Tooltip
} from "@mui/material";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef, GridRenderCellParams, GridActionsCellItem } from "@mui/x-data-grid";
import PageGridPagination from "components/PageGridPagination";
import PageGrid from 'components/PageGrid';
import ArchMap from "./map";
import FilterArch from "./searchField";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MainStore from "../../../MainStore";
import CustomButton from "components/Button";
import SelectedObjectsPanel from "./SelectedObjects";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Merge as MergeIcon
} from "@mui/icons-material";
import CombineObjectsPopup from "./CombineProjectsPopup";
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from "dayjs";
import NavigationIcon from '@mui/icons-material/Navigation';

type ArchiveObjectListViewProps = {};

const ArchiveObjectListView: FC<ArchiveObjectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const translate = t;

  useEffect(() => {
    store.doload();
    return () => {
      store.clearStore();
    };
  }, []);

  const baseColumns: GridColDef[] = [
    {
      field: "doc_number",
      headerName: translate("label:ArchiveObjectListView.doc_number"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "map",
      headerName: "На карте",
      width: 140,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <CustomButton
          variant="outlined"
          size="small"
          startIcon={<NavigationIcon />}
          onClick={() => store.showOnMap(params.row.id)}
        >
          На карте
        </CustomButton>
      )
    },
    {
      field: "address",
      headerName: translate("label:ArchiveObjectListView.address"),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "description",
      headerName: translate("label:ArchiveObjectListView.description"),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "customer_name",
      headerName: translate("label:ArchiveObjectListView.customer_name"),
      flex: 1,
      minWidth: 200,
    },
    {
      field: "customer_pin",
      headerName: translate("label:ArchiveObjectListView.customer_pin"),
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'created_at',
      headerName: translate("label:ArchiveObjectListView.created_at"),
      flex: 2,
      minWidth: 180,
      renderCell: (param) => (<div>
        {param.row.created_at ? dayjs(param.row.created_at).format("DD.MM.YYYY HH:mm") : ""}
      </div>),
    },
    {
      field: 'updated_at',
      headerName: translate("label:ArchiveObjectListView.updated_at"),
      flex: 2,
      minWidth: 180,
      renderCell: (param) => (<div>
        {param.row.updated_at ? dayjs(param.row.updated_at).format("DD.MM.YYYY HH:mm") : ""}
      </div>),
    },
  ];

  // Колонка для выбора объектов в режиме объединения
  const selectColumn: GridColDef = {
    field: "select",
    headerName: "Выбрать",
    width: 120,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams) => {
      const isSelected = store.isObjectSelected(params.row.id);

      return (
        <CustomButton
          variant={isSelected ? "contained" : "outlined"}
          color={isSelected ? "success" : "primary"}
          size="small"
          onClick={() => store.selectObjectForCombine(params.row)}
          startIcon={
            isSelected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />
          }
        >
          {isSelected ? "Выбран" : "Выбрать"}
        </CustomButton>
      );
    }
  };

  // Формируем колонки в зависимости от режима
  const columns = store.combineObjectsMode
    ? [selectColumn, ...baseColumns]
    : baseColumns;

  // Функция для создания кнопки просмотра
  const createViewButton = (id: number): React.ReactNode => {
    if (MainStore.isDutyPlan !== true) {
      return (
        <GridActionsCellItem
          icon={
            <Tooltip title={translate('Просмотр')}>
              <VisibilityIcon />
            </Tooltip>
          }
          label={translate('Просмотр')}
          onClick={() => {
            navigate(`/user/ArchiveObject/view?id=${id}`)
          }}
          color="inherit"
        />
      );
    }
    return <></>;
  };

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      {MainStore.BackUrl.length > 0 && (
        <StyledRouterLink
          to={MainStore.BackUrl}
          style={{ display: "flex", alignItems: "center" }}
        >
          <KeyboardBackspaceIcon />
          <Typography sx={{ fontSize: '16px', minWidth: '120px' }}>Назад</Typography>
        </StyledRouterLink>
      )}

      <FilterArch />

      {/* Панель выбранных объектов */}
      <SelectedObjectsPanel />

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <PageGrid
            title={translate("label:ArchiveObjectListView.entityTitle")}
            onDeleteClicked={(id: number) => store.combineObjectsMode ? null : store.deleteArchiveObject(id)}
            columns={columns}
            // hideActions={!MainStore.isDutyPlan || store.combineObjectsMode}
            hideAddButton={!MainStore.isDutyPlan || store.combineObjectsMode}
            hideEditButton={!MainStore.isDutyPlan || store.combineObjectsMode}
            hideDeleteButton={!MainStore.isDutyPlan || store.combineObjectsMode}
            hustomHeader={
              <>
                {!store.combineObjectsMode ? (
                  <CustomButton
                    variant="contained"
                    color="primary"
                    onClick={store.toggleCombineMode}
                    startIcon={<MergeIcon />}
                  >
                    Объединить объекты
                  </CustomButton>
                ) : (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={`Режим объединения: выбрано ${store.selectedObjects.length}`}
                      color="primary"
                      variant="outlined"
                    />
                    <CustomButton
                      variant="outlined"
                      size="small"
                      onClick={store.cancelCombineMode}
                    >
                      Отменить
                    </CustomButton>
                  </Box>
                )}
              </>
            }
            customActionButton={createViewButton}
            data={store.data}
            tableName="ArchiveObject"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <ArchMap />
        </Grid>
      </Grid>
      {/* Попап подтверждения объединения */}
      <CombineObjectsPopup
        open={store.showCombinePopup}
        onClose={store.closeCombinePopup}
        onConfirm={(newDocNumber, newAddress) => {
          store.combineObjects(newDocNumber, newAddress);
        }}
      />
    </Container>
  );
});

const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`;

export default ArchiveObjectListView;