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
import Ckeditor from "components/ckeditor/ckeditor";
import MtmLookup from "components/mtmLookup";

type S_DocumentTemplateTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseS_DocumentTemplateView: FC<S_DocumentTemplateTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="S_DocumentTemplateForm" id="S_DocumentTemplateForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="S_DocumentTemplate_TitleName">
                  {translate('label:S_DocumentTemplateAddEditView.entityTitle')}
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
                      data-testid="id_f_S_DocumentTemplate_name"
                      id='id_f_S_DocumentTemplate_name'
                      label={translate('label:S_DocumentTemplateAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_S_DocumentTemplate_description"
                      id='id_f_S_DocumentTemplate_description'
                      label={translate('label:S_DocumentTemplateAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_S_DocumentTemplate_code"
                      id='id_f_S_DocumentTemplate_code'
                      label={translate('label:S_DocumentTemplateAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idCustomSvgIcon}
                      onChange={(event) => store.handleChange(event)}
                      name="idCustomSvgIcon"
                      data={store.CustomSvgIcons}
                      id='id_f_S_DocumentTemplate_idCustomSvgIcon'
                      label={translate('label:S_DocumentTemplateAddEditView.idCustomSvgIcon')}
                      helperText={store.errors.idCustomSvgIcon}
                      error={!!store.errors.idCustomSvgIcon}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.iconColor}
                      onChange={(event) => store.handleChange(event)}
                      name="iconColor"
                      data-testid="id_f_S_DocumentTemplate_iconColor"
                      id='id_f_S_DocumentTemplate_iconColor'
                      label={translate('label:S_DocumentTemplateAddEditView.iconColor')}
                      helperText={store.errors.iconColor}
                      error={!!store.errors.iconColor}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idDocumentType}
                      onChange={(event) => store.handleChange(event)}
                      name="idDocumentType"
                      data={store.S_DocumentTemplateTypes}
                      id='id_f_S_DocumentTemplate_idDocumentType'
                      label={translate('label:S_DocumentTemplateAddEditView.idDocumentType')}
                      helperText={store.errors.idDocumentType}
                      error={!!store.errors.idDocumentType}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <MtmLookup
                      value={store.id_OrgStructures}
                      onChange={(name, value) => store.changeOrgStructures(value)}
                      name="orgStructure"
                      data={store.OrgStructures}
                      label={translate("label:S_DocumentTemplateAddEditView.orgStructure")}
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

export default BaseS_DocumentTemplateView;
