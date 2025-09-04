import { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import CustomButton from "components/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CustomTextField from "components/TextField";
import IconButton from "@mui/material/IconButton";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { ListItem, List, Typography, ListItemButton, ListItemText, Paper, Card, CardContent, FormControlLabel, Checkbox } from "@mui/material";
import { useTranslation } from "react-i18next";
import { createFeedback } from "../../../../api/Feedback/useCreateFeedback";
import MainStore from "../../../../MainStore";
import i18n from "i18next";
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { observer } from "mobx-react";
import store from "./store";
import { release } from "os";
import dayjs from "dayjs";
import ReactPlayer from "react-player";
import { API_URL } from "constants/config";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ReleaseApproveSection = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const theme = useTheme();
  const isVideo = (file: any) => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];
    const extension = file?.file_name?.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension);
  };

  return (
    <>
      <Dialog
        open={store.openPanel}
        // onClose={() => store.changePanel(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 2, mt: 2 }}>Новый релиз №{store.release?.number}</Typography>
        </DialogTitle>
        <DialogContent>
          <Container maxWidth="xl" >
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>

                <Box>


                  <Paper elevation={7} variant="outlined" sx={{ mb: 2 }}>
                    <Card>
                      <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: store.release?.description ?? "" }} />
                        <br />
                        <br />
                        {store.release?.videos?.map(video => {
                          if (!isVideo(video)) {
                            return <Box key={video.id} sx={{ mb: 1 }}>
                              <img
                                src={`${API_URL}File/DownloadVideo?id=${video?.file_id}`}
                                alt="uploaded"
                                style={{ maxWidth: 600 }}
                                className="video-preview"
                              />
                            </Box>
                          }
                          return <Box key={video.id} sx={{ mb: 1 }}>
                            <ReactPlayer controls url={`${API_URL}File/DownloadVideo?id=${video?.file_id}`} />
                          </Box>
                        })}
                      </CardContent>
                    </Card>
                  </Paper>
                </Box>

              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions sx={{ pr: 5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={store.checked}
                onChange={(e) => store.handleChange({ target: { value: e.target.checked, name: 'checked' } })} />
            } label="ОЗНАКОМЛЕН"
          />

          <CustomButton
            onClick={() => store.approveRelease()}
            variant="contained"
            disabled={!store.checked}
          >
            {translate("Подтвердить")}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ReleaseApproveSection;
