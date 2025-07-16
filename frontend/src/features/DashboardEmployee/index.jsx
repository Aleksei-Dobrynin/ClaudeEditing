import * as React from 'react';

import { observer } from 'mobx-react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import store from './store';
import ApplcationDashboardEmployee from './applications'
import MapView from './map';
import PivotDashboardEmployee from './pivot/index';




const DashboardEmployeeView = observer(() => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;

  React.useEffect(() => {
    store.doLoad();
  }, [])


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} maxHeight={true}>
        <ApplcationDashboardEmployee />
      </Grid>
      <Grid item xs={12} md={12}>
        <PivotDashboardEmployee />
      </Grid>
      <Grid item xs={12} md={12}>
        <MapView />
      </Grid>
    </Grid>
  );

})


export default DashboardEmployeeView