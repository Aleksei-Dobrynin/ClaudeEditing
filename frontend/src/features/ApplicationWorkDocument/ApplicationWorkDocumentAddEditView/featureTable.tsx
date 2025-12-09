import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const FeatureTable: React.FC<{
  features: GeoJSON.Feature[];
  onEdit: (updatedFeatures: GeoJSON.Feature[]) => void;
}> = ({ features, onEdit }) => {
  const [editableFeatures, setEditableFeatures] = useState(features);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCoordinates, setEditedCoordinates] = useState<string>("");
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    setEditableFeatures(features);
  }, [features]);

  const handleEditClick = (index: number, coordinates: string) => {
    setEditingIndex(index);
    setEditedCoordinates(coordinates);
  };

  const handleSaveClick = (index: number) => {
    const updatedFeatures = [...editableFeatures];
    const feature = updatedFeatures[index];
    try {
      const parsedCoordinates = JSON.parse(editedCoordinates);
      (feature.geometry as any).coordinates = parsedCoordinates;
      setEditableFeatures(updatedFeatures);
      onEdit(updatedFeatures);
    } catch (error) {
      console.error("Invalid JSON format for coordinates", error);
    }
    setEditingIndex(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>{translate('label:geometryFieldView.table_type')}</TableCell>
            <TableCell>{translate('label:geometryFieldView.table_coordinates')}</TableCell>
            <TableCell>{translate('label:geometryFieldView.table_actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editableFeatures.map((feature, index) => (
            <TableRow key={feature.id || index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{feature.geometry.type}</TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <TextField
                    value={editedCoordinates}
                    onChange={(e) => setEditedCoordinates(e.target.value)}
                    fullWidth
                  />
                ) : (
                  JSON.stringify((feature.geometry as any).coordinates)
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <IconButton onClick={() => handleSaveClick(index)}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() =>
                      handleEditClick(
                        index,
                        JSON.stringify((feature.geometry as any).coordinates)
                      )
                    }
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeatureTable;