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
import LookUp from "components/LookUp";
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import CustomTextField from "components/TextField";
import DateField from "components/DateField";
import FileField from "components/FileField";
import dayjs from "dayjs";

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

        <form id="DiscountDocumentsForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="DiscountDocuments_TitleName">
                  {translate('label:DiscountDocumentsAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <FileField
                      value={store.FileName}
                      helperText={store.errorFileName}
                      error={!!store.errorFileName}
                      inputKey={store.idDocumentinputKey}
                      fieldName="fileName"
                      onChange={(event) => {
                        if (event.target.files.length == 0) return
                        store.handleChange({ target: { value: event.target.files[0], name: "File" } })
                        store.handleChange({ target: { value: event.target.files[0].name, name: "FileName" } })
                      }}
                      onClear={() => {
                        store.handleChange({ target: { value: null, name: "File" } })
                        store.handleChange({ target: { value: '', name: "FileName" } })
                        store.changeDocInputKey()
                      }}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordescription}
                      error={store.errordescription != ''}
                      id='id_f_DiscountDocuments_description'
                      label={translate('label:DiscountDocumentsAddEditView.description')}
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errordiscount}
                      error={store.errordiscount != ''}
                      id='id_f_DiscountDocuments_discount'
                      label={translate('label:DiscountDocumentsAddEditView.discount')}
                      value={store.discount}
                      onChange={(event) => store.handleChange(event)}
                      name="discount"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errordiscount_type_id}
                      error={store.errordiscount_type_id != ''}
                      id='id_f_DiscountDocuments_discount_type_id'
                      label={translate('label:DiscountDocumentsAddEditView.discount_type_id')}
                      value={store.discount_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="discount_type_id"
                      data={store.discount_types}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errordocument_type_id}
                      error={store.errordocument_type_id != ''}
                      id='id_f_DiscountDocuments_document_type_id'
                      label={translate('label:DiscountDocumentsAddEditView.document_type_id')}
                      value={store.document_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="document_type_id"
                      data={store.document_types}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      helperText={store.errorstart_date}
                      error={store.errorstart_date != ''}
                      id='id_f_DiscountDocuments_start_date'
                      label={translate('label:DiscountDocumentsAddEditView.start_date')}
                      value={store.start_date != null ? dayjs(new Date(store.start_date)) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="start_date"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      helperText={store.errorend_date}
                      error={store.errorend_date != ''}
                      id='id_f_DiscountDocuments_end_date'
                      label={translate('label:DiscountDocumentsAddEditView.end_date')}
                      value={store.end_date != null ? dayjs(new Date(store.end_date)) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="end_date"
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
