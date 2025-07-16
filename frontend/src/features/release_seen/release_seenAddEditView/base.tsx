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

type release_seenTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baserelease_seenView: FC<release_seenTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="release_seenForm" id="release_seenForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="release_seen_TitleName">
                  {translate('label:release_seenAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.user_id}
                      onChange={(event) => store.handleChange(event)}
                      name="user_id"
                      data-testid="id_f_release_seen_user_id"
                      id='id_f_release_seen_user_id'
                      label={translate('label:release_seenAddEditView.user_id')}
                      helperText={store.errors.user_id}
                      error={!!store.errors.user_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date_issued}
                      onChange={(event) => store.handleChange(event)}
                      name="date_issued"
                      id='id_f_release_seen_date_issued'
                      label={translate('label:release_seenAddEditView.date_issued')}
                      helperText={store.errors.date_issued}
                      error={!!store.errors.date_issued}
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

export default Baserelease_seenView;
