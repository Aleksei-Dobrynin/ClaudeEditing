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
import DateTimeField from "components/DateTimeField";
import TreeLookUp from "components/TreeLookup";
import AutocompleteCustom from "components/Autocomplete";
import dayjs from "dayjs";
import DateField from 'components/DateField';

type ArchiveObjectsEventsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idArchiveObject?: number;
};

const BaseArchiveObjectsEventsView: FC<ArchiveObjectsEventsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 8}>
          <form data-testid="ArchiveObjectsEventsForm" id="ArchiveObjectsEventsForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="ArchiveObjectsEvents_TitleName">
                  {translate('label:ArchiveObjectsEventsAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_ArchiveObjectsEvents_description"
                      id='id_f_ArchiveObjectsEvents_description'
                      label={translate('label:ArchiveObjectsEventsAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                      multiline
                      rows={4}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <TreeLookUp
                      value={store.structure_id}
                      onChange={(event) => {
                        store.handleChange(event)
                        store.setStructureID(event.target.value - 0)
                      }}
                      name="structure_id"
                      data={store.structures}
                      id='id_f_application_task_structure_id'
                      label={translate('label:application_taskAddEditView.structure_id')}
                    />
                    {!!store.errors.structure_id &&
                      <span style={{
                        color: "#f44336",
                        fontSize: "0.75rem",
                        marginLeft: 15,
                        fontFamily: "Roboto",
                        fontWeight: 400
                      }}>{store.errors.structure_id}</span>}
                  </Grid>

                  {store.structure_id && <Grid item md={6} xs={12}>
                    <AutocompleteCustom
                      value={store.head_structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="head_structure_id"
                      data-testid="id_f_ArchiveObjectsEvents_head_structure_id"
                      id='id_f_ArchiveObjectsEvents_head_structure_id'
                      label={translate('label:ArchiveObjectsEventsAddEditView.head_structure_id')}
                      helperText={store.errors.head_structure_id}
                      error={!!store.errors.head_structure_id}
                      data={store.headStructures}
                      fieldNameDisplay={(item) =>
                        item.employee_name
                      }
                    />
                  </Grid>}

                  {store.structure_id && <Grid item md={6} xs={12}>
                    <AutocompleteCustom
                      value={store.employee_id}
                      onChange={(event) => store.handleChange(event)}
                      name="employee_id"
                      data-testid="id_f_ArchiveObjectsEvents_employee_id"
                      id='id_f_ArchiveObjectsEvents_employee_id'
                      label={translate('label:ArchiveObjectsEventsAddEditView.employee_id')}
                      helperText={store.errors.employee_id}
                      error={!!store.errors.employee_id}
                      data={store.employeeInStructure}
                      fieldNameDisplay={(item) =>
                        item.employee_name
                      }
                    />
                  </Grid>}

                  <Grid item md={6} xs={12}>
                    <AutocompleteCustom
                      value={store.event_type_id}
                      onChange={(event) => store.handleChange(event)}
                      name="event_type_id"
                      data-testid="id_f_ArchiveObjectsEvents_event_type_id"
                      id='id_f_ArchiveObjectsEvents_event_type_id'
                      label={translate('label:ArchiveObjectsEventsAddEditView.event_type_id')}
                      helperText={store.errors.event_type_id}
                      error={!!store.errors.event_type_id}
                      data={store.event_types}
                      fieldNameDisplay={(item) =>
                        item.name
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DateField
                      value={store.event_date ? dayjs(store.event_date) : null}
                      onChange={(value) => store.handleDateChange('event_date', value)}
                      name="event_date"
                      data-testid="id_f_ArchiveObjectsEvents_event_date"
                      id='id_f_ArchiveObjectsEvents_event_date'
                      label={translate('label:ArchiveObjectsEventsAddEditView.event_date')}
                      helperText={store.errors.event_date}
                      error={!!store.errors.event_date}
                    />
                  </Grid>

                  {/* <Grid item md={12} xs={12}>
                    <AutocompleteCustom
                      value={store.application_id}
                      onChange={(event) => store.handleChange(event)}
                      name="application_id"
                      data-testid="id_f_ArchiveObjectsEvents_application_id"
                      id='id_f_ArchiveObjectsEvents_application_id'
                      label={translate('label:ArchiveObjectsEventsAddEditView.application_id')}
                      helperText={store.errors.application_id}
                      error={!!store.errors.application_id}
                      data={store.applications}
                      fieldNameDisplay={(item) =>
                        item.application_id + " " + item.arch_object_name + " " + item.customer_name
                      }
                    />
                  </Grid> */}

                    {/* <Grid item md={12} xs={12}>
                      <CustomTextField
                        value={store.application_id}
                        onChange={(event) => store.handleChange(event)}
                        name="application_id"
                        data-testid="id_f_ArchiveObjectsEvents_application_id"
                        id='id_f_ArchiveObjectsEvents_application_id'
                        label={translate('label:ArchiveObjectsEventsAddEditView.application_id')}
                        helperText={store.errors.application_id}
                        error={!!store.errors.application_id}
                        type="number"
                        
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

export default BaseArchiveObjectsEventsView;