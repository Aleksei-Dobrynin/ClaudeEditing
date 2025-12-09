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

type contragent_interactionTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basecontragent_interactionView: FC<contragent_interactionTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="contragent_interactionForm" id="contragent_interactionForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="contragent_interaction_TitleName">
                  {translate('label:contragent_interactionAddEditView.entityTitle')}
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
                      data-testid="id_f_contragent_interaction_name"
                      id='id_f_contragent_interaction_name'
                      label={translate('label:contragent_interactionAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.contragent_id}
                      onChange={(event) => store.handleChange(event)}
                      name="contragent_id"
                      data={store.contragents}
                      id='id_f_contragent_interaction_contragent_id'
                      label={translate('label:contragent_interactionAddEditView.contragent_id')}
                      helperText={store.errors.contragent_id}
                      error={!!store.errors.contragent_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      multiline={true}
                      rows={2}
                      data-testid="id_f_contragent_interaction_description"
                      id='id_f_contragent_interaction_description'
                      label={translate("label:contragent_interactionAddEditView.Comment")}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.progress}
                      onChange={(event) => store.handleChange(event)}
                      name="progress"
                      data-testid="id_f_contragent_interaction_progress"
                      id='id_f_contragent_interaction_progress'
                      label={translate('label:contragent_interactionAddEditView.progress')}
                      helperText={store.errors.progress}
                      error={!!store.errors.progress}
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

export default Basecontragent_interactionView;
