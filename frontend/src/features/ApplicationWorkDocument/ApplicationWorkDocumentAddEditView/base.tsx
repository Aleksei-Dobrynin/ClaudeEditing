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
import FileField from "../../../components/FileField";
import RenderFormField from "./render";

type ApplicationWorkDocumentTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseApplicationWorkDocumentView: FC<ApplicationWorkDocumentTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const handleFieldChange = (id: string, value: any) => {
    store.updateField(id, value);
  };

  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ApplicationWorkDocumentForm" id="ApplicationWorkDocumentForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="ApplicationWorkDocument_TitleName">
                  {translate('label:ApplicationWorkDocumentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <FileField
                      value={store.FileName}
                      helperText={store.errors.FileName}
                      error={!!store.errors.FileName}
                      inputKey={store.idDocumentinputKey}
                      fieldName="FileName"
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
                      value={store.comment}
                      onChange={(event) => store.handleChange(event)}
                      name="comment"
                      multiline
                      id="comment"
                      label={translate("label:ApplicationWorkDocumentAddEditView.comment")}
                      helperText={store.errors.comment}
                      error={!!store.errors.comment}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.id_type}
                      onChange={(event) => {store.handleChange(event);
                        store.metadata = JSON.parse(store.DocumentTypes.find(t => t.id == event.target.value)?.metadata)}}
                      name="id_type"
                      data={store.DocumentTypes}
                      id='id_type'
                      label={translate('Тип документа')}
                      error={!!store.errors.id_type}
                      helperText={store.errors.id_type}
                    />
                  </Grid>
                  {store.metadata?.length > 0 && <Grid item md={12} xs={12}>
                    <RenderFormField
                      metadata={store.metadata}
                      onFieldChange={handleFieldChange}
                    />
                  </Grid>}
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

export default BaseApplicationWorkDocumentView;
