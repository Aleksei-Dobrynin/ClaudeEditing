// Путь: frontend/src/features/UploadedApplicationDocument/uploaded_application_documentListView/ApprovalGroupCard.tsx

import React from 'react';
import { Box, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import { 
  DocumentApproval, 
  formatApprovalDate,
  formatAssignedApprovers,
  hasAssignedApprovers,
  getAssignedApproversTooltip
} from '../utils/approvalHelpers';

interface ApprovalGroupCardProps {
  /** Номер группы для отображения */
  displayNumber: number;
  
  /** Массив подписантов в группе */
  approvals: DocumentApproval[];
  
  /** Функция перевода (i18n) */
  t: (key: string) => string;
}

/**
 * Компонент для отображения одной группы подписантов
 * Подписанты с одинаковым order_number отображаются внутри одной рамки
 */
export const ApprovalGroupCard: React.FC<ApprovalGroupCardProps> = ({
  displayNumber,
  approvals,
  t
}) => {
  // Определяем статус всей группы
  const allSigned = approvals.every(a => a.status === 'signed');
  const anySigned = approvals.some(a => a.status === 'signed');
  const anyRejected = approvals.some(a => a.status === 'rejected');
  const hasComments = approvals.some(a => 
    a.approval_comments && a.approval_comments.length > 0
  );
  
  /**
   * Определяет цвет границы группы на основе статусов
   */
  const getBorderColor = (): string => {
    if (anyRejected) return '#f44336';
    if (allSigned) return '#66bb6a';
    if (hasComments) return '#ffa726';
    if (anySigned) return '#42a5f5';
    return '#e0e0e0';
  };

  /**
   * Определяет цвет фона группы
   */
  const getBackgroundColor = (): string => {
    if (anyRejected) return '#ffebee';
    if (allSigned) return '#e8f5e9';
    if (hasComments) return '#fff3e0';
    if (anySigned) return '#e3f2fd';
    return '#fafafa';
  };

  /**
   * Определяет цвет номера группы
   */
  const getNumberBgColor = (): string => {
    if (anyRejected) return '#f44336';
    if (allSigned) return '#66bb6a';
    if (hasComments) return '#ffa726';
    if (anySigned) return '#42a5f5';
    return '#bdbdbd';
  };

  /**
   * Получает текст статуса для отдельного подписанта
   */
  const getApprovalStatusText = (approval: DocumentApproval): string => {
    switch (approval.status) {
      case 'signed':
        return t('signed') || 'Подписано';
      case 'rejected':
        return t('rejected') || 'Отклонено';
      case 'has_comments':
        return t('has_comments') || 'Есть замечания';
      case 'waiting':
      default:
        return t('waiting') || 'Ожидает';
    }
  };

  /**
   * Получает цвет чипа статуса
   */
  const getStatusChipColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'signed':
        return 'success';
      case 'rejected':
        return 'error';
      case 'has_comments':
        return 'warning';
      default:
        return 'default';
    }
  };

  // ОТЛАДКА: логируем данные
  console.log('ApprovalGroupCard - displayNumber:', displayNumber);
  console.log('ApprovalGroupCard - approvals:', approvals);
  approvals.forEach((approval, idx) => {
    console.log(`  Approval ${idx}:`, {
      id: approval.id,
      department: approval.department_name,
      position: approval.position_name,
      assigned_approvers: approval.assigned_approvers,
      hasAssigned: hasAssignedApprovers(approval)
    });
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 2,
        marginBottom: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(4px)'
        }
      }}
    >
      {/* Номер слева */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            backgroundColor: getNumberBgColor(),
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '3px solid #fff',
            transition: 'all 0.3s ease'
          }}
        >
          {displayNumber}
        </Box>
      </Box>

      {/* Основной блок справа */}
      <Box
        sx={{
          flex: 1,
          border: `2px solid ${getBorderColor()}`,
          borderRadius: '12px',
          backgroundColor: getBackgroundColor(),
          padding: 2.5,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        }}
      >
        {/* Заголовок группы */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {approvals.length > 1 
              ? `Параллельное подписание (${approvals.length} ${approvals.length === 1 ? 'подписант' : 'подписантов'})`
              : 'Этап подписания'
            }
          </Typography>
        </Box>

        {/* Список подписантов в группе */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {approvals.map((approval) => {
            const hasApprovalComments = approval.approval_comments && approval.approval_comments.length > 0;
            const hasAssigned = hasAssignedApprovers(approval);
            
            console.log(`Rendering approval ${approval.id}:`, {
              hasAssigned,
              assigned_approvers: approval.assigned_approvers,
              formatted: hasAssigned ? formatAssignedApprovers(approval.assigned_approvers, 3) : 'N/A'
            });
            
            return (
              <Box
                key={approval.id}
                sx={{
                  padding: 1.5,
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  border: '1px solid',
                  borderColor: approval.status === 'signed' ? '#81c784' : 
                               approval.status === 'rejected' ? '#e57373' :
                               hasApprovalComments ? '#ffb74d' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    borderColor: approval.status === 'signed' ? '#66bb6a' : 
                                 approval.status === 'rejected' ? '#f44336' :
                                 hasApprovalComments ? '#ffa726' : '#bdbdbd'
                  }
                }}
              >
                {/* Иконка статуса */}
                <IconButton 
                  size="small" 
                  sx={{ 
                    padding: '4px',
                    color: approval.status === 'signed' ? '#4caf50' : 
                           approval.status === 'rejected' ? '#f44336' :
                           hasApprovalComments ? '#ff9800' : '#9e9e9e',
                    cursor: 'default',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                  disableRipple
                >
                  {approval.status === 'signed' ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : approval.status === 'rejected' ? (
                    <CancelIcon fontSize="small" />
                  ) : (
                    <AccessTimeIcon fontSize="small" />
                  )}
                </IconButton>

                {/* Индикатор обязательности */}
                {approval.is_required && (
                  <Tooltip title={t("mandatory_sign") || "Обязательная подпись"}>
                    <WarningAmberIcon 
                      color="error" 
                      fontSize="small"
                      sx={{ flexShrink: 0 }} 
                    />
                  </Tooltip>
                )}

                {/* Информация о подписанте */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Название отдела */}
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {approval.department_name || 'Отдел не указан'}
                  </Typography>
                  
                  {/* КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: БЛОК ОТОБРАЖЕНИЯ ИСПОЛНИТЕЛЕЙ */}
                  {hasAssigned ? (
                    // Если есть назначенные исполнители - показываем их ФИО
                    <>
                      <Tooltip 
                        title={getAssignedApproversTooltip(approval.assigned_approvers)}
                        arrow
                        placement="top"
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <PersonIcon 
                            sx={{ 
                              fontSize: '0.9rem', 
                              color: 'primary.main' 
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            color="primary.main"
                            sx={{
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: 600,
                              cursor: 'help'
                            }}
                          >
                            {formatAssignedApprovers(approval.assigned_approvers, 3)}
                          </Typography>
                        </Box>
                      </Tooltip>
                      
                      {/* Должность под ФИО */}
                      {approval.position_name && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: '0.65rem',
                            mt: 0.25
                          }}
                        >
                          ({approval.position_name})
                        </Typography>
                      )}
                    </>
                  ) : (
                    // Если нет назначенных - показываем только должность
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {approval.position_name || 'Должность не указана'}
                    </Typography>
                  )}
                  {/* КОНЕЦ БЛОКА ИСПОЛНИТЕЛЕЙ */}
                  
                  {/* Дата подписания */}
                  {approval.status === 'signed' && approval.approval_date && (
                    <Typography 
                      variant="caption" 
                      color="success.main" 
                      display="block"
                      sx={{ 
                        mt: 0.5,
                        fontWeight: 500 
                      }}
                    >
                      ✓ Подписано {formatApprovalDate(approval.approval_date)}
                    </Typography>
                  )}
                  
                  {/* Комментарии */}
                  {hasApprovalComments && (
                    <Typography 
                      variant="caption" 
                      color="warning.main" 
                      display="block"
                      sx={{ 
                        mt: 0.5,
                        fontWeight: 500 
                      }}
                    >
                      💬 Есть замечания ({approval.approval_comments!.length})
                    </Typography>
                  )}
                </Box>

                {/* Чип статуса */}
                <Chip
                  label={getApprovalStatusText(approval)}
                  size="small"
                  color={getStatusChipColor(approval.status || 'waiting')}
                  variant={approval.status === 'signed' ? 'filled' : 'outlined'}
                  sx={{ 
                    flexShrink: 0,
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Общий статус группы */}
        {approvals.length > 1 && (
          <Box 
            sx={{ 
              mt: 2, 
              pt: 1.5, 
              borderTop: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <strong>Статус группы:</strong>
              {allSigned && ' Все подписали ✓'}
              {!allSigned && anySigned && ` Подписали ${approvals.filter(a => a.status === 'signed').length} из ${approvals.length}`}
              {!allSigned && !anySigned && ' Ожидает подписания'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ApprovalGroupCard;