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

        <form id="ApplicationFilterTypeForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ApplicationFilterType_TitleName">
                  {translate('label:ApplicationFilterTypeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname != ''}
                      id='id_f_ApplicationFilterType_name'
                      label={translate('label:ApplicationFilterTypeAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode != ''}
                      id='id_f_ApplicationFilterType_code'
                      label={translate('label:ApplicationFilterTypeAddEditView.code')}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ''}
                      id='id_f_ApplicationFilterType_description'
                      label={translate('label:ApplicationFilterTypeAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorpost_id}
                      error={store.errorpost_id != ""}
                      id="id_f_ApplicationFilter_post_id"
                      label={translate("label:ApplicationFilterTypeAddEditView.post_id")}
                      value={store.post_id}
                      onChange={(event) => store.handleChange(event)}
                      name="post_id"
                      data={store.orgPosts}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorstructure_id}
                      error={store.errorstructure_id != ""}
                      id="id_f_ApplicationFilter_structure_id"
                      label={translate("label:ApplicationFilterTypeAddEditView.structure_id")}
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.orgStructure}
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
