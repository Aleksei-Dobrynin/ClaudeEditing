import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  Link
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import { 
  AccountTree as TreeIcon, 
  CallSplit as SplitIcon,
  ArrowUpward as ParentIcon,
  ArrowDownward as ChildIcon
} from "@mui/icons-material";

interface DivisionHistoryProps {
  onObjectClick?: (id: number) => void;
}

const DivisionHistory: FC<DivisionHistoryProps> = observer(({ onObjectClick }) => {
  const { t } = useTranslation();

  // Если нет ни родительского объекта, ни разделенных объектов, не показываем компонент
  if (!store.parentObject && store.dividedObjects.length === 0) {
    return null;
  }

  const handleObjectClick = (id: number) => {
    if (onObjectClick) {
      onObjectClick(id);
    } else {
      // По умолчанию переходим на страницу объекта
      window.open(`/user/ArchiveObject/addedit?id=${id}`, '_blank');
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader 
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <TreeIcon color="primary" />
            <Typography variant="h6">
              История разделения объекта
            </Typography>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        {/* Родительский объект */}
        {store.parentObject && (
          <Box mb={2}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <ParentIcon color="secondary" fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Разделен из объекта:
              </Typography>
            </Box>
            <Card 
              variant="outlined" 
              sx={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
                '&:hover': { 
                  bgcolor: 'action.hover',
                  boxShadow: 2,
                  transform: 'translateY(-1px)'
                } 
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box 
                  onClick={() => handleObjectClick(store.parentObject!.id)}
                  sx={{ textDecoration: 'none' }}
                >
                  <Typography variant="body2" fontWeight="medium" color="primary">
                    {store.parentObject.doc_number}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {store.parentObject.address}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Разделенные объекты */}
        {store.dividedObjects.length > 0 && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <ChildIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Разделен на объекты ({store.dividedObjects.length}):
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {store.dividedObjects.map((obj, index) => (
                <Card 
                  key={obj.id}
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: 'action.hover',
                      boxShadow: 2,
                      transform: 'translateY(-1px)'
                    }
                  }}
                  onClick={() => handleObjectClick(obj.id)}
                >
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box flex={1} sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          {obj.doc_number}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {obj.address}
                        </Typography>
                        {obj.created_at && (
                          <Typography variant="caption" color="text.secondary">
                            Создан: {new Date(obj.created_at).toLocaleDateString('ru-RU')}
                          </Typography>
                        )}
                      </Box>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ ml: 1, flexShrink: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Информационное сообщение */}
        <Box mt={2} p={1} bgcolor="grey.50" borderRadius={1}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <SplitIcon fontSize="small" />
            Нажмите на объект для перехода к его просмотру
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

export default DivisionHistory;