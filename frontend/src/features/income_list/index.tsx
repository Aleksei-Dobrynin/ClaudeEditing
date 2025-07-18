import React, { FC, useEffect } from 'react';
import {
  Checkbox,
  Container, Grid, IconButton
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import dayjs from "dayjs";
import CustomTextField from "components/TextField";
import AutocompleteCustom from "../../components/Autocomplete";
import DateField from "../../components/DateField";
import CustomButton from "../../components/Button";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MtmLookup from "../../components/mtmLookup";
import printJS from 'print-js';
import * as XLSX from 'xlsx';

type incomeListViewProps = {
};


const incomeListView: FC<incomeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.load_structures();
    store.loadincomes()
    return () => {
      store.clearStore()
    }
  }, [])



  const handleExcelExport = () => {
    // Получаем форматированные данные для экспорта
    const exportData = store.data.map((row) => {
      // Обработка payments_structure
      let paymentsStructure = "";
      try {
        const payments = JSON.parse(row.payments_structure || '[]');
        paymentsStructure = payments.map(p => `${p.structure_name}: ${p.sum}`).join(", ");
      } catch (e) {
        paymentsStructure = "";
      }
      
      return {
        "Номер заявки": row.application_number,
        "Дата оплаты": row.invoice_date ? dayjs(row.invoice_date).format("DD.MM.YYYY HH:mm") : "",
        "Сумма оплаты": row.invoice_sum,
        "ID платежа": row.payment_identifier,
        "Заказчик": row.customer_name,
        "Адрес объекта": row.object_address,
        "Услуга": row.service_name,
        "Отделы": paymentsStructure,
        "Калькуляции": row.payments_sum,
        "Оплаченная сумма": row.paid_sum,
      };
    });
  
    // Создаем новую книгу Excel
    const workbook = XLSX.utils.book_new();
    
    // Преобразуем данные в формат таблицы Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Добавляем таблицу в книгу Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Оплаты");
    
    // Устанавливаем ширину столбцов
    const columnWidths = [
      { wch: 15 }, // Номер заявки
      { wch: 20 }, // Дата оплаты
      { wch: 15 }, // Сумма оплаты
      { wch: 15 }, // ID платежа
      { wch: 30 }, // Заказчик
      { wch: 30 }, // Адрес объекта
      { wch: 25 }, // Услуга
      { wch: 30 }, // Отделы
      { wch: 15 }, // Калькуляции
      { wch: 15 }, // Оплаченная сумма
    ];
    worksheet['!cols'] = columnWidths;
    
    // Получаем текущую дату и время для имени файла
    const now = dayjs().format('YYYY-MM-DD_HH-mm');
    
    // Экспортируем Excel-файл
    XLSX.writeFile(workbook, `Оплаты_${now}.xlsx`);
  };
  const columns: GridColDef[] = [

    {
      field: 'application_number',
      headerName: translate("label:incomeListView.application_number"),
      flex: 1,
      renderCell: (params) => {
        return <>
          <Link
            style={{ textDecoration: "underline", marginLeft: 5 }}
            to={`/user/Application/addedit?id=${params.row.application_id}`}
            target="_blank"
            rel="noopener noreferrer">
            {params.value}
          </Link>
        </>
      }
    },
    {
      field: 'invoice_date',
      headerName: translate("label:incomeListView.invoice_date"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
        </span>
      )
    },
    {
      field: 'invoice_sum',
      headerName: translate("label:incomeListView.invoice_sum"),
      flex: 1,
    },
    {
      field: 'payment_identifier',
      headerName: translate("label:incomeListView.payment_identifier"),
      flex: 1,
    },
    {
      field: 'customer_name',
      headerName: translate("label:incomeListView.customer_name"),
      flex: 1,
    },
    {
      field: 'object_address',
      headerName: translate("label:incomeListView.object_address"),
      flex: 1,
    },
    {
      field: 'service_name',
      headerName: translate("label:incomeListView.service_name"),
      flex: 1,
    },
    {
      field: 'payments_structure',
      headerName: translate("label:incomeListView.payments_structure"),
      flex: 1,
      renderCell: (params) => {
        let payments = [];
        try {
          payments = JSON.parse(params.value || '[]');
        } catch (e) {
          payments = [];
        }
        return (
          <div>
            {payments.map((p, idx) => (
              <div key={idx}>
                {p.structure_name}: {p.sum}
              </div>
            ))}
          </div>
        );
      }
    },
    {
      field: 'payments_sum',
      headerName: translate("label:incomeListView.payments_sum"),
      flex: 1,
    },
    {
      field: 'paid_sum',
      headerName: translate("label:incomeListView.paid_sum"),
      flex: 1,
    }
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:incomeListView.entityTitle")}
        onDeleteClicked={(id: number) => { }}
        columns={columns}
        data={store.data}
        getRowHeight={() => 'auto'}
        customHeader={<>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{ mb: 1 }}>
              <DateField
                value={store.dateStart}
                onChange={(event) => store.change(event)}
                name="dateStart"
                id="dateStart"
                helperText=""
                label={translate("Дата начала")}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mb: 1 }}>
              <DateField
                value={store.dateEnd}
                onChange={(event) => store.change(event)}
                name="dateEnd"
                id="dateEnd"
                helperText=""
                label={translate("Дата окончания")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField
                value={store.number}
                onChange={(event) => store.change(event)}
                name="number"
                id="number"
                helperText=""
                label={translate("label:incomeListView.number")}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <MtmLookup
                label={translate("label:ApplicationListView.filterByService")}
                name="service_ids"
                value={store.structures_ids}
                data={store.structures}
                onChange={(name, value) => store.changeStructures(value)}
              />
            </Grid>
            <Grid item xs={12} md={3} display={"flex"}>
              <CustomButton sx={{ mr: 1 }} disabled={store.dateStart == null || store.dateEnd == null} variant="contained"
                onClick={() => {
                  store.loadincomes();
                }
                } >
                Применить
              </CustomButton>
              {(store.dateStart != null || store.number != null || store.structures_ids.length > 0) &&
                <CustomButton onClick={() => {
                  store.number = null;
                  store.structures_ids = [];
                  store.loadincomes();
                }}>Очистить</CustomButton>
              }
            </Grid>
            <Grid item xs={12} md={3} display={"flex"}>
              <CustomButton sx={{ mr: 1 }} disabled={store.dateStart == null || store.dateEnd == null} variant="contained"
                onClick={() => {
                  handleExcelExport();
                }
                } >
                Excel
              </CustomButton>
            </Grid>
          </Grid>
        </>
        }
        hideActions={true}
        hideAddButton={true}
        tableName="income" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:incomeListView.entityTitle")}
        onDeleteClicked={(id: number) => { }}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="income" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}
    </Container>
  );
})



export default incomeListView
