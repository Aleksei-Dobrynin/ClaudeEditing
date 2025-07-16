import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import Ckeditor from "components/ckeditor/ckeditor";
import VideoUploader from "./files";

type releaseTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BasereleaseView: FC<releaseTableProps> = observer((props) => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const translate = t;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <form data-testid="releaseForm" id="releaseForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="release_TitleName">
                  {translate('label:releaseAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.number}
                      onChange={(event) => store.handleChange(event)}
                      name="number"
                      data-testid="id_f_release_number"
                      id='id_f_release_number'
                      label={translate('label:releaseAddEditView.number')}
                      helperText={store.errors.number}
                      error={!!store.errors.number}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_release_code"
                      id='id_f_release_code'
                      label={translate('label:releaseAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date_start}
                      onChange={(event) => store.handleChange(event)}
                      name="date_start"
                      id='id_f_release_date_start'
                      label={translate('label:releaseAddEditView.date_start')}
                      helperText={store.errors.date_start}
                      error={!!store.errors.date_start}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        <Grid item md={6}>
          <VideoUploader onUpload={(files: File[]) => {
            store.files = files
          }}
            media_files={store.videos}
            deleteMedia={(id: number) => {
              store.deleteVideo(id)
            }}
          />
        </Grid>
        {props.children}
      </Grid>
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

export default BasereleaseView;
