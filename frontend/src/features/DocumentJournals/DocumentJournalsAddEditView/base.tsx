import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  CardActionArea,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import CustomTextField from "components/TextField";
import DateField from "components/DateField";
import LookUp from "components/LookUp";
import MtmLookup from "components/mtmLookup";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>
      <Grid container>

        <form id="DocumentJournalsForm" autoComplete='off'>
          <Paper elevation={7}  >
            <Card>
              <CardHeader title={
                <span id="DocumentJournals_TitleName">
                  {translate('label:DocumentJournalsAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorname}
                      error={store.errorname !== ''}
                      id='id_f_DocumentJournals_name'
                      label={translate('label:DocumentJournalsAddEditView.name')}
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorcode}
                      error={store.errorcode !== ''}
                      id='id_f_DocumentJournals_code'
                      label={translate('label:DocumentJournalsAddEditView.code')}
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <MtmLookup
                      value={store.statuses}
                      onChange={(name, value) => store.changeStatuses(value)}
                      name="statuses"
                      data={store.Statuses}
                      label={"Статусы заявки"}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <Grid container spacing={1}>
                      {store.Templates.map((tpl) => {
                        return (
                          <Grid item key={tpl.id} xs="auto" sx={{ m: 0.5 }}>
                            <Card
                              key={tpl.id}
                              variant={'outlined'}
                              sx={{
                                minWidth: 90,
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                transition: 'background-color 0.2s',
                              }}
                            >
                              <CardActionArea onClick={() => store.toggleTemplate(tpl.id)}>
                                <CardContent sx={{ p: 1 }}>
                                  <Typography align="center" variant="body2" fontWeight={500}>
                                    {tpl.name}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {store.selected.length ? (
                        store.selected.map((tpl, idx) => (
                          <Chip
                            key={`${tpl.id}-${idx}`}
                            label={tpl.name}
                            onDelete={() => store.removeTemplate(idx)}
                            color="primary"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Выберите элементы шаблона
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      id='id_f_DocumentJournals_number_exampleValue'
                      label={translate('label:DocumentJournalsAddEditView.exampleValue')}
                      value={store.exampleValue}
                      name="exampleValue"
                      onChange={() => { }}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errornumber_template}
                      error={store.errornumber_template !== ''}
                      id='id_f_DocumentJournals_number_template'
                      label={translate('label:DocumentJournalsAddEditView.number_template')}
                      value={store.number_template}
                      onChange={(event) => store.handleChange(event)}
                      name="number_template"
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      type="number"
                      disabled
                      helperText={store.errorcurrent_number}
                      error={store.errorcurrent_number !== ''}
                      id='id_f_DocumentJournals_current_number'
                      label={translate('label:DocumentJournalsAddEditView.current_number')}
                      value={store.current_number}
                      onChange={(event) => store.handleChange(event)}
                      name="current_number"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      helperText={store.errorperiod_type_id}
                      error={store.errorperiod_type_id !== ''}
                      id='id_f_DocumentJournals_period_type_id'
                      label={translate('label:DocumentJournalsAddEditView.reset_period')}
                      value={store.period_type_id}
                      data={store.PeriodTypes}
                      onChange={(event) => store.handleChange(event)}
                      name="period_type_id"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateField
                      helperText={store.errorlast_reset}
                      disabled
                      error={store.errorlast_reset !== ''}
                      id='id_f_DocumentJournals_last_reset'
                      label={translate('label:DocumentJournalsAddEditView.last_reset')}
                      value={store.last_reset}
                      onChange={(event) => store.handleChange(event)}
                      name="last_reset"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
})


export default BaseView;
