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
import dayjs from "dayjs";
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

        <form id="LawDocumentForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="LawDocument_TitleName">
                  {translate('label:LawDocumentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname !== ''}
                      id='id_f_LawDocument_name'
                      label={translate('label:LawDocumentAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      value={store.data}
                      onChange={(event) => store.handleChange(event)}
                      name="data"
                      id="data"
                      label={translate("label:LawDocumentAddEditView.data")}
                      helperText={store.errordata}
                      error={!!store.errordata}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription !== ''}
                      id='id_f_LawDocument_description'
                      label={translate('label:LawDocumentAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errortype_id}
                      error={store.errortype_id != ""}
                      id="id_f_ApplicationFilter_type_id"
                      label={translate("label:LawDocumentAddEditView.type_id")}
                      value={store.type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="type_id"
                      data={store.LawDocumentTypes}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorlink}
                      error={store.errorlink !== ''}
                      id='id_f_LawDocument_link'
                      label={translate('label:LawDocumentAddEditView.link')}
                      value={store.link}
                      onChange={(event) => store.handleChange(event)}
                      name="link"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname_kg}
                      error={store.errorname_kg !== ''}
                      id='id_f_LawDocument_name_kg'
                      label={translate('label:LawDocumentAddEditView.name_kg')}
                      value={store.name_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="name_kg"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription_kg}
                      error={store.errordescription_kg !== ''}
                      id='id_f_LawDocument_description_kg'
                      label={translate('label:LawDocumentAddEditView.description_kg')}
                      value={store.description_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="description_kg"
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
