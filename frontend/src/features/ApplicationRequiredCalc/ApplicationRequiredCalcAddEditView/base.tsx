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
import CustomTextField from "components/TextField";
import LookUp from "../../../components/LookUp";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>
      <Grid container>

        <form id="ApplicationRequiredCalcForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ApplicationRequiredCalc_TitleName">
                  {translate('label:ApplicationRequiredCalcAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorapplication_id}
                      error={store.errorapplication_id != ""}
                      id="id_f_ApplicationRequiredCalcAddEditView_application_id"
                      label={translate("label:ApplicationRequiredCalcAddEditView.application_id")}
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                      data={store.Applications}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorapplication_step_id}
                      error={store.errorapplication_step_id != ""}
                      id="id_f_ApplicationRequiredCalcAddEditView_application_step_id"
                      label={translate("label:ApplicationRequiredCalcAddEditView.application_step_id")}
                      value={store.application_step_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_step_id"
                      data={store.ApplicationSteps}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorstructure_id}
                      error={store.errorstructure_id != ""}
                      id="id_f_ApplicationRequiredCalcAddEditView_structure_id"
                      label={translate("label:ApplicationRequiredCalcAddEditView.structure_id")}
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.OrgStructures}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
