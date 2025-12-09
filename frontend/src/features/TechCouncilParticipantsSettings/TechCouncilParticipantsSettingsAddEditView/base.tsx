import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from "components/LookUp";
import CustomCheckbox from "../../../components/Checkbox";

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

        <form id="TechCouncilParticipantsSettingsForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="TechCouncilParticipantsSettings_TitleName">
                  {translate('label:TechCouncilParticipantsSettingsAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      disabled={true}
                      helperText={store.errorservice_id}
                      error={store.errorservice_id !== ''}
                      id='id_f_TechCouncilParticipantsSettings_service_id'
                      label={translate('label:TechCouncilParticipantsSettingsAddEditView.service_id')}
                      value={store.service_id}
                      data={store.services}
                      onChange={(event) => store.handleChange(event)}
                      name="service_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorstructure_id}
                      error={store.errorstructure_id !== ''}
                      id='id_f_TechCouncilParticipantsSettings_structure_id'
                      label={translate('label:TechCouncilParticipantsSettingsAddEditView.structure_id')}
                      value={store.structure_id}
                      data={store.structures}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate("label:TechCouncilParticipantsSettingsAddEditView.is_active")}
                      id="id_f_TechCouncilParticipantsSettingsAddEditView_is_active"
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
