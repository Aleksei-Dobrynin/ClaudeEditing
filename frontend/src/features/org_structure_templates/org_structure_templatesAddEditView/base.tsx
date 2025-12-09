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

type org_structure_templatesTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baseorg_structure_templatesView: FC<org_structure_templatesTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="org_structure_templatesForm" id="org_structure_templatesForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="org_structure_templates_TitleName">
                  {translate('label:org_structure_templatesAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.template_id}
                      onChange={(event) => store.handleChange(event)}
                      name="template_id"
                      data={store.S_DocumentTemplates}
                      id='id_f_org_structure_templates_template_id'
                      label={translate('label:org_structure_templatesAddEditView.template_id')}
                      helperText={store.errors.template_id}
                      error={!!store.errors.template_id}
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

export default Baseorg_structure_templatesView;
