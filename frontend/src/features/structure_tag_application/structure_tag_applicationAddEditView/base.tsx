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

type structure_tag_applicationTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basestructure_tag_applicationView: FC<structure_tag_applicationTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="structure_tag_applicationForm" id="structure_tag_applicationForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="structure_tag_application_TitleName">
                  {translate('label:structure_tag_applicationAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_tag_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_tag_id"
                      data={store.structure_tags}
                      id='id_f_structure_tag_application_structure_tag_id'
                      label={translate('label:structure_tag_applicationAddEditView.structure_tag_id')}
                      helperText={store.errors.structure_tag_id}
                      error={!!store.errors.structure_tag_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                      data-testid="id_f_structure_tag_application_application_id"
                      id='id_f_structure_tag_application_application_id'
                      label={translate('label:structure_tag_applicationAddEditView.application_id')}
                      helperText={store.errors.application_id}
                      error={!!store.errors.application_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_id"
                      data={store.org_structures}
                      id='id_f_structure_tag_application_structure_id'
                      label={translate('label:structure_tag_applicationAddEditView.structure_id')}
                      helperText={store.errors.structure_id}
                      error={!!store.errors.structure_id}
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

export default Basestructure_tag_applicationView;
