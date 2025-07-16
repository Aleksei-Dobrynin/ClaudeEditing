import { FC, useEffect } from 'react';
import {
  CardContent,
  Container,
  Grid,
  Box,
  TextField
} from '@mui/material';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import LookUp from 'components/LookUp';
import CustomButton from 'components/Button';
import { Link } from 'react-router-dom';
import TreeLookUp from 'components/TreeLookup';
import AutocompleteCustom from 'components/Autocomplete';
import dayjs from 'dayjs';


type ReestrOtchetProps = {
};


const ReestrOtchetView: FC<ReestrOtchetProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.doLoad()
    return () => {
      store.clearStore()
    }
  }, [])


  const printTable = () => {
    const tableContent = document.getElementById("printableTable")?.outerHTML;
    if (tableContent) {
      const printWindow = window.open("", "_blank", "fullscreen=yes");
      printWindow?.document.write(`
        <html>
          <head>
              Налоги за `+ store.months.find(x => x.id == store.month)?.name + ` месяц ` + store.year + ` г.

            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 4px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            ${tableContent}
            <div style="display: flex;
            width: 100%;
            margin-top: 10px;
            max-width: 1200px;
            margin: 0 auto;">
        <div style="flex: 1;
            padding: 20px;
            white-space: pre-wrap;
            ">
  ${store.text_sign}
        </div>
         <div style="flex: 1;
            padding: 20px;
            white-space: pre-wrap;
            ">
             ${store.text_sign2}
        </div>
    </div>

          </body>
        </html>
      `);
      printWindow?.print();
    }
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

            <Grid item md={6} xs={6}>
              <Box display="flex" m={1}>
                <CustomButton style={{ margin: 10 }} onClick={() => store.loadOtchetData()} variant='contained'>
                  Применить
                </CustomButton>
                <CustomButton style={{ margin: 10 }} onClick={() => { printTable(); }} variant='contained'>
                  Печать
                </CustomButton>
              </Box>

            </Grid>

          </Grid>
        </CardContent>



        <table id={"printableTable"} width={'100%'}>
          <thead>
            <tr>
              <th></th>
              <th>Юридические лица</th>
              <th>Физические лица</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>


            {store.data.map((app, i) => {
              return <tr key={app.id}>
                <td>{app.tax_name === 'nds' ? "НДС (12%)" : "НСП (2%)"}</td>
                <td>{app.fiz_summa?.toFixed(2)}</td>
                <td>{app.your_summa?.toFixed(2)}</td>
                <td>{app.all_summa?.toFixed(2)}</td>
              </tr>
            })}

          </tbody>
        </table>

        <div>
          <Grid container md={12} xs={12}>
            <Grid item md={6}>
              <TextField
                multiline={true}
                fullWidth={true}
                rows={6}
                value={store.text_sign}
                onChange={(e) => {
                  store.text_sign = e.target.value;
                }} />
            </Grid>
            <Grid item md={6}>
              <TextField
                multiline={true}
                fullWidth={true}
                rows={6}
                value={store.text_sign2}
                onChange={(e) => {
                  store.text_sign2 = e.target.value;
                }} />
            </Grid>

          </Grid>
        </div>
      </Container>

    </>
  );
})



export default ReestrOtchetView
