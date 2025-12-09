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

type archive_doc_tagTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basearchive_doc_tagView: FC<archive_doc_tagTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="archive_doc_tagForm" id="archive_doc_tagForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="archive_doc_tag_TitleName">
                  {translate('label:archive_doc_tagAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_archive_doc_tag_updated_at'
                      label={translate('label:archive_doc_tagAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_archive_doc_tag_created_by"
                      id='id_f_archive_doc_tag_created_by'
                      label={translate('label:archive_doc_tagAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_archive_doc_tag_updated_by"
                      id='id_f_archive_doc_tag_updated_by'
                      label={translate('label:archive_doc_tagAddEditView.updated_by')}
                      helperText={store.errors.updated_by}
                      error={!!store.errors.updated_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_archive_doc_tag_name"
                      id='id_f_archive_doc_tag_name'
                      label={translate('label:archive_doc_tagAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_archive_doc_tag_description"
                      id='id_f_archive_doc_tag_description'
                      label={translate('label:archive_doc_tagAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_archive_doc_tag_code"
                      id='id_f_archive_doc_tag_code'
                      label={translate('label:archive_doc_tagAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="name_kg"
                      data-testid="id_f_archive_doc_tag_name_kg"
                      id='id_f_archive_doc_tag_name_kg'
                      label={translate('label:archive_doc_tagAddEditView.name_kg')}
                      helperText={store.errors.name_kg}
                      error={!!store.errors.name_kg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="description_kg"
                      data-testid="id_f_archive_doc_tag_description_kg"
                      id='id_f_archive_doc_tag_description_kg'
                      label={translate('label:archive_doc_tagAddEditView.description_kg')}
                      helperText={store.errors.description_kg}
                      error={!!store.errors.description_kg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.text_color}
                      onChange={(event) => store.handleChange(event)}
                      name="text_color"
                      data-testid="id_f_archive_doc_tag_text_color"
                      id='id_f_archive_doc_tag_text_color'
                      label={translate('label:archive_doc_tagAddEditView.text_color')}
                      helperText={store.errors.text_color}
                      error={!!store.errors.text_color}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.background_color}
                      onChange={(event) => store.handleChange(event)}
                      name="background_color"
                      data-testid="id_f_archive_doc_tag_background_color"
                      id='id_f_archive_doc_tag_background_color'
                      label={translate('label:archive_doc_tagAddEditView.background_color')}
                      helperText={store.errors.background_color}
                      error={!!store.errors.background_color}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_archive_doc_tag_created_at'
                      label={translate('label:archive_doc_tagAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
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

export default Basearchive_doc_tagView;
