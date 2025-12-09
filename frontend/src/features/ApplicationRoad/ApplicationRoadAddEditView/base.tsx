import React, { FC, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "../../../components/Checkbox";
import MtmLookup from "../../../components/mtmLookup";

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

        <form id="ApplicationRoadForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ApplicationRoad_TitleName">
                  {translate('label:ApplicationRoadAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.from_status_id}
                      onChange={(event) => store.handleChange(event)}
                      name="from_status_id"
                      data={store.Statuses}
                      id='from_status_id'
                      label={translate('label:ApplicationRoadAddEditView.from_status_id')}
                      error={store.from_status_idError !== ''}
                      helperText={store.from_status_idError}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.to_status_id}
                      onChange={(event) => store.handleChange(event)}
                      name="to_status_id"
                      data={store.Statuses}
                      id='to_status_id'
                      label={translate('label:ApplicationRoadAddEditView.to_status_id')}
                      error={store.to_status_idError !== ''}
                      helperText={store.to_status_idError}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ''}
                      id='id_f_ApplicationRoad_description'
                      label={translate('label:ApplicationRoadAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      id='id_f_ApplicationRoad_validation_url'
                      label={translate('label:ApplicationRoadAddEditView.validation_url')}
                      value={store.validation_url}
                      onChange={(event) => store.handleChange(event)}
                      name="validation_url"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      id='id_f_ApplicationRoad_post_function_url'
                      label={translate('label:ApplicationRoadAddEditView.post_function_url')}
                      value={store.post_function_url}
                      onChange={(event) => store.handleChange(event)}
                      name="post_function_url"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      name={"is_active"}
                      onChange={() =>
                        store.handleChange({ target: { name: "is_active", value: !store.is_active }}
                        )}
                      label={translate('label:ApplicationRoadAddEditView.is_active')}
                      id={'id_f_ApplicationRoad_is_active'}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <MtmLookup
                      value={store.selectedPost}
                      onChange={(name, value) => store.changePost(value)}
                      name="post_name"
                      data={store.StructurePost}
                      label={translate("label:EmployeeInStructureListView.post_name")}
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
