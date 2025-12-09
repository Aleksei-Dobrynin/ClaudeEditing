import React, { FC } from "react";
import {
  Box,
  List,
  ListItem,
  Container,
  Grid,
  ListItemIcon,
  ListItemText,
  Typography,
  Checkbox,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type architecture_processTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const Basearchitecture_processView: FC<architecture_processTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>

        {/* <Grid item md={12} xs={12}>
          <LookUp
            value={store.status_id}
            onChange={(event) => store.handleChange(event)}
            name="status_id"
            data={store.architecture_statuses}
            id='id_f_architecture_process_status_id'
            label={translate('label:architecture_processAddEditView.status_id')}
            helperText={store.errors.status_id}
            error={!!store.errors.status_id}
          />
        </Grid> */}

        <Grid item md={12} xs={12}>
          <CustomTextField
            // helperText={store.erroroutgoing_number}
            // error={store.erroroutgoing_number != ""}
            id="id_f_ArchiveObject_dp_outgoing_number"
            label={translate("label:ArchiveObjectAddEditView.dp_outgoing_number")}
            value={store.dp_outgoing_number}
            onChange={(event) => {
              store.handleChange(event)
            }}
            name="dp_outgoing_number"
          />
        </Grid>

        <Grid item md={12} xs={12}>

          <Paper elevation={7} variant="outlined">
            <Card>
              <CardContent>

                <Box>
                  Выберите рабочие документы:
                </Box>
                <List>
                  {store.workDocuments.map(doc => {
                    return <ListItem key={doc.id} >
                      <ListItemIcon>
                        <Checkbox checked={store.workDocsChecked.find(x => x === doc.id)}
                          onChange={() => { store.onChangeCheckWork(doc.id) }} />
                      </ListItemIcon>
                      <ListItemText primary={`${doc.id_type_name ?? ""} - ${doc.file_name} (${doc.comment ?? ""})`} />
                    </ListItem>
                  })}
                </List>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item md={12} xs={12}>
          <Paper elevation={7} variant="outlined">
            <Card>
              <CardContent>
                <Box>
                  Выберите загруженные документы:
                </Box>
                <List>
                  {store.uploadedDocuments.map(doc => {
                    return <ListItem key={doc.id} >
                      <ListItemIcon>
                        <Checkbox checked={store.uploadedDocsChecked.find(x => x === doc.id)}
                          onChange={() => { store.onChangeCheckUpl(doc.id) }} />
                      </ListItemIcon>
                      <ListItemText primary={(doc.name != "" && doc.name != null) ? doc.name : doc.app_doc_name} />
                    </ListItem>
                  })}
                </List>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
})

export default Basearchitecture_processView;
