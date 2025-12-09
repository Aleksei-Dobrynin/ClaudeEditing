import { FC, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CardContent,
  Grid,
} from '@mui/material';
import CustomButton from "components/Button";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import styled from 'styled-components';
import OtchetTable from './otchet'
import { ReestrCode } from "constants/constant";
import LookUp from 'components/LookUp';

type application_in_reestrListViewProps = {
};


const application_in_reestrListView: FC<application_in_reestrListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.clearStore()
    store.doLoad();
  }, [])

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
  


            <Grid item md={2} xs={6}>
              <CustomButton onClick={() => store.loadapplication_in_reestrs()} variant='contained'>
                Применить
              </CustomButton>
            </Grid>
          </Grid>
        </CardContent>

        <Box sx={{ m: 3 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 500 }}>
            {translate("common:Register_of_completed_works")}
          </Typography>
        </Box>
        <OtchetTable />

      </Container>
    </>

  );
})



export default application_in_reestrListView
