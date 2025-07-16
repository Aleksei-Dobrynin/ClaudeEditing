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

        <form id="TechCouncilForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="TechCouncil_TitleName">
                  {translate('label:TechCouncilAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorstructure_id}
                      error={store.errorstructure_id !== ''}
                      id='id_f_TechCouncil_structure_id'
                      label={translate('label:TechCouncilAddEditView.structure_id')}
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorapplication_id}
                      error={store.errorapplication_id !== ''}
                      id='id_f_TechCouncil_application_id'
                      label={translate('label:TechCouncilAddEditView.application_id')}
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordecision}
                      error={store.errordecision !== ''}
                      id='id_f_TechCouncil_decision'
                      label={translate('label:TechCouncilAddEditView.decision')}
                      value={store.decision}
                      onChange={(event) => store.handleChange(event)}
                      name="decision"
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
