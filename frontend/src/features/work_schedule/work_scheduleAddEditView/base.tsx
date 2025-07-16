import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type work_scheduleTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Basework_scheduleView: FC<work_scheduleTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="work_scheduleForm" id="work_scheduleForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="work_schedule_TitleName">
                  {translate('label:work_scheduleAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_work_schedule_name"
                      id='id_f_work_schedule_name'
                      label={translate('label:work_scheduleAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.year}
                      onChange={(event) => store.handleChange(event)}
                      name="year"
                      data-testid="id_f_work_schedule_year"
                      id='id_f_work_schedule_year'
                      label={translate('label:work_scheduleAddEditView.year')}
                      helperText={store.errors.year}
                      error={!!store.errors.year}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:work_scheduleAddEditView.is_active')}
                      id='id_f_work_schedule_is_active'
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default Basework_scheduleView;
