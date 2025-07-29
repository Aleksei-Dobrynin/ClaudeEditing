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
  Button,
  Divider,
  alpha,
  styled,
  Fade,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Alert,
  AlertTitle
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import mainStore from "../../../../../MainStore";
import { SelectOrgStructureForWorklofw } from "constants/constant";
import Saved_application_documentListView from "../../../../saved_application_document/saved_application_documentListView";
import {
  Print,
  Description,
  Check,
  Security,
  GetApp,
  Visibility,
  CheckCircle,
  PictureAsPdf,
  Assignment
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

const PreviewSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
  fontWeight: 500,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  }
}));

const DocumentItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main,
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
  const [documentsReady, setDocumentsReady] = useState(false);

  useEffect(() => {
  }, [store.errorcustomer_id, store.errorarch_object_id, store.errorservice_id]);
  
  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
  }, [store.customer_id]);
  
  useEffect(() => {
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) && store.Statuses.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  // Mock data for preview with safe access
  const applicationData = {
    service: store.Services?.find(s => s.id === store.service_id)?.name || "",
    customer: store.customer?.full_name || 
      (store.customer ? `${store.customer.individual_surname || ""} ${store.customer.individual_name || ""}`.trim() : ""),
    workDescription: store.work_description || "",
    status: store.Statuses?.find(s => s.id === store.status_id)?.name || "В обработке"
  };

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Status Section */}
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>{translate("common:success")}</AlertTitle>
          <Typography variant="body2">
            {translate("label:ApplicationAddEditView.steps_review")}
          </Typography>
        </Alert>

        {/* Preview Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <Visibility />
              {translate("common:preview")}
            </SectionTitle>

            <PreviewSection elevation={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {translate("label:ApplicationAddEditView.service_id")}
                  </Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    {applicationData.service}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {translate("label:ApplicationAddEditView.customer_id")}
                  </Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    {applicationData.customer}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {translate("label:ApplicationAddEditView.work_description")}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {applicationData.workDescription || "-"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translate("label:ApplicationAddEditView.Status")}:
                    </Typography>
                    <Chip 
                      label={applicationData.status}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </PreviewSection>
          </CardContent>
        </StyledCard>

        {/* Documents for Print/Sign Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <PictureAsPdf />
              {translate("label:ApplicationAddEditView.TabName_saved_document")}
            </SectionTitle>

            <Box>
              <Saved_application_documentListView 
                idMain={Number(id)} 
                templateCodeFilter={["statement", "confirm"]} 
              />
            </Box>
          </CardContent>
        </StyledCard>

        {/* Action Instructions */}
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>{translate("common:info")}</AlertTitle>
          {translate("label:ApplicationAddEditView.only_electronic")}
        </Alert>

        {/* Digital Signature Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <Security />
              {translate("common:digital_signature")}
            </SectionTitle>

            <Box display="flex" gap={2} mt={3}>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<Security />}
                onClick={() => {
                  // Handle digital signature
                }}
                disabled={!documentsReady}
              >
                {translate("common:sign")}
              </ActionButton>

              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<GetApp />}
                onClick={() => {
                  // Handle download all
                }}
              >
                {translate("common:download")}
              </ActionButton>
            </Box>

            {documentsReady && (
              <Alert severity="success" sx={{ mt: 3, borderRadius: 1.5 }}>
                {translate("common:success")}
              </Alert>
            )}
          </CardContent>
        </StyledCard>
      </Box>
    </Fade>
  );
});

export default BaseView;