import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Box, // Added
  Typography, // Added
  Tooltip, // Added
  IconButton, // Added
  Chip, // Added
  Tab,
  Tabs,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import MtmLookup from "components/mtmLookup";
import AutocompleteCustom from "components/Autocomplete";
import CreateIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import TreeLookUp from "components/TreeLookup";

import LegalObjectView from "../../legal_object/legal_objectAddEditView/popupForm";
import RichTextEditor from "components/richtexteditor/RichTextWithTabs";

type legal_record_registryTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baselegal_record_registryView: FC<legal_record_registryTableProps> = observer((props) => {

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <form data-testid="legal_record_registryForm" id="legal_record_registryForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="legal_record_registry_TitleName">
                  {translate('label:legal_record_registryAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>


                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      disabled={props.isPopup}
                      value={store.complainant}
                      onChange={(event) => store.handleChange(event)}
                      name="complainant"
                      data-testid="id_f_legal_record_registry_complainant"
                      id='id_f_legal_record_registry_complainant'
                      label={translate('label:legal_record_registryAddEditView.complainant')}
                      helperText={store.errors.complainant}
                      error={!!store.errors.complainant}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      disabled={props.isPopup}
                      value={store.defendant}
                      onChange={(event) => store.handleChange(event)}
                      name="defendant"
                      data-testid="id_f_legal_record_registry_defendant"
                      id='id_f_legal_record_registry_defendant'
                      label={translate('label:legal_record_registryAddEditView.defendant')}
                      helperText={store.errors.defendant}
                      error={!!store.errors.defendant}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <LookUp
                      disabled={props.isPopup}
                      value={store.id_status}
                      onChange={(event) => store.handleChange(event)}
                      name="id_status"
                      data={store.legal_registry_statuses}
                      id='id_f_legal_record_registry_id_status'
                      label={translate('label:legal_record_registryAddEditView.id_status')}
                      helperText={store.errors.id_status}
                      error={!!store.errors.id_status}
                    />
                  </Grid>


                  <Grid item md={6} xs={12}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MtmLookup
                        disabled={props.isPopup}
                        value={store.id_LegalObjects}
                        onChange={(name, value) => store.changeLegalObjects(value)}
                        name="tags"
                        data={store.LegalObjects}
                        displayField="address"
                        label={translate("label:legal_record_registryAddEditView.LegalObjects")}
                      />
                      <Tooltip title={translate("Добавить новый объект")}>
                        <IconButton

                          disabled={props.isPopup}
                          onClick={() => store.changeAddresPopup(true)}>
                          <CreateIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {`${translate("Исполнители")}: `}
                    </Typography>
                    {store.assignees.map(x => <Chip disabled={props.isPopup} key={x.id} label={x.employee_name} onDelete={() => store.deleteAssign(x.id)} />)}

                    {store.addAssignePopup ? <Box display={"flex"} alignItems={"center"} sx={{ mt: 2 }}>
                      <AutocompleteCustom
                        disabled={props.isPopup}
                        value={store.structure_employee_id}
                        onChange={(event) => store.handleChange(event)}
                        name="structure_employee_id"
                        data={store.employeeInStructure}
                        fieldNameDisplay={(field) => field.employee_name + " - " + field.post_name}
                        data-testid="id_f_legal_act_registry_assignee_structure_employee_id"
                        id='id_f_legal_act_registry_assignee_structure_employee_id'
                        label={translate('label:legal_record_registryAddEditView.structure_employee_id')}
                        helperText={store.errors.structure_employee_id}
                        error={!!store.errors.structure_employee_id}
                      />

                      <Tooltip title="Отменить">
                        <IconButton onClick={() => store.onAddAssigneeCancelClick()}>
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                      :
                      <Tooltip title="Добавить исполнителья">
                        <IconButton disabled={props.isPopup} onClick={() => store.onAddAssign()}>
                          <CreateIcon />
                        </IconButton>
                      </Tooltip>}
                  </Grid>

                  <LegalObjectView
                    id={0}
                    openPanel={store.addAddresPopup}
                    onBtnCancelClick={() => store.changeAddresPopup(false)}
                    onSaveClick={() => {
                      store.changeAddresPopup(false)
                      store.loadLegalObjects()
                    }
                    }
                  />
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>

      <Box mt={1}>
        <Paper>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs scrollButtons={"auto"} variant="scrollable" value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={translate("label:legal_record_registryAddEditView.subject")} {...a11yProps(0)} />
              <Tab label={translate("label:legal_record_registryAddEditView.decision")} {...a11yProps(1)} />
              <Tab label={translate("label:legal_record_registryAddEditView.addition")} {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={2}>
            <RichTextEditor
              disabled={props.isPopup}
              id={"id_f_legal_record_registry_addition"}
              name={"addition"}
              value={store.addition}
              changeValue={(value, name) => store.handleChange({ target: { value: value, name: "addition" } })}
              style={{ height: 500, overflow: 'auto' }}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <RichTextEditor
              disabled={props.isPopup}
              id={"id_f_legal_record_registry_decision"}
              name={"decision"}
              value={store.decision}
              changeValue={(value, name) => store.handleChange({ target: { value: value, name: "decision" } })}
              style={{ height: 500, overflow: 'auto' }}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={0}>
            <RichTextEditor
              disabled={props.isPopup}
              id={"id_f_legal_record_registry_subject"}
              name={"subject"}
              value={store.subject}
              changeValue={(value, name) => store.handleChange({ target: { value: value, name: "subject" } })}
              style={{ height: 500, overflow: 'auto' }}
            />
          </CustomTabPanel>
        </Paper>
      </Box>
      {props.children}

    </Container>
  );
})

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default Baselegal_record_registryView;
