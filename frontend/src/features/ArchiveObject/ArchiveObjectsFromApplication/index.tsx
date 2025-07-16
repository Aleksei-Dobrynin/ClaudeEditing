import React, { FC, useEffect, useRef, useState } from "react";
import {
  Box,
  Chip,
  Container, Grid, IconButton, InputAdornment, Paper,
  Tooltip
} from "@mui/material";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridActionsCell, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import EditIcon from '@mui/icons-material/Edit';
import CustomTextField from "../../../components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import PageGridPagination from "components/PageGridPagination";
import CustomButton from "../../../components/Button";
import {
  FeatureGroup, LayersControl, MapContainer,
  TileLayer, useMap, WMSTileLayer, Marker, Popup
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { EditControl } from "react-leaflet-draw";
import PageGrid from "components/PageGrid";
import { useNavigate } from "react-router-dom";

type ArchiveObjectListViewProps = {
  toArchive?: boolean;
};


const ArchitectureProcess: FC<ArchiveObjectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate()

  useEffect(() => {
    store.toArchive = props.toArchive
    store.loadArchiveObjects();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    // {
    //   field: "id",
    //   headerName: translate("Действия"),
    //   flex: 1,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (param) => {
    //     return <>
    //       <IconButton
    //         onClick={() => navigate(`/user/ArchitectureProcess/addedit?id=${param.row?.archirecture_process_id}`)}
    //       >
    //         <Tooltip title={translate('edit')}><EditIcon /></Tooltip>
    //       </IconButton>
    //     </>
    //   }
    // },
    {
      field: 'actions',
      type: 'actions',
      headerName: translate('actions'),
      width: 150,
      cellClassName: 'actions',
      getActions: (param) => {
        return [
          <GridActionsCellItem
            icon={<Tooltip title={translate('edit')}><EditIcon /></Tooltip>}
            label={translate('Actions')}
            className="textPrimary"
            data-testid={`ArchitectureProcessEditButton`}
            onClick={() => navigate(`/user/ArchitectureProcess/addedit?id=${param.row?.id}&from=${props.toArchive ? "toArchive": "toMain"}`)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "app_number",
      headerName: translate("Номер заявки"),
      flex: 1
    },
    {
      field: "arch_object_number",
      headerName: translate("Номер документа"),
      flex: 1
    },
    {
      field: "arch_object_address",
      headerName: translate("label:ArchiveObjectListView.address"),
      flex: 1
    },
    {
      field: "archirecture_process_status_name",
      headerName: "Статус",
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={params.value}
          style={{ backgroundColor: params.row.archirecture_process_status_back_color, color: params.row.archirecture_process_status_text_color }}
        />
      )
    },
    // {
    //   field: "customer",
    //   headerName: translate("label:ArchiveObjectListView.customer"),
    //   flex: 1
    // },
    {
      field: "description",
      headerName: translate("label:ArchiveObjectListView.description"),
      flex: 1
    }
  ];

  return (
    <>
      <Container maxWidth={false} sx={{ mt: 2 }}>
        <PageGrid
          title={"Объекты дежурного плана из заявок"}
          onDeleteClicked={(id: number) => store.deleteArchiveObject(id)}
          columns={columns}
          hideActions
          hideAddButton
          data={store.data}
          // page={store.filter.pageNumber}
          // pageSize={store.filter.pageSize}
          // totalCount={store.totalCount}
          // changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
          // changeSort={(sortModel) => store.changeSort(sortModel)}
          // searchText={""}
          tableName="ArchiveObject" />
      </Container>

    </>
  );
});


export default ArchitectureProcess;
