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

type StructureTemplatesTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseStructureTemplatesView: FC<StructureTemplatesTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="StructureTemplatesForm" id="StructureTemplatesForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="StructureTemplates_TitleName">
                  {translate('label:StructureTemplatesAddEditView.entityTitle')}
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
                      data-testid="id_f_StructureTemplates_name"
                      id='id_f_StructureTemplates_name'
                      label={translate('label:StructureTemplatesAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_StructureTemplates_description"
                      id='id_f_StructureTemplates_description'
                      label={translate('label:StructureTemplatesAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
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

export default BaseStructureTemplatesView;
