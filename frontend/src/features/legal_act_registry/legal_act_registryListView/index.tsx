import { FC, useEffect } from 'react';
import {
  Container,
  Checkbox,
  Box,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
  Paper
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import PopupForm from './../legal_act_registryAddEditView/popupForm'
import styled from 'styled-components';
import CustomButton from "../../../components/Button";
import AutocompleteCustom from "../../../components/Autocomplete";
import CustomTextField from "../../../components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from 'xlsx';
import { Dayjs } from 'dayjs';

type legal_act_registryListViewProps = {
  address?: string
  data?: any
};

function extractTextWithDOMParser(html) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");
  return doc.body.innerText;
}


const legal_act_registryListView: FC<legal_act_registryListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (props.address) {
      store.address = props.address
      store.loadlegal_act_registriesByAddress(props.address)
    } else {
      store.loadlegal_act_registries()
    }
    return () => {
      store.clearStore()
    }
  }, [props.address])

  const exportToExcel = () => {
    // Получаем данные из store.data
    const data = store.data;

    // Преобразуем данные в формат, подходящий для xlsx
    const formattedData = data.map((row) => ({
      [translate("label:legal_act_registryListView.act_type")]: row.act_type,
      [translate("label:legal_act_registryListView.date_issue")]: row.date_issue,
      [translate("label:legal_act_registryListView.id_status")]: row.statusName,
      [translate("label:legal_act_registryListView.subject")]: extractTextWithDOMParser(row.subject),
      [translate("label:legal_act_registryListView.act_number")]: row.act_number,
      [translate("label:legal_act_registryListView.decision")]: extractTextWithDOMParser(row.decision),
      [translate("label:legal_act_registryListView.addition")]: extractTextWithDOMParser(row.addition),
    }));

    // Создаем рабочую книгу и лист
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Настройка ширины колонок
    const columnWidths = Object.keys(formattedData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 20), // Минимальная ширина 20 символов
    }));
    worksheet["!cols"] = columnWidths;

    // Выделение первой строки цветом
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1:G1");
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = worksheet[cellAddress];
      if (cell) {
        cell.s = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "FFD3D3D3" }, // Светло-серый цвет
          },
          font: {
            bold: true, // Жирный шрифт
          },
          alignment: {
            horizontal: "center", // Выравнивание по центру
          },
        };
      }
    }

    // Создаем рабочую книгу
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Legal Act Registry");

    // Экспортируем файл
    XLSX.writeFile(workbook, translate("label:legal_act_registryListView.entityTitle") + "_" + new Date().toISOString() + ".xlsx");
  };

  const columns: GridColDef[] = [
    {
      field: 'act_number',
      headerName: translate("label:legal_act_registryListView.act_number"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_column_act_number"> {param.row.act_number} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_act_number">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'is_active',
    //   headerName: translate("label:legal_act_registryListView.is_active"),
    //   flex: 1,
    //   renderCell: (param => {
    //           return <Checkbox checked={param.row.is_active} disabled />
    //         }),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_is_active">{param.colDef.headerName}</div>)
    // },
    {
      field: 'act_type',
      headerName: translate("label:legal_act_registryListView.act_type"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_column_act_type"> {param.row.act_type} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_act_type">{param.colDef.headerName}</div>)
    },
    {
      field: 'date_issue',
      headerName: translate("label:legal_act_registryListView.date_issue"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_column_date_issue"> {param.row.date_issue} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_date_issue">{param.colDef.headerName}</div>)
    },
    {
      field: 'id_status',
      headerName: translate("label:legal_act_registryListView.id_status"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_column_id_status"> {param.row.statusName} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_id_status">{param.colDef.headerName}</div>)
    },
    {
      field: 'subject',
      headerName: translate("label:legal_act_registryListView.subject"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_column_subject"> {extractTextWithDOMParser(param.row.subject)} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_subject">{param.colDef.headerName}</div>)
    },

    {
      field: 'decision',
      headerName: translate("label:legal_act_registryListView.decision"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_column_decision"> {extractTextWithDOMParser(param.row.decision)} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_decision">{param.colDef.headerName}</div>)
    },
    {
      field: 'addition',
      headerName: translate("label:legal_act_registryListView.addition"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_column_addition"> {extractTextWithDOMParser(param.row.addition)} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_addition">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'created_at',
    //   headerName: translate("label:legal_act_registryListView.created_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_column_created_at"> {param.row.created_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_created_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_at',
    //   headerName: translate("label:legal_act_registryListView.updated_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_column_updated_at"> {param.row.updated_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_updated_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'created_by',
    //   headerName: translate("label:legal_act_registryListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_column_created_by"> {param.row.created_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:legal_act_registryListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_column_updated_by"> {param.row.updated_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_header_updated_by">{param.colDef.headerName}</div>)
    // },
  ];

  let type1: string = 'form';

  if (props.address != null) {
    type1 = 'popup'
  }
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:legal_act_registryListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_act_registry(id)}
        columns={columns}
        data={store.data}
        customActionButton={(id: number) => <Tooltip title={translate('Просмотр')}><IconButton
          onClick={() => {
            store.openPanel = true;
            store.currentId = id;
          }}
        >
          <VisibilityIcon />
        </IconButton></Tooltip>}
        tableName="legal_act_registry"
        hideDeleteButton={true} />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:legal_act_registryListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_act_registry(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={props.data ? props.data : store.data}
        tableName="legal_act_registry"
        hideAddButton={true}
        hideEditButton={true}
        customActionButton={(id: number) => <Tooltip title={translate('Просмотр')}><IconButton
          onClick={() => {
            store.openPanel = true;
            store.currentId = id;
          }}
        >
          <VisibilityIcon />
        </IconButton></Tooltip>}
        hideDeleteButton={true} />
      break
  }

  let headerMenu = null
  switch (type1) {
    case 'form':
      headerMenu = <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.filter?.commonFilter}
                onChange={(e) => store.filter.commonFilter = e.target.value}
                name={"number"}
                label={translate("label:legal_record_registryListView.search_comonFilter")}
                onKeyDown={(e) => e.keyCode === 13}
                id={"pin"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="number_Search_Btn"
                        onClick={() => store.filter.commonFilter = ""}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Box sx={{ minWidth: 80 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.loadlegal_act_registriesByFilter();
                }}
              >
                {translate("search")}
              </CustomButton>
            </Box>
            {(store.filter?.commonFilter !== ""
            ) && <Box sx={{ m: 1 }}>
                <CustomButton
                  id="clearSearchFilterButton"
                  onClick={() => {
                    store.clearFilter();
                    store.loadlegal_act_registries();
                  }}
                >
                  {translate("clear")}
                </CustomButton>
              </Box>}
            <Box sx={{ m: 1 }}>
              <CustomButton
                variant="contained"
                id="exportToExcelButton"
                onClick={() => exportToExcel()}
              >
                {translate("export_to_excel")}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Paper>
      break
    case 'popup':
      headerMenu = <></>
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {headerMenu}

      {component}

      <PopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadlegal_act_registries()
        }}
      />

    </Container>
  );
})



export default legal_act_registryListView
