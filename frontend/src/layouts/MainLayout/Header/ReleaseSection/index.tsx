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
import CustomTextField from "components/TextField_OLD";
import IconButton from "@mui/material/IconButton";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { ListItem, List, Typography, ListItemButton, ListItemText, Paper, Card, CardContent, Tooltip } from "@mui/material";
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
import FactCheckIcon from '@mui/icons-material/FactCheck'

const ReleaseSection = observer(() => {
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
      <Box
        sx={{
          [theme.breakpoints.down("md")]: {
            mr: 2
          }
        }}
      >
        <Tooltip title="История обновлений">
          <IconButton onClick={() => store.changePanel(true)} sx={{ borderRadius: "12px" }}>
            <Avatar
              variant="rounded"
              sx={{
                transition: "all .2s ease-in-out",
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                "&:hover": {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light
                }
              }}
            >
              <FactCheckIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box >
      <Dialog
        open={store.openPanel}
        onClose={() => store.changePanel(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {translate("Список релизов")}
          <IconButton
            aria-label="close"
            onClick={() => store.changePanel(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container maxWidth="xl" >
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>

                {store.release ? <Box>

                  <CustomButton startIcon={<ArrowBackIcon />} onClick={() => store.backClicked()} size="small" variant="outlined">
                    Назад
                  </CustomButton>

                  <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 2, mt: 2 }}>Релиз №{store.release.number}</Typography>

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
                </Box> :
                  <Box>
                    {store.data.map((release, i) => {
                      return <Paper key={release.id} elevation={7} variant="outlined" sx={{ mb: 2 }}>
                        <Card>
                          <CardContent>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                              <Box>
                                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>№ {release.number}</Typography>
                              </Box>
                              <Box>
                                {release.date_start ? dayjs(release.date_start).format("DD.MM.YYYY HH:mm") : ""}
                              </Box>
                              <Box>
                                <CustomButton
                                  onClick={() => store.loadrelease(release.id)}
                                  variant="outlined"
                                  size="small"
                                >
                                  Посмотреть изменения
                                </CustomButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Paper>
                    })}
                  </Box>}

                {/* <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {[0, 1, 2, 3].map((value) => {
                    const labelId = `checkbox-list-label-${value}`;

                    return (
                      <ListItem
                        key={value}
                        disablePadding
                      >
                        <ListItemButton role={undefined} onClick={() => { }} dense>
                          <ListItemText id={labelId} secondary={'fsldf'} primary={`Line item ${value + 1}`} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List> */}

              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <CustomButton
            onClick={() => store.changePanel(false)}
            variant="contained"
          >
            {translate("close")}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ReleaseSection;
