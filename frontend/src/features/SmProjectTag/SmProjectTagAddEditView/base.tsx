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

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form id="SmProjectTagForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="SmProjectTag_TitleName">
                  {translate('label:SmProjectTagAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.tag_id}
                      onChange={(event) => store.handleChange(event)}
                      name="tag_id"
                      data={store.SurveyTags}
                      id='id_f_SmProjectTag_tag_id'
                      label={translate('label:SmProjectTagAddEditView.tag_id')}
                      helperText={store.errortag_id}
                      error={store.errortag_id !== ''}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
