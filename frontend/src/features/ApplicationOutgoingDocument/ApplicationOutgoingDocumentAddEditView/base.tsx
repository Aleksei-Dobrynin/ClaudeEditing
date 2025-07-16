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

        <form id="ApplicationOutgoingDocumentForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="ApplicationOutgoingDocument_TitleName">
                  {translate('label:ApplicationOutgoingDocumentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {/*<Grid item md={12} xs={12}>*/}
                  {/*  <CustomTextField*/}
                  {/*    helperText={store.errorname}*/}
                  {/*    error={store.errorname !== ''}*/}
                  {/*    id='id_f_ApplicationOutgoingDocument_name'*/}
                  {/*    label={translate('label:ApplicationOutgoingDocumentAddEditView.name')}*/}
                  {/*    value={store.name}*/}
                  {/*    onChange={(event) => store.handleChange(event)}*/}
                  {/*    name="name"*/}
                  {/*  />*/}
                  {/*</Grid>*/}
                  {/*<Grid item md={12} xs={12}>*/}
                  {/*  <CustomTextField*/}
                  {/*    helperText={store.errorcode}*/}
                  {/*    error={store.errorcode !== ''}*/}
                  {/*    id='id_f_ApplicationOutgoingDocument_code'*/}
                  {/*    label={translate('label:ApplicationOutgoingDocumentAddEditView.code')}*/}
                  {/*    value={store.code}*/}
                  {/*    onChange={(event) => store.handleChange(event)}*/}
                  {/*    name="code"*/}
                  {/*  />*/}
                  {/*</Grid>*/}
                  {/*<Grid item md={12} xs={12}>*/}
                  {/*  <CustomTextField*/}
                  {/*    helperText={store.errordescription}*/}
                  {/*    error={store.errordescription !== ''}*/}
                  {/*    id='id_f_ApplicationOutgoingDocument_description'*/}
                  {/*    label={translate('label:ApplicationOutgoingDocumentAddEditView.description')}*/}
                  {/*    value={store.description}*/}
                  {/*    onChange={(event) => store.handleChange(event)}*/}
                  {/*    name="description"*/}
                  {/*  />*/}
                  {/*</Grid>*/}
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
