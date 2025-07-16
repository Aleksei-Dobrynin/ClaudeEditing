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

type legal_record_objectTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const Baselegal_record_objectView: FC<legal_record_objectTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="legal_record_objectForm" id="legal_record_objectForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="legal_record_object_TitleName">
                  {translate('label:legal_record_objectAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.id_object}
                      onChange={(event) => store.handleChange(event)}
                      name="id_object"
                      data={store.legal_objects}
                      id='id_f_legal_record_object_id_object'
                      label={translate('label:legal_record_objectAddEditView.id_object')}
                      helperText={store.errors.id_object}
                      error={!!store.errors.id_object}
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

export default Baselegal_record_objectView;
