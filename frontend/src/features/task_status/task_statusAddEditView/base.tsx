import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type task_statusTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basetask_statusView: FC<task_statusTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="task_statusForm" id="task_statusForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="task_status_TitleName">
                  {translate('label:task_statusAddEditView.entityTitle')}
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
                      data-testid="id_f_task_status_name"
                      id='id_f_task_status_name'
                      label={translate('label:task_statusAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_task_status_description"
                      id='id_f_task_status_description'
                      label={translate('label:task_statusAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_task_status_code"
                      id='id_f_task_status_code'
                      label={translate('label:task_statusAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.textcolor}
                      onChange={(event) => store.handleChange(event)}
                      name="textcolor"
                      data-testid="id_f_task_status_textcolor"
                      id='id_f_task_status_textcolor'
                      label={translate('label:task_statusAddEditView.textcolor')}
                      helperText={store.errors.textcolor}
                      error={!!store.errors.textcolor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.backcolor}
                      onChange={(event) => store.handleChange(event)}
                      name="backcolor"
                      data-testid="id_f_task_status_backcolor"
                      id='id_f_task_status_backcolor'
                      label={translate('label:task_statusAddEditView.backcolor')}
                      helperText={store.errors.backcolor}
                      error={!!store.errors.backcolor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Chip size="small" label={store.name} style={{ background: store.backcolor, color: store.textcolor }} />
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

export default Basetask_statusView;
