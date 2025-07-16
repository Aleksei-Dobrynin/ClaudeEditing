import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const FileViewer = ({ isOpen, fileUrl, fileType, onClose }) => {

  const handleClose = () => {
    onClose();
  }

  return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
        {fileType === 'pdf' ? (
          <iframe src={fileUrl} width="100%" height="800px" style={{ border: 'none' }} />
        ) : (
          <img src={fileUrl} alt="Preview" style={{ maxWidth: '100%' }} />
        )}
        </DialogContent>
      </Dialog>
  );
};

export default FileViewer;