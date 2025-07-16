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
// Added
import AutocompleteCustom from "components/Autocomplete";
import CreateIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import TreeLookUp from "components/TreeLookup";

import RichTextEditor from "components/richtexteditor/RichTextWithTabs";
import LegalObjectView from "../../legal_object/legal_objectAddEditView/popupForm";

type legal_act_registryTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Baselegal_act_registryView: FC<legal_act_registryTableProps> = observer((props) => {

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
          <form data-testid="legal_act_registryForm" id="legal_act_registryForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="legal_act_registry_TitleName">
                  {translate('label:legal_act_registryAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {/* Existing Code (Do Not Modify) */}
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      disabled={props.isPopup}
                      value={store.act_number}
                      onChange={(event) => store.handleChange(event)}
                      name="act_number"
                      data-testid="id_f_legal_act_registry_act_number"
                      id='id_f_legal_act_registry_act_number'
                      label={translate('label:legal_act_registryAddEditView.act_number')}
                      helperText={store.errors.act_number}
                      error={!!store.errors.act_number}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DateTimeField
                      disabled={props.isPopup}
                      value={store.date_issue}
                      onChange={(event) => store.handleChange(event)}
                      name="date_issue"
                      id='id_f_legal_act_registry_date_issue'
                      label={translate('label:legal_act_registryAddEditView.date_issue')}
                      helperText={store.errors.date_issue}
                      error={!!store.errors.date_issue}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      disabled={props.isPopup}
                      value={store.act_type}
                      onChange={(event) => store.handleChange(event)}
                      name="act_type"
                      data-testid="id_f_legal_act_registry_act_type"
                      id='id_f_legal_act_registry_act_type'
                      label={translate('label:legal_act_registryAddEditView.act_type')}
                      helperText={store.errors.act_type}
                      error={!!store.errors.act_type}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <LookUp
                      disabled={props.isPopup}
                      value={store.id_status}
                      onChange={(event) => store.handleChange(event)}
                      name="id_status"
                      data={store.legal_act_registry_statuses}
                      id='id_f_legal_act_registry_id_status'
                      label={translate('label:legal_act_registryAddEditView.id_status')}
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
                        name="LegalObjects"
                        displayField="address"
                        data={store.LegalObjects}
                        label={translate("label:legal_act_registryAddEditView.LegalObjects")}
                      />
                      <Tooltip title={translate("Добавить новый объект")}>
                        <IconButton onClick={() => store.changeAddresPopup(true)}>
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
                        label={translate('label:legal_act_registryAddEditView.structure_employee_id')}
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
                    onSaveClick={async (id) => {
                      store.changeAddresPopup(false)
                      await store.loadLegalObjects()
                      store.id_LegalObjects?.push(id);
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
              <Tab label={translate("label:legal_act_registryAddEditView.subject")} {...a11yProps(0)} />
              <Tab label={translate("label:legal_act_registryAddEditView.decision")} {...a11yProps(1)} />
              <Tab label={translate("label:legal_act_registryAddEditView.addition")} {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={2}>
            <RichTextEditor
              disabled={props.isPopup}
              id={"id_f_legal_act_registry_addition"}
              name={"addition"}
              value={store.addition}
              changeValue={(value, name) => store.handleChange({ target: { value: value, name: "addition" } })}
              style={{ height: 500, overflow: 'auto' }}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <RichTextEditor
              disabled={props.isPopup}
              id={"id_f_legal_act_registry_decision"}
              name={"decision"}
              value={store.decision}
              changeValue={(value, name) => store.handleChange({ target: { value: value, name: "decision" } })}
              style={{ height: 500, overflow: 'auto' }}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={0}>
            <RichTextEditor
              disabled={props.isPopup}
              id={"id_f_legal_act_registry_subject"}
              name={"subject"}
              value={store.subject}
              changeValue={(value, name) => store.handleChange({ target: { value: value, name: "subject" } })}
              style={{ height: 500, overflow: 'auto' }}
            />
          </CustomTabPanel>
        </Paper>
      </Box>
      {props.children}

    </Container >
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

export default Baselegal_act_registryView;
