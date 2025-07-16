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

type S_DocumentTemplateCategoryTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseS_DocumentTemplateCategoryView: FC<S_DocumentTemplateCategoryTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="S_DocumentTemplateCategoryForm" id="S_DocumentTemplateCategoryForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="S_DocumentTemplateCategory_TitleName">
                  {translate('label:S_DocumentTemplateCategoryAddEditView.entityTitle')}
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
                      data-testid="id_f_S_DocumentTemplateCategory_name"
                      id='id_f_S_DocumentTemplateCategory_name'
                      label={translate('label:S_DocumentTemplateCategoryAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_S_DocumentTemplateCategory_description"
                      id='id_f_S_DocumentTemplateCategory_description'
                      label={translate('label:S_DocumentTemplateCategoryAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_S_DocumentTemplateCategory_code"
                      id='id_f_S_DocumentTemplateCategory_code'
                      label={translate('label:S_DocumentTemplateCategoryAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.queueNumber}
                      onChange={(event) => store.handleChange(event)}
                      name="queueNumber"
                      data-testid="id_f_S_DocumentTemplateCategory_queueNumber"
                      id='id_f_S_DocumentTemplateCategory_queueNumber'
                      label={translate('label:S_DocumentTemplateCategoryAddEditView.queueNumber')}
                      helperText={store.errors.queueNumber}
                      error={!!store.errors.queueNumber}
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

export default BaseS_DocumentTemplateCategoryView;
