import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import dayjs from "dayjs";
import GeometryField from "./geometryField";

interface Metadata {
  id: string;
  type: string;
  value: any;
  label: string;
  options?: any[];
}

interface RenderFormFieldProps {
  metadata: Metadata[];
  onFieldChange: (id: string, value: any) => void;
}

const RenderFormField: FC<RenderFormFieldProps> = ({ metadata, onFieldChange }) => {
  const { t } = useTranslation();
  const translate = t;

  const handleChange = (id: string, value: any) => {
    onFieldChange(id, value);
  };

  useEffect(() => {
  }, [metadata]);

  return (
    <Grid container spacing={3}>
      {metadata.map((m) => (
        <Grid item md={12} xs={12} key={m.id}>
          {(() => {
            switch (m.type) {
              case "datetime":
                return (
                  <DateTimeField
                    onChange={(event) => handleChange(m.id, event.target.value)}
                    name="value"
                    id={`id_f_${m.id}`}
                    value={m.value ? dayjs(m.value) : null}
                    label={translate(m.label)}
                    helperText=""
                    error={false}
                  />
                );
              case "boolean":
                return (
                  <CustomCheckbox
                    onChange={(event) => {
                      handleChange(m.id, event.target.value);
                    }}
                    name="value"
                    id={`id_f_${m.id}`}
                    value={m.value}
                    label={translate(m.label)}
                  />
                );
              case "lookup":
                return (
                  <LookUp
                    value={m.value}
                    onChange={(event) => handleChange(m.id, event.target.value)}
                    name="value"
                    id={`id_f_${m.id}`}
                    fieldNameDisplay={(field) => field[`label`]}
                    data={m.options || []}
                    label={translate(m.label)}
                    helperText=""
                    error={false}
                  />
                );
              case "geometry":
                return (
                  <GeometryField
                    value={m.value}
                    onChange={(event) => handleChange(m.id, event)}
                  />
                );
              default:
                return (
                  <CustomTextField
                    id={`id_f_${m.id}`}
                    label={translate(m.label)}
                    onChange={(event) => handleChange(m.id, event.target.value)}
                    name="value"
                    value={m.value || ""}
                  />
                );
            }
          })()}
        </Grid>
      ))}
    </Grid>
  );
};

export default RenderFormField;
