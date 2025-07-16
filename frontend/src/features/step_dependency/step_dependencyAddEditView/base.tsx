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

type step_dependencyTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Basestep_dependencyView: FC<step_dependencyTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="step_dependencyForm" id="step_dependencyForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="step_dependency_TitleName">
                  {translate('label:step_dependencyAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.service_path_id}
                      onChange={(event) => store.handleServicePathChange(event)}
                      name="service_path_id"
                      data={store.service_paths}
                      id='id_f_step_dependency_service_path_id'
                      label={translate('label:step_dependencyAddEditView.service_path_id')}
                      helperText={store.errors.service_path_id}
                      error={!!store.errors.service_path_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.dependent_step_id}
                      onChange={(event) => store.handleChange(event)}
                      name="dependent_step_id"
                      data={store.filtered_steps}
                      id='id_f_step_dependency_dependent_step_id'
                      label={translate('label:step_dependencyAddEditView.dependent_step_id')}
                      helperText={store.errors.dependent_step_id}
                      error={!!store.errors.dependent_step_id}
                      disabled={false} // Не блокируем, так как можно выбирать из всех шагов
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.prerequisite_step_id}
                      onChange={(event) => store.handleChange(event)}
                      name="prerequisite_step_id"
                      data={store.filtered_steps}
                      id='id_f_step_dependency_prerequisite_step_id'
                      label={translate('label:step_dependencyAddEditView.prerequisite_step_id')}
                      helperText={store.errors.prerequisite_step_id}
                      error={!!store.errors.prerequisite_step_id}
                      disabled={false} // Не блокируем, так как можно выбирать из всех шагов
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_strict}
                      onChange={(event) => store.handleChange(event)}
                      name="is_strict"
                      label={translate('label:step_dependencyAddEditView.is_strict')}
                      id='id_f_step_dependency_is_strict'
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

export default Basestep_dependencyView;