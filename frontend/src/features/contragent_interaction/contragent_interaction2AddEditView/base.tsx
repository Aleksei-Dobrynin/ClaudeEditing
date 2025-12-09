import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import CustomButton from 'components/Button';

type contragent_interactionTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basecontragent_interactionView: FC<contragent_interactionTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <CustomButton
        color="primary"
        size="small"
        variant="contained"
        disabled={store.status == "В работе"}
        sx={{ mb: "5px", mr: 1 }}
        onClick={() => { 
          store.status = "В работе"
          store.onSaveClick((id: number) => {
            store.doLoad(id);
          })

        }}
      >
        {translate("common:INprogress")}
      </CustomButton>
      <CustomButton
        color="primary"
        size="small"
        variant="contained"
        disabled={store.status == "Завершено"}
        sx={{ mb: "5px", mr: 1 }}
        onClick={() => { 
          store.status = "Завершено"
          store.onSaveClick((id: number) => {
            store.doLoad(id);
          })
        }}
      >
        {translate("common:Completed")}
      </CustomButton>
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
                    <LookUp
                      disabled
                      value={store.task_id}
                      onChange={(event) => store.handleChange(event)}
                      name="task_id"
                      data={store.application_tasks}
                      id='id_f_contragent_interaction_task_id'
                      label={translate('label:contragent_interactionAddEditView.task_id')}
                      helperText={store.errors.task_id}
                      error={!!store.errors.task_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      disabled
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
                      disabled
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
                    <CustomTextField
                      disabled
                      value={store.object_address}
                      onChange={(event) => store.handleChange(event)}
                      name="object_address"
                      data-testid="id_f_contragent_interaction_name"
                      id='id_f_contragent_interaction_name'
                      label={translate("label:contragent_interactionAddEditView.Property_address")}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      disabled
                      value={store.customer_name}
                      onChange={(event) => store.handleChange(event)}
                      name="customer_name"
                      data-testid="id_f_contragent_interaction_name"
                      id='id_f_contragent_interaction_name'
                      label={translate("label:contragent_interactionAddEditView.Customer")}
                    />
                  </Grid>


                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      disabled
                      value={store.customer_contact}
                      onChange={(event) => store.handleChange(event)}
                      name="customer_contact"
                      data-testid="id_f_contragent_interaction_name"
                      id='id_f_contragent_interaction_name'
                      label={translate("label:contragent_interactionAddEditView.Customer_contacts")}
                    />
                  </Grid>

                  {/* <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.task_id}
                      onChange={(event) => store.handleChange(event)}
                      name="task_id"
                      data={store.application_tasks}
                      id='id_f_contragent_interaction_task_id'
                      label={translate('label:contragent_interactionAddEditView.task_id')}
                      helperText={store.errors.task_id}
                      error={!!store.errors.task_id}
                    />
                  </Grid> */}

                  {/* <Grid item md={12} xs={12}>
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
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      multiline={true}
                      rows={3}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
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
