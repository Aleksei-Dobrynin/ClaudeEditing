import { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  CardContent,
  Container,
  Grid,
} from '@mui/material';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import LookUp from 'components/LookUp';
import CustomButton from 'components/Button';
import AutocompleteCustom from 'components/Autocomplete';
import dayjs from 'dayjs';
import printJS from 'print-js';

type ReestrOtchetProps = {};

const ReestrOtchetView: FC<ReestrOtchetProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const tableRef = useRef(null);
  const [departmentHead, setDepartmentHead] = useState('');

  useEffect(() => {
    store.doLoad()
    return () => {
      store.clearStore()
    }
  }, [])

  const handlePrint = () => {
    // Create a style element to include CSS for printing
    let style = `
      <style>
        @media print {
          @page {
            size: A4;
          }
          
          body { 
            font-size: 12pt;
          }
          
          table { 
            border-collapse: collapse;
            width: 100% !important;
            table-layout: fixed !important;
          }
          
          th, td { 
            border: 1px solid black;
            padding: 2px 2px;
            text-align: left;
            /* Критически важные стили для переноса текста */
            word-wrap: break-word !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            vertical-align: top;
          }
          
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          
          /* Предотвращение разрыва строк таблицы между страницами */
          tr {
            page-break-inside: avoid;
          }
          
          /* Повторение заголовка таблицы на каждой странице */
          thead {
            display: table-header-group;
          }
          
          .section-title { 
            font-weight: bold;
            margin: 5px 0;
          }
          
          h3 {
            margin: 15px 0;
            font-size: 16pt;
          }
          
          /* Стили для подписей */
          .signatures {
            margin-top: 30px;
            page-break-inside: avoid;
          }
          
          .signatures p {
            margin: 15px 0;
            line-height: 1.6;
          }
          
             td:nth-child(1),
        th:nth-child(1) {
          width: 30px;
          white-space: nowrap !important;
        }

          /* Запрет переноса текста для колонок 5-8 */
          td:nth-child(5),
          td:nth-child(6),
          td:nth-child(7),
          td:nth-child(8),
          th:nth-child(5),
          th:nth-child(6),
          th:nth-child(7){
            white-space: nowrap !important;
            text-align: center;
          }
       
          /* Опционально: установка ширины колонок */
          /* Настройте проценты в зависимости от вашего контента */
          /*
        
          td:nth-child(2) { width: 25%; }
          td:nth-child(3) { width: 35%; }
          td:nth-child(4) { width: 25%; }

            td:nth-child(1) { max-width: 5px !important; }
             th:nth-child(1){ max-width: 5px !important; }
          */
        }
        
        /* Стили для экрана (предпросмотр) */
        @media screen {
          table {
            width: 100%;
            table-layout: fixed;
          }
          
          th, td {
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
          }
        }
      </style>
    `;
    
    // Создание заголовка документа
    const documentTitle = `
      <h3>Акт готовности работ за ${store.months.find(x => x.id == store.month)?.name} месяц ${store.year} г.
      <br/>отдел: ${store.structures.find(x => x.id == store.structure_id)?.name}</h3>
    `;
    
    // Get the table HTML content
    const tableContent = tableRef.current ? tableRef.current.outerHTML : '';
    
    // Create signature section with the department head's name
    const signatures = `
      <div class="signatures">
        <p>Начальник ППО________________________________________Биккинина Т.Н</p>
        <p>Начальник отдела ______________________________________${departmentHead}</p>
      </div>
    `;
    
    // Combine HTML content в правильном порядке
    const printContent = style + documentTitle + tableContent + signatures;
    
    // Print using printJS
    printJS({
      printable: printContent,
      type: 'raw-html',
      documentTitle: `Акт готовности работ - ${store.months.find(x => x.id == store.month)?.name} ${store.year}`,
      targetStyles: ['*'],
      css: null,
      scanStyles: true,
      // Дополнительные опции для лучшей печати
      header: null,
      properties: null,
      gridHeaderStyle: 'font-weight: bold;',
      gridStyle: 'border: 1px solid black; text-align: left; padding: 4px;'
    });
  };

  const getTable = () => {
    return (
      <table ref={tableRef}>
        <thead>
          <tr>
            <th>№</th>
            <th style={{ width: '15%' }}>№ договора</th>
            <th style={{ width: '15%' }}>Заказчик</th>
            <th style={{ width: '20%' }}>Объект</th>
            <th>Сумма</th>
            <th>НДС</th>
            <th>НСП</th>
            <th>Выполнение</th>
          </tr>
        </thead>
        <tbody>
          <tr className="section-title">
            <td colSpan={8}>Юридические лица</td>
          </tr>

          {store.your_lico.map((app, i) => {
            return <tr key={app.id} style={{ backgroundColor: store.rowClickedId === app.id ? "#C7EBF9" : "" }} onClick={() => store.clickRow(app.id)}>
              <td>{i + 1}</td>
              <td>
                {app.number}({app.registration_date ? dayjs(app.registration_date).format("DD.MM.YYYY") : ""})<br />
                {app.service_name}
              </td>
              <td>{app.customer_name}</td>
              <td>{app.arch_object_address}</td>
              <td>{app.total_sum?.toFixed(2)}</td>
              <td>{app.nds_value?.toFixed(2)}</td>
              <td>{app.nsp_value?.toFixed(2)}</td>
              <td>{(app.total_sum - app.nds_value - app.nsp_value)?.toFixed(2)}</td>
            </tr>
          })}

          <tr>
            <td colSpan={4} align='right'>Итого юр. лица</td>
            <td>{store.your_lico?.map(x => x.total_sum).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>

            <td>{store.your_lico?.map(x => x.nds_value).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>


            <td>{store.your_lico?.map(x => x.nsp_value).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>

            <td>{store.your_lico?.map(app => app.total_sum - app.nds_value - app.nsp_value).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>
          </tr>

          <tr className="section-title">
            <td colSpan={8}>Физические лица</td>
          </tr>

          {store.fiz_lico.map((app, i) => {
            return <tr key={app.id} style={{ backgroundColor: store.rowClickedId === app.id ? "#C7EBF9" : "" }} onClick={() => store.clickRow(app.id)}>
              <td>{i + 1}</td>
              <td>
                {app.number}({app.registration_date ? dayjs(app.registration_date).format("DD.MM.YYYY") : ""})<br />
                {app.service_name}
              </td>
              <td>{app.customer_name}</td>
              <td>{app.arch_object_address}</td>
              <td>{app.total_sum?.toFixed(2)}</td>
              <td>{app.nds_value?.toFixed(2)}</td>
              <td>{app.nsp_value?.toFixed(2)}</td>
              <td>{(app.total_sum - app.nds_value - app.nsp_value)?.toFixed(2)}</td>
            </tr>
          })}

          <tr>
            <td colSpan={4} align='right'>Итого физ. лица</td>
            <td>{store.fiz_lico?.map(x => x.total_sum).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>

            <td>{store.fiz_lico?.map(x => x.nds_value).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>

            <td>{store.fiz_lico?.map(x => x.nsp_value).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>

            <td>{store.fiz_lico?.map(app => app.total_sum - app.nds_value - app.nsp_value).reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)?.toFixed(2)}</td>
          </tr>

          <tr>
            <td colSpan={4} align='right'>Всего</td>
            <td>{(
              store.fiz_lico?.map(x => x.total_sum).reduce((a, c) => a + c, 0) +
              store.your_lico?.map(x => x.total_sum).reduce((a, c) => a + c, 0)
            )?.toFixed(2)}</td>

            <td>{(
              store.fiz_lico?.map(x => x.nds_value).reduce((a, c) => a + c, 0) +
              store.your_lico?.map(x => x.nds_value).reduce((a, c) => a + c, 0)
            )?.toFixed(2)}</td>

            <td>{(
              store.fiz_lico?.map(x => x.nsp_value).reduce((a, c) => a + c, 0) +
              store.your_lico?.map(x => x.nsp_value).reduce((a, c) => a + c, 0)
            )?.toFixed(2)}</td>

            <td>{(
              store.fiz_lico?.map(app => app.total_sum - app.nds_value - app.nsp_value).reduce((a, c) => a + c, 0) +
              store.your_lico?.map(app => app.total_sum - app.nds_value - app.nsp_value).reduce((a, c) => a + c, 0)
            )?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Container maxWidth='xl' sx={{ mt: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={1} xs={6}>
              <LookUp
                value={store.year}
                onChange={(event) => store.handleChange(event)}
                name="year"
                data={store.years}
                skipEmpty
                id='id_f_reestr_year'
                label={translate('label:reestrAddEditView.year')}
                helperText={store.errors.year}
                error={!!store.errors.year}
              />
            </Grid>
            <Grid item md={1} xs={6}>
              <LookUp
                value={store.month}
                onChange={(event) => store.handleChange(event)}
                name="month"
                skipEmpty
                data={store.months}
                id='months'
                label={translate('label:reestrAddEditView.month')}
                helperText={store.errors.month}
                error={!!store.errors.month}
              />
            </Grid>
            <Grid item md={2} xs={6}>
              <LookUp
                value={store.status}
                onChange={(event) => store.handleChange(event)}
                name="status"
                skipEmpty
                data={store.statuses}
                id='status'
                label={translate('Статус')}
                helperText={store.errors.status}
                error={!!store.errors.status}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <AutocompleteCustom
                data={store.structures}
                value={store.structure_id}
                id='structure_id'
                fieldNameDisplay={(field) => field.name}
                label={translate('Отдел')}
                onChange={(event) => store.handleChange(event)}
                name="structure_id"
              />
            </Grid>

            <Grid item md={2} xs={6}>
              <CustomButton 
                onClick={() => store.loadOtchetData()} 
                variant='contained'
                sx={{ marginRight: '8px' }}
              >
                Применить
              </CustomButton>
              <CustomButton 
                onClick={handlePrint} 
                variant='contained'
              >
                Печать
              </CustomButton>
            </Grid>
          </Grid>
        </CardContent>

        {getTable()}

        <Box sx={{ mt: 2 }}>
          <span>Начальник ППО________________________________________Биккинина Т.Н</span>
          <br />
          <br />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span>Начальник отдела ______________________________________</span>
            <input 
              type="text" 
              value={departmentHead}
              onChange={(e) => setDepartmentHead(e.target.value)}
              style={{ 
                marginLeft: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                width: '200px'
              }}
              placeholder="Введите ФИО"
            />
          </Box>
        </Box>
      </Container>
    </>
  );
});

export default ReestrOtchetView;