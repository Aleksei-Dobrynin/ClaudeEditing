import React from "react";
import { Box, Chip, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import store from "./store";
import { observer } from "mobx-react";


const FileField = observer(({ error, fieldName, inputKey, onClear, onChange, ...rest }) => {

  return (
    // hasRole ? "" :
    <>
      <Box>
        {store.File?.map((item, index) => {
          return (
             <Chip
               key={index}
               onDelete={()=>store.handleDeleteFile(item.file.name)}
               label={item?.file?.name}
             />
          )
        })}
      </Box>
      <TextField
        {...rest}
        error={error}
        size={"small"}
        variant={"outlined"}
        fullWidth

        InputProps={{
          endAdornment:
            <div>
              <input
                style={{ display: "none" }}
                onChange={(ev) => {
                  if (fieldName != null) {
                    ev.target.name = fieldName;
                  }
                  onChange(ev);
                }}
                hidden={true}
                id={rest.idFile != null ? rest.idFile : "raised-button-file"}
                multiple
                key={inputKey}
                type="file"
              />
              <div style={{ display: "flex" }}>
                <Box display="flex">
                  <label htmlFor={rest.idFile != null ? rest.idFile : "raised-button-file"}
                         style={{ marginLeft: "10px", marginRight: "10px" }}>
                    <CloudUploadIcon style={{ cursor: "pointer" }} />
                  </label>
                  <ClearIcon style={{ cursor: "pointer" }} onClick={() => {
                    onClear();
                    console.log(store.idDocumentinputKey);
                  }} />
                </Box>
              </div>
            </div>
        }}
      />

    </>
  );
})

export default FileField;
