import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const FileViewer = ({ isOpen, fileUrl, fileType, onClose }) => {

  const handleClose = () => {
    onClose();
    setScale(1);
  }

  const [scale, setScale] = useState(1);
  const zoomIn = () => setScale((prev) => prev + 0.2);
  const zoomOut = () => setScale((prev) => Math.max(0.2, prev - 0.2));
  const resetZoom = () => setScale(1);

  return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogActions sx={{display: 'flex',  flexDirection: 'column', alignItems: 'flex-start', gap: 1, zIndex: 10, position: 'absolute', top: 8, right: 8 }}>
          <IconButton
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {fileType !== 'pdf' && (
            <>
              <IconButton onClick={zoomIn}><ZoomInIcon /></IconButton>
              <IconButton onClick={zoomOut}><ZoomOutIcon /></IconButton>
              <IconButton onClick={resetZoom}><ZoomOutMapIcon /></IconButton>
            </>
          )}
        </DialogActions>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
        {fileType === 'pdf' ? (
          <iframe src={fileUrl} width="100%" height="800px" style={{ border: 'none' }} />
        ) : (
          <img src={fileUrl} alt="Preview" style={{ maxWidth: '100%', height: 'auto', display: 'block', objectFit: 'contain', transform: `scale(${scale})` }} />
        )}
        </DialogContent>
      </Dialog>
  );
};

export default FileViewer;