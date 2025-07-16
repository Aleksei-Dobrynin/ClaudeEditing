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
import DateField from "../../../components/DateField";
import CustomButton from "../../../components/Button";

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

        <form id="TechCouncilSessionForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="TechCouncilSession_TitleName">
                  {translate('label:TechCouncilSessionAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.date}
                      onChange={(event) => store.handleChange(event)}
                      name="date"
                      id='id_f_workflow_date'
                      label={translate('label:TechCouncilSessionAddEditView.date')}
                      helperText={store.errordate}
                      error={!!store.errordate}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomButton
                      variant="contained"
                      id="id_TechCouncilSessionSaveButton"
                      onClick={() => {
                        store.toArchive();
                      }}
                      disabled={store.is_active != true}
                    >
                      {translate("common:move_to_archive")}
                    </CustomButton>
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
