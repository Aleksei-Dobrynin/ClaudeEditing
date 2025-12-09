import { FC, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import Uploaded_application_documentPopupForm from '../uploaded_application_documentAddEditView/popupForm'
import UploadDocumentModal from '../uploaded_application_documentAddEditView/UploadDocumentModal'
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import FileViewer from "../../../components/FileViewer";
import A4Preview from "./A4Preview";
import AttachFromOldDocuments from '../AttachFromOldDocuments';


type Outgoing_uploaded_application_documentListViewProps = {
  idMain: number;
  hideGrid?: boolean;
  columns?: number; // Optional prop for number of columns
};

const FieldWithLabel: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: 'block', mb: 0.3, fontSize: '0.7rem' }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

const OutgoingDocumentCard: FC<{
  document: any;
  translate: any;
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>, typeCode: string) => void;
}> = ({ document, translate, onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getUploadTooltip = () => {
    if (document.upload_id) return "Заменить";
    // if (["dogovor", "raspiska", "invoice"].includes(document.type_code)) {
    //   return "Сгенерировать из шаблона";
    // }
    return "Загрузить";
  };

  return (
    <Card
      elevation={2}
      sx={{
        width: '100%',
        height: '100%',
        transition: 'all 0.3s ease',
        backgroundColor: '#FAFBFC',
        border: '1px solid',
        borderColor: 'grey.300',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          borderColor: 'primary.main',
          backgroundColor: 'white',
        }
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          backgroundColor: 'primary.50',
          borderBottom: '2px solid',
          borderColor: 'primary.100',
          px: 2,
          py: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'primary.dark',
          }}
          title={document.doc_name}
          data-testid="table_uploaded_application_document_column_doc_name"
        >
          {document.doc_name}
        </Typography>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Left Column - Document Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={1.5}>

              <FieldWithLabel label={translate("label:uploaded_application_documentListView.download_status")}>
                <Box display="flex" alignItems="center" gap={0.5}>

                  <Chip
                    label={document.upload_id ? (document.file_id ? 'Загружен' : "Принят") : "Не загружен"}
                    size="small"
                    color={document.upload_id ? (document.file_id ? 'success' : "info") : "error"}
                    sx={{ height: '20px', fontSize: '0.7rem' }}
                  />
                  <Tooltip title={getUploadTooltip()}>
                    <IconButton
                      size='small'
                      sx={{ padding: '4px' }}
                      onClick={(e) => {
                        // if (["dogovor", "raspiska", "invoice"].includes(document.type_code)) {
                        //   onMenuClick(e, document.type_code);
                        // } else {
                          store.uploadFile(document.id, document.upload_id);
                        // }
                      }}
                    >
                      <FileUploadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </FieldWithLabel>


              {document.created_at && (
                <FieldWithLabel label={translate("label:uploaded_application_documentListView.created_at")}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {document.created_at ? dayjs(document.created_at).format('DD.MM.YYYY HH:mm') : "-"}
                  </Typography>
                </FieldWithLabel>
              )}
            </Stack>
          </Grid>

          {/* Middle Column - File and Status */}
          <Grid item xs={12} md={4}>
            <Stack spacing={1.5}>

              <FieldWithLabel label={translate("label:uploaded_application_documentListView.file_name")}>
                {document.file_name ? (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0.5
                      }}
                      title={document.file_name}
                    >
                      {document.file_name}
                    </Typography>

                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    -
                  </Typography>
                )}
              </FieldWithLabel>
              {document.status_name && (
                <FieldWithLabel label={translate("label:uploaded_application_documentListView.status_name")}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '0.8rem' }}>
                    {document.status_name}
                  </Typography>
                </FieldWithLabel>
              )}


            </Stack>
          </Grid>

          {/* Right Column - Actions */}
          <Grid item xs={12} md={4}>
            <Stack spacing={1.5}>

              <FieldWithLabel label={translate("label:uploaded_application_documentListView.file_actions")}>
                <Box display="flex" gap={0.5}>
                  <Tooltip title={translate("label:uploaded_application_documentListView.lastUploads")}>
                    <IconButton
                      size='small'
                      sx={{ padding: '4px' }}
                      onClick={() => store.attachClicked(document.app_doc_id, document.service_document_id, document.upload_id)}
                    >
                      <AttachFileIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {document.file_id && (
                    <Tooltip title={"Скачать"}>
                      <IconButton
                        size='small'
                        sx={{ padding: '4px' }}
                        onClick={() => store.downloadFile(document.file_id, document.file_name)}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {(document.file_id && store.checkFile(document.file_name)) && (
                    <Tooltip title={translate("view")}>
                      <IconButton
                        size='small'
                        sx={{ padding: '4px' }}
                        onClick={() => store.OpenFileFile(document.file_id, document.file_name)}
                      >
                        <RemoveRedEyeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

              </FieldWithLabel>
              {document.file_id &&
                <FieldWithLabel label={translate("ЭЦП")}>
                  <Box display="flex" gap={0.5}>
                    <Tooltip title={translate("Подписать")}>
                      <IconButton
                        disabled={!document.file_id}
                        size='small'
                        sx={{ padding: '4px' }}
                        onClick={() => store.signApplicationPayment(document.file_id, 0, () => { })}
                      >
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={translate("Подписавшие")}>
                      <IconButton
                        disabled={!document.file_id}
                        size='small'
                        sx={{ padding: '4px' }}
                        onClick={() => {
                          store.ecpListOpen = true;
                          store.loadGetSignByFileId(document.file_id)
                        }}
                      >
                        <ChecklistIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </FieldWithLabel>
              }


            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const Outgoing_Uploaded_application_documentListView: FC<Outgoing_uploaded_application_documentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.down('lg'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, typeCode: string) => {
    store.currentTemplateCode = typeCode;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    if (props.hideGrid) return;
    store.loaduploaded_application_documents()
    return () => store.clearStore()
  }, [props.idMain])

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (props.hideGrid) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 4,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <AttachFromOldDocuments
        openPanel={store.openPanelAttachFromOtherDoc}
        onBtnCancelClick={() => store.closePanelAttach()}
        onSaveClick={() => {
          store.closePanelAttach()
          store.loaduploaded_application_documents()
        }}
        idApplicationDocument={store.idDocumentAttach}
        service_document_id={store.service_document_id}
        uploadedId={store.uploadedDocId}
        idApplication={store.idMain}
      />
      {/* Header */}
      <Box mb={3}>
        <Typography
          variant="h5"
          component="h1"
        >
          {translate("label:uploaded_application_documentListView.outgoing_entityTitle")}
        </Typography>
      </Box>

      {/* Cards Container with Background */}
      <Box
        sx={{
          backgroundColor: '#F5F7FA',
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
          p: 3,
          minHeight: 200,
        }}
      >
        {/* Cards Grid */}
        {store.outgoingData.length > 0 ? (
          <Grid container spacing={2}>
            {store.outgoingData.map((document: any) => {
              // Calculate grid sizes based on columns prop
              const gridSizes = {
                xs: 12,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6
              }

              return (
                <Grid
                  item
                  {...gridSizes}
                  key={document.id}
                >
                  <OutgoingDocumentCard
                    document={document}
                    translate={translate}
                    onMenuClick={handleClick}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          /* Empty State */
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={150}
          >
            <Typography variant="body1" color="text.secondary">
              {translate("common:noDocumentsFound")}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Language Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={async () => {
          handleClose();
          let template = "";
          if (store.currentTemplateCode == "dogovor") {
            template = "individual_agreement";
          }
          if (store.currentTemplateCode == "raspiska") {
            template = "raspiska";
          }
          if (store.currentTemplateCode == "invoice") {
            template = "invoice_for_payment";
          }
          await store.getHtmlTemplate(template, { application_id: store.idMain }, "ky")
        }}>Кыргызский</MenuItem>

        <MenuItem onClick={async (e) => {
          handleClose();
          let template = "";
          if (store.currentTemplateCode == "dogovor") {
            template = "individual_agreement";
          }
          if (store.currentTemplateCode == "raspiska") {
            template = "raspiska";
          }
          if (store.currentTemplateCode == "invoice") {
            template = "invoice_for_payment";
          }
          await store.getHtmlTemplate(template, { application_id: store.idMain }, "ru")
        }}>Русский</MenuItem>
      </Menu>

      {/* Dialogs and Popups */}
      {/* <Uploaded_application_documentPopupForm
        openPanel={store.openPanel}
        is_outgoing={true}
        step_id={store.step_id}
        application_document_id={store.idMain}
        service_document_id={store.service_document_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loaduploaded_application_documents()
          if (store.onUploadSaved) {
            store.onUploadSaved()
          }
        }}
      /> */}

      <UploadDocumentModal
        openPanel={store.openPanel}
        is_outgoing={true}
        step_id={store.step_id}
        application_document_id={store.idMain}
        service_document_id={store.service_document_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loaduploaded_application_documents()
          if (store.onUploadSaved) {
            store.onUploadSaved()
          }
        }}
      />

      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => { store.isOpenFileView = false }}
        fileUrl={store.fileUrl}
        fileType={store.fileType}
      />

      {/* Document Preview Dialog */}
      <Dialog
        open={store.docPreviewOpen}
        onClose={() => { store.docPreviewOpen = false; }}
        maxWidth="xl"
        fullWidth
      >
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={() => { store.docPreviewOpen = false; }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <A4Preview htmlString={store.htmlContent} code={store.currentTemplateCode} />
        </DialogContent>
      </Dialog>

      {/* ECP List Dialog */}
      <Dialog
        open={store.ecpListOpen}
        onClose={() => { store.ecpListOpen = false; }}
        maxWidth="md"
        fullWidth
      >
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={() => { store.ecpListOpen = false; }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ justifyItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Список подписавших документ
          </Typography>
          <Box sx={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: theme.palette.grey[100], borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>
                    ФИО
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>
                    Отдел
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>
                    Дата подписания
                  </th>
                </tr>
              </thead>
              <tbody>
                {store.signData.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'white' : theme.palette.grey[50],
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.palette.action.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : theme.palette.grey[50]}
                  >
                    <td style={{ padding: '16px 12px', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.employee_fullname || 'Не указано'}
                      </Typography>
                    </td>
                    <td style={{ padding: '16px 12px', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="body2" color="text.secondary">
                        {row.structure_fullname || 'Не указано'}
                      </Typography>
                    </td>
                    <td style={{ padding: '16px 12px', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {formatDateTime(row.timestamp)}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>


  );
})

export default Outgoing_Uploaded_application_documentListView