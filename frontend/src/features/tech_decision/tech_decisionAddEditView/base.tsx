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
import store from "./store";
import { observer } from "mobx-react";
import CustomTextField from "components/TextField";
import DateTimeField from "components/DateTimeField";

type tech_decisionTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basetech_decisionView: FC<tech_decisionTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="tech_decisionForm" id="tech_decisionForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="tech_decision_TitleName">
                  {translate('label:tech_decisionAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {/* Поле name */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_tech_decision_name"
                      id='id_f_tech_decision_name'
                      label={translate('label:tech_decisionAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>

                  {/* Поле code */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_tech_decision_code"
                      id='id_f_tech_decision_code'
                      label={translate('label:tech_decisionAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>

                  {/* Поле description */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_tech_decision_description"
                      id='id_f_tech_decision_description'
                      label={translate('label:tech_decisionAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>

                  {/* Поле name_kg */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="name_kg"
                      data-testid="id_f_tech_decision_name_kg"
                      id='id_f_tech_decision_name_kg'
                      label={translate('label:tech_decisionAddEditView.name_kg')}
                      helperText={store.errors.name_kg}
                      error={!!store.errors.name_kg}
                    />
                  </Grid>

                  {/* Поле description_kg */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description_kg}
                      onChange={(event) => store.handleChange(event)}
                      name="description_kg"
                      data-testid="id_f_tech_decision_description_kg"
                      id='id_f_tech_decision_description_kg'
                      label={translate('label:tech_decisionAddEditView.description_kg')}
                      helperText={store.errors.description_kg}
                      error={!!store.errors.description_kg}
                    />
                  </Grid>

                  {/* Поле text_color */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.text_color}
                      onChange={(event) => store.handleChange(event)}
                      name="text_color"
                      data-testid="id_f_tech_decision_text_color"
                      id='id_f_tech_decision_text_color'
                      label={translate('label:tech_decisionAddEditView.text_color')}
                      helperText={store.errors.text_color}
                      error={!!store.errors.text_color}
                    />
                  </Grid>

                  {/* Поле background_color */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.background_color}
                      onChange={(event) => store.handleChange(event)}
                      name="background_color"
                      data-testid="id_f_tech_decision_background_color"
                      id='id_f_tech_decision_background_color'
                      label={translate('label:tech_decisionAddEditView.background_color')}
                      helperText={store.errors.background_color}
                      error={!!store.errors.background_color}
                    />
                  </Grid>

                  {/* Поле created_at */}
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_tech_decision_created_at'
                      label={translate('label:tech_decisionAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>

                  {/* Поле updated_at */}
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_tech_decision_updated_at'
                      label={translate('label:tech_decisionAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>

                  {/* Поле created_by */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by?.toString() || ""}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_tech_decision_created_by"
                      id='id_f_tech_decision_created_by'
                      label={translate('label:tech_decisionAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>

                  {/* Поле updated_by */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by?.toString() || ""}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_tech_decision_updated_by"
                      id='id_f_tech_decision_updated_by'
                      label={translate('label:tech_decisionAddEditView.updated_by')}
                      helperText={store.errors.updated_by}
                      error={!!store.errors.updated_by}
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
});

export default Basetech_decisionView;