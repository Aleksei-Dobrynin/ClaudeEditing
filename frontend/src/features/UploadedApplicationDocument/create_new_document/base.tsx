import React, { FC, useEffect } from "react";
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
import MtmLookup from "components/mtmLookup";

type uploaded_application_documentTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseuploaded_application_documentView: FC<uploaded_application_documentTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  useEffect(() => {
    if (props.isPopup) {
      store.loadApplicationDocuments()
    }
  }, []);
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="uploaded_application_documentForm" id="uploaded_application_documentForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="uploaded_application_document_TitleName">
                  {translate('label:uploaded_application_documentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_uploaded_application_document_name"
                      id='id_f_uploaded_application_document_name'
                      label={translate('label:uploaded_application_documentAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.document_number}
                      onChange={(event) => store.handleChange(event)}
                      name="document_number"
                      data-testid="id_f_uploaded_application_document_document_number"
                      id='id_f_uploaded_application_document_document_number'
                      label={translate('label:uploaded_application_documentAddEditView.document_number')}
                      helperText={store.errors.document_number}
                      error={!!store.errors.document_number}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <MtmLookup
                      label={translate("label:uploaded_application_documentAddEditView.app_doc_ids")}
                      name="app_doc_ids"
                      value={store.app_doc_ids}
                      data={store.AppDocuments}
                      onChange={(name, value) => store.changeAppDocName(value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default Baseuploaded_application_documentView;
