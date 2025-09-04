import React, { FC, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Saved_application_documentPopupForm from './../saved_application_documentAddEditView/popupForm'
import styled from 'styled-components';
import LookUp from 'components/LookUp';
import CustomButton from 'components/Button';
import Basesaved_application_documentView from '../saved_application_documentAddEditView/base';
import BaseStore from './../saved_application_documentAddEditView/store'
import AutocompleteCustomer from "../../Application/ApplicationAddEditView/AutocompleteCustomer";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FileViewer from 'components/FileViewer';
import appStore from 'features/Application/ApplicationAddEditView/store';
import dayjs from "dayjs";
import printJS from "print-js";

type saved_application_documentListViewProps = {
  idMain: number;
};


const Saved_application_documentListView: FC<saved_application_documentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.handleChange({ target: { value: props.idMain, name: "application_id" } })
    store.loadS_DocumentTemplates()
    store.loadLanguages()
    return () => {
      store.clearStore()
    }
  }, [props.idMain])


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      <Paper elevation={7} sx={{ p: 5 }}>

        <Grid container spacing={2}>
          <Grid item md={12} xs={12} sx={{ display: "flex" }}>
            {store.Languages.map(lg => <Card key={`language-${lg.id}`} variant="outlined" sx={{ margin: 2, width: '100%' }}>
              <CardHeader sx={{ padding: 1 }}
                title={lg.name}
              />
              <CardContent sx={{ padding: 1 }}>
                {store.S_DocumentTemplates.map(item => {
                  const foundDocument = item.saved_application_documents?.find(x => x?.language_id === lg.id);
                  const hasDocument = item.saved_application_documents?.find(x => x?.language_id === lg.id && x?.file_id != null);
                  return (<Grid container item key={`template-${item.id}`} alignItems="center">
                    <Grid item xs={10} md={10}>
                      <Button
                        onClick={() => {
                          store.handleChange({ target: { name: "language_id", value: lg.id } })
                          store.handleChange({ target: { name: "template_id", value: item.id } })
                          store.getDocument();
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          color: foundDocument ? 'red' : 'black',
                          fontWeight: foundDocument ? 'bold' : 'normal'
                        }}
                        size="small"
                      >
                        {item.name}
                      </Button>
                    </Grid>

                    {foundDocument && <Grid item xs={1} md={1}>
                      <IconButton size="small" onClick={() => {
                        // store.deletesaved_application_document(foundDocument.id);
                        store.loadPrintedDocuments(foundDocument.id, foundDocument.language_id);
                      }} >
                        <HistoryIcon />
                      </IconButton>
                    </Grid>}
                    {hasDocument && <Grid item xs={1} md={1}>
                      <IconButton size='small' onClick={() => store.OpenFileFile(hasDocument.file_id, item.name + "test.pdf")}>
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </Grid>}
                  </Grid>);
                })}
              </CardContent>
            </Card>)}
          </Grid>

          <FileViewer
            isOpen={store.isOpenFileView}
            onClose={() => { store.isOpenFileView = false }}
            fileUrl={store.fileUrl}
            fileType={store.fileType} />
          {/*<Grid item md={4} xs={12}>*/}
          {/*  <LookUp*/}
          {/*    value={store.template_id}*/}
          {/*    onChange={(event) => store.handleChange(event)}*/}
          {/*    name="template_id"*/}
          {/*    data={store.S_DocumentTemplates}*/}
          {/*    id='id_f_saved_application_document_template_id'*/}
          {/*    label={translate('label:saved_application_documentAddEditView.template_id')}*/}
          {/*    helperText={""}*/}
          {/*    error={false}*/}
          {/*  />*/}
          {/*</Grid>*/}
          {/*<Grid item md={4} xs={12} display={"flex"} alignItems={"center"}>*/}

          {/*  <FormControl>*/}
          {/*    <FormLabel id="demo-row-radio-buttons-group-label">Язык</FormLabel>*/}
          {/*    <RadioGroup*/}
          {/*      row*/}
          {/*      aria-labelledby="demo-row-radio-buttons-group-label"*/}
          {/*      name="row-radio-buttons-group"*/}
          {/*      value={store.language_id}*/}
          {/*      onChange={(e) => store.handleChange({ target: { name: "language_id", value: e.target.value } })}*/}
          {/*    >*/}
          {/*      {store.Languages.map(x => {*/}
          {/*        return <FormControlLabel key={x.id} value={x.id} control={<Radio />} label={x.name} />*/}
          {/*      })}*/}

          {/*    </RadioGroup>*/}
          {/*  </FormControl>*/}
          {/*  <CustomButton variant='contained' sx={{ ml: 2 }}*/}
          {/*    onClick={() => store.getDocument()}*/}
          {/*    disabled={store.template_id == 0}*/}
          {/*  >*/}
          {/*    Выбрать*/}
          {/*  </CustomButton>*/}
          {/*</Grid>*/}
          {/*<Grid item md={4} xs={12}>*/}
          {/*</Grid>*/}
        </Grid>
      </Paper>

      {store.data && <Basesaved_application_documentView>

        <Box display="flex" justifyContent={"flex-end"} p={2}>


          <CustomButton
            variant="contained"
            sx={{ ml: 2 }}
            id="id_saved_application_documentSaveButton"
            name={'saved_application_documentAddEditView.save'}
            onClick={() => {
              // BaseStore.onSaveClick((id: number) => {
              // })
              BaseStore.printHtml()
            }}
          >
            {translate("common:print")}
          </CustomButton>
          {(appStore.is_electronic_only && (BaseStore.template_id == 26 || BaseStore.template_id == 9 || BaseStore.template_id == 10
            || BaseStore.template_id == 11 || BaseStore.template_id == 9 || BaseStore.template_id == 14 || BaseStore.template_id == 33
          )) &&
            <CustomButton
              variant="contained"
              sx={{ ml: 2 }}
              id="id_saved_application_documentSaveButton"
              name={'saved_application_documentAddEditView.save'}
              onClick={() => {
                BaseStore.signApplicationPayment();
                // BaseStore.onSaveClick((id: number) => {
                // })
              }}
            >
              {translate("Подписать и распечатать")}
            </CustomButton>
          }
        </Box>
      </Basesaved_application_documentView>}

      {store.isHistoryDialogOpen && (
        <Dialog open={store.isHistoryDialogOpen} onClose={store.closeHistoryDialog} maxWidth="sm" fullWidth>
        <PopupGrid
          title={t("История документов")}
          onDeleteClicked={(id: number) => {}}
          onEditClicked={(id: number) => {}}
          hideAddButton={true}
          hideActions={true}
          columns={[
            { field: 'template_name', headerName: t('label:saved_application_documentListView.template_name'), flex: 1 },
            { field: 'created_at', headerName: t('label:saved_application_documentListView.created_at'), flex: 1, renderCell: (param) => (
                <span>
          {param.row.created_at ? dayjs(param.row.created_at).format("DD.MM.YYYY HH:mm") : ""}
        </span>
              ) },
            {
              field: 'actions',
              headerName: t('common:actions'),
              renderCell: (params) => (
                <Button
                  size="small"
                  onClick={() => {
                    printJS({
                      printable: params.row.body,
                      type: 'raw-html',
                      targetStyles: ['*']
                    });
                  }
                }
                >
                  {t("Просмотреть")}
                </Button>
              ),
              flex: 1
            }
          ]}
          data={store.printedDocuments}
          tableName="Application"
        />
        </Dialog >
      )}

    </Container>
  );
})



export default Saved_application_documentListView
