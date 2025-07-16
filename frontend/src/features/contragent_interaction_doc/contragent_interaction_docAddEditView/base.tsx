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

type contragent_interaction_docTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basecontragent_interaction_docView: FC<contragent_interaction_docTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="contragent_interaction_docForm" id="contragent_interaction_docForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="contragent_interaction_doc_TitleName">
                  {translate('label:contragent_interaction_docAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.file_id}
                      onChange={(event) => store.handleChange(event)}
                      name="file_id"
                      data={store.files}
                      id='id_f_contragent_interaction_doc_file_id'
                      label={translate('label:contragent_interaction_docAddEditView.file_id')}
                      helperText={store.errors.file_id}
                      error={!!store.errors.file_id}
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

export default Basecontragent_interaction_docView;
