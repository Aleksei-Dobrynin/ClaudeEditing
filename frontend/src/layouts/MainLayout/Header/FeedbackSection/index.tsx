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
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { createFeedback } from "../../../../api/Feedback/useCreateFeedback";
import MainStore from "../../../../MainStore";
import i18n from "i18next";

const FeedbackSection = (props) => {
  const { t } = useTranslation();
  const translate = t;
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("");
    setFiles([]);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const previewFiles = uploadedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...previewFiles]);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const clipboardItems = event.clipboardData.items;
    const pastedFiles: { file: File; preview: string }[] = [];

    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        if (file) {
          pastedFiles.push({
            file,
            preview: URL.createObjectURL(file),
          });
        }
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...pastedFiles]);
  };

  const removeFile = (index) => {
    const fileToRemove = files[index];
    URL.revokeObjectURL(fileToRemove.preview);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("description", value);
    files.forEach(({ file }, index) => data.append(`files`, file));
    const response = await createFeedback(data);
    if (response.status === 200) {
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
    } else {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      throw new Error();
    }

    handleClose();
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
        <IconButton onClick={handleOpen} sx={{ borderRadius: "12px" }}>
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
            <FeedbackOutlinedIcon />
          </Avatar>
        </IconButton>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        onPaste={handlePaste}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {translate("label:FeedbackView.feedback")}
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
          <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  label={translate("label:FeedbackView.description")}
                  multiline
                  rows={4}
                  value={value}
                  onChange={handleChange}
                  id="description"
                  name="description" />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomButton
                  variant="contained"
                  fullWidth
                  sx={{ mb: 2 }}
                  onClick={handleButtonClick}
                >
                  {translate("label:FeedbackView.attach_files")}
                </CustomButton>
                <input type="file" hidden multiple ref={fileInputRef} onChange={handleFileUpload} />
              </Grid>
              <Grid item md={12} xs={12}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center">
                      {file.file.type.startsWith("image/") ? (
                        <img
                          src={file.preview}
                          alt={`preview-${index}`}
                          style={{
                            width: 150,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginRight: "10px",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            width: 150,
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "8px",
                            marginRight: "10px",
                            textAlign: "center",
                          }}
                        >
                          {file.file.name.split(".").pop()?.toUpperCase() || "FILE"}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "300px",
                        }}
                      >{file.file.name}</Typography>

                    </Box>
                    <IconButton size="small" onClick={() => removeFile(index)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <CustomButton
            onClick={handleSubmit}
            variant="contained"
            disabled={!value && files.length === 0}
          >
            {translate("create")}
          </CustomButton>
          <CustomButton
            onClick={handleClose}
            variant="contained"
          >
            {translate("cancel")}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeedbackSection;
