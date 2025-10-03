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
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import FileField from "components/FileField";

type Contragent_interaction_docBaseProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseContragent_interaction_docView: FC<Contragent_interaction_docBaseProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Container maxWidth='xl' sx={{ mt: props.isPopup ? 0 : 3 }}>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <form data-testid="contragent_interaction_docForm" id="contragent_interaction_docForm" autoComplete='off'>
            {!props.isPopup && (
              <Card component={Paper} elevation={5}>
                <CardHeader 
                  title={
                    <span id="contragent_interaction_doc_TitleName">
                      {translate('label:contragent_interaction_docAddEditView.entityTitle')}
                    </span>
                  } 
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <FileField
                        value={store.fileName}
                        helperText={store.errors.fileName}
                        error={!!store.errors.fileName}
                        inputKey={store.idDocumentInputKey}
                        fieldName="fileName"
                        onChange={(event) => {
                          if (event.target.files.length === 0) return;
                          store.handleChange({ target: { value: event.target.files[0], name: "File" } });
                          store.handleChange({ target: { value: event.target.files[0].name, name: "fileName" } });
                        }}
                        onClear={() => {
                          store.handleChange({ target: { value: null, name: "File" } });
                          store.handleChange({ target: { value: '', name: "fileName" } });
                          store.changeDocInputKey();
                        }}
                      />
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.message}
                        onChange={(event) => store.handleChange(event)}
                        name="message"
                        id='id_f_contragent_interaction_doc_message'
                        label={translate('label:contragent_interaction_docAddEditView.message')}
                        helperText={store.errors.message}
                        error={!!store.errors.message}
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {props.isPopup && (
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <FileField
                    value={store.fileName}
                    helperText={store.errors.fileName}
                    error={!!store.errors.fileName}
                    inputKey={store.idDocumentInputKey}
                    fieldName="fileName"
                    onChange={(event) => {
                      if (event.target.files.length === 0) return;
                      store.handleChange({ target: { value: event.target.files[0], name: "File" } });
                      store.handleChange({ target: { value: event.target.files[0].name, name: "fileName" } });
                    }}
                    onClear={() => {
                      store.handleChange({ target: { value: null, name: "File" } });
                      store.handleChange({ target: { value: '', name: "fileName" } });
                      store.changeDocInputKey();
                    }}
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <CustomTextField
                    value={store.message}
                    onChange={(event) => store.handleChange(event)}
                    name="message"
                    id='id_f_contragent_interaction_doc_message'
                    label={translate('label:contragent_interaction_docAddEditView.message')}
                    helperText={store.errors.message}
                    error={!!store.errors.message}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            )}
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
});

export default BaseContragent_interaction_docView;