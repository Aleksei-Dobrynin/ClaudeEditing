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

type legal_objectTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baselegal_objectView: FC<legal_objectTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="legal_objectForm" id="legal_objectForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="legal_object_TitleName">
                  {translate('label:legal_objectAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_legal_object_address"
                      id='id_f_legal_object_address'
                      label={translate('label:legal_objectAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_legal_object_description"
                      id='id_f_legal_object_description'
                      label={translate('label:legal_objectAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>

                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.geojson}
                      onChange={(event) => store.handleChange(event)}
                      name="geojson"
                      data-testid="id_f_legal_object_geojson"
                      id='id_f_legal_object_geojson'
                      label={translate('label:legal_objectAddEditView.geojson')}
                      helperText={store.errors.geojson}
                      error={!!store.errors.geojson}
                    />
                  </Grid> */}
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

export default Baselegal_objectView;
