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

type task_typeTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basetask_typeView: FC<task_typeTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="task_typeForm" id="task_typeForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="task_type_TitleName">
                  {translate('label:task_typeAddEditView.entityTitle')}
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
                      data-testid="id_f_task_type_name"
                      id='id_f_task_type_name'
                      label={translate('label:task_typeAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_task_type_code"
                      id='id_f_task_type_code'
                      label={translate('label:task_typeAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_task_type_description"
                      id='id_f_task_type_description'
                      label={translate('label:task_typeAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_for_task}
                      onChange={(event) => store.handleChange(event)}
                      name="is_for_task"
                      label={translate('label:task_typeAddEditView.is_for_task')}
                      id='id_f_task_type_is_for_task'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_for_subtask}
                      onChange={(event) => store.handleChange(event)}
                      name="is_for_subtask"
                      label={translate('label:task_typeAddEditView.is_for_subtask')}
                      id='id_f_task_type_is_for_subtask'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.icon_color}
                      onChange={(event) => store.handleChange(event)}
                      name="icon_color"
                      data-testid="id_f_task_type_icon_color"
                      id='id_f_task_type_icon_color'
                      label={translate('label:task_typeAddEditView.icon_color')}
                      helperText={store.errors.icon_color}
                      error={!!store.errors.icon_color}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.svg_icon_id}
                      onChange={(event) => store.handleChange(event)}
                      name="svg_icon_id"
                      data-testid="id_f_task_type_svg_icon_id"
                      id='id_f_task_type_svg_icon_id'
                      type="number"
                      label={translate('label:task_typeAddEditView.svg_icon_id')}
                      helperText={store.errors.svg_icon_id}
                      error={!!store.errors.svg_icon_id}
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

export default Basetask_typeView;
