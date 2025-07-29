import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Paper,
  Divider,
  alpha,
  styled,
  Fade,
  Chip,
  Alert,
  useTheme
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import mainStore from "../../../../../MainStore";
import Uploaded_application_documentListView from "../../../../UploadedApplicationDocument/uploaded_application_documentListView";
import Outgoing_Uploaded_application_documentListGridView from "../../../../UploadedApplicationDocument/uploaded_application_documentListView/index_outgoing_grid";
import ApplicationWorkDocumentListView from "../../../../ApplicationWorkDocument/ApplicationWorkDocumentListView";
import {
  CloudUpload,
  FileUpload,
  Description,
  Assignment,
  Folder,
  AttachFile
} from "@mui/icons-material";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  marginBottom: theme.spacing(3),
  "&:hover": {
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const DocumentSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    background: theme.palette.primary.main,
  }
}));

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const { t } = useTranslation();
  const translate = t;
  const theme = useTheme();

  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
  }, [store.customer_id]);

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Info Section */}
        <Box sx={{ mb: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              {translate("label:ApplicationAddEditView.TabName_documents")}
            </Typography>
          </Alert>
        </Box>

        {/* Incoming Documents Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <FileUpload />
              {translate("label:ApplicationAddEditView.TabName_documents")}
            </SectionTitle>


            <DocumentSection elevation={0}>
              <Uploaded_application_documentListView idMain={Number(id)} />
            </DocumentSection>
          </CardContent>
        </StyledCard>

        {/* Outgoing Documents Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <Assignment />
              {translate("label:ApplicationAddEditView.TabName_documents")}
            </SectionTitle>

            <DocumentSection elevation={0}>
              <Outgoing_Uploaded_application_documentListGridView idMain={Number(id)} />
            </DocumentSection>
          </CardContent>
        </StyledCard>

        {/* Work Documents Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <Folder />
              {translate("label:ApplicationAddEditView.TabName_documents")}
            </SectionTitle>

            <DocumentSection elevation={0}>
              <ApplicationWorkDocumentListView idApplication={Number(id)} />
            </DocumentSection>
          </CardContent>
        </StyledCard>

        {/* Upload Zone - показываем только если нет документов */}
        {false && ( // Условие можно изменить в зависимости от логики
          <Box sx={{ p: 3, textAlign: "center", border: "2px dashed #ccc", borderRadius: 2 }}>
            <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {translate("common:drag_drop_files")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {translate("common:or_click_to_browse")}
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
});

export default BaseView;