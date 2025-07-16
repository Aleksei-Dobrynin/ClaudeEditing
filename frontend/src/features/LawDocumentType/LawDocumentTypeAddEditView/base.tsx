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

        <form id="LawDocumentTypeForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="LawDocumentType_TitleName">
                  {translate('label:LawDocumentTypeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname !== ''}
                      id='id_f_LawDocumentType_name'
                      label={translate('label:LawDocumentTypeAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode !== ''}
                      id='id_f_LawDocumentType_code'
                      label={translate('label:LawDocumentTypeAddEditView.code')}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription !== ''}
                      id='id_f_LawDocumentType_description'
                      label={translate('label:LawDocumentTypeAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname_kg}
                      error={store.errorname_kg !== ''}
                      id='id_f_LawDocumentType_name_kg'
                      label={translate('label:LawDocumentTypeAddEditView.name_kg')}
                      value={store.name_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="name_kg"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription_kg}
                      error={store.errordescription_kg !== ''}
                      id='id_f_LawDocumentType_description_kg'
                      label={translate('label:LawDocumentTypeAddEditView.description_kg')}
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
