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

        <form id="CustomerDiscountDocumentsForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="CustomerDiscountDocuments_TitleName">
                  {translate('label:CustomerDiscountDocumentsAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errordiscount_documents_id}
                      error={store.errordiscount_documents_id != ''}
                      id='id_f_CustomerDiscountDocuments_discount_documents_id'
                      label={translate('label:CustomerDiscountDocumentsAddEditView.discount_documents_id')}
                      value={store.discount_documents_id}
                      fieldNameDisplay={(f) => f.file_name}
                      onChange={(event) => store.handleChange(event)}
                      name="discount_documents_id"
                      data={store.discountDocuments}
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
