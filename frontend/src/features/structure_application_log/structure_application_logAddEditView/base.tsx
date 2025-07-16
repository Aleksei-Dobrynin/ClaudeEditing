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

type structure_application_logTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basestructure_application_logView: FC<structure_application_logTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="structure_application_logForm" id="structure_application_logForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="structure_application_log_TitleName">
                  {translate('label:structure_application_logAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.Structures}
                      id="id_f_structure_id"
                      label={translate("label:EmployeeInStructureAddEditView.structure_id")}
                      helperText={store.errors.structure_id}
                      error={!!store.errors.structure_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                      data-testid="id_f_structure_application_log_application_id"
                      id='id_f_structure_application_log_application_id'
                      label={translate('label:structure_application_logAddEditView.application_id')}
                      helperText={store.errors.application_id}
                      error={!!store.errors.application_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.status}
                      onChange={(event) => store.handleChange(event)}
                      name="status"
                      data-testid="id_f_structure_application_log_status"
                      id='id_f_structure_application_log_status'
                      label={translate('label:structure_application_logAddEditView.status')}
                      helperText={store.errors.status}
                      error={!!store.errors.status}
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

export default Basestructure_application_logView;
