// src/features/application_task/task/Documents/NestedStepGroup.tsx

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, Collapse, IconButton, Chip } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { NestedStepGroup as NestedStepGroupType } from './store';
import { getGroupProgress, formatNestedStepNumber } from '../../../../utils/nestedStepsHelper';
import { ExpandMore, Close } from '@mui/icons-material';  // ← добавить Close


interface Props {
    group: NestedStepGroupType;
    parentStepNumber: number;
    renderStep: (step: any, stepNumber: string) => React.ReactNode;
    onCancelGroup?: (groupLinkId: number) => void;  // ← НОВЫЙ PROP
  servicename?: string;  // ← НОВЫЙ PROP

}

export const NestedStepGroup: React.FC<Props> = observer(({
    group,
    parentStepNumber,
    renderStep,
    onCancelGroup,
    servicename
}) => {
    const [expanded, setExpanded] = useState(true);
    const progress = getGroupProgress(group);

    const getStatusColor = () => {
        switch (group.status) {
            case 'completed': return '#e6f4ea';
            case 'active': return '#e3f2fd';
            case 'cancelled': return '#ffebee';
            default: return '#f5f5f5';
        }
    };

    const getStatusLabel = () => {
        switch (group.status) {
            case 'completed': return 'Завершено';
            case 'active': return 'В работе';
            case 'cancelled': return 'Отменено';
            default: return 'Ожидает';
        }
    };

    const getBorderColor = () => {
        switch (group.status) {
            case 'completed': return '#4caf50';
            case 'active': return '#2196f3';
            case 'cancelled': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    return (
        <Box
            sx={{
                mb: 2,
                mt: 3,
                border: '3px solid',
                borderColor: getBorderColor(),
                borderRadius: '12px',
                backgroundColor: getStatusColor(),
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                }
            }}
        >
            {/* ЗАГОЛОВОК ГРУППЫ С НАЗВАНИЕМ УСЛУГИ */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderBottom: expanded ? '2px solid' : 'none',
                    borderBottomColor: getBorderColor(),
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)'
                    }
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                    <BuildIcon sx={{ color: '#666', fontSize: 28 }} />
                    <Box>
                        {/* НАЗВАНИЕ УСЛУГИ В ЗАГОЛОВКЕ */}
                        <Typography
                            variant="subtitle1"
                            fontWeight="700"
                            sx={{
                                color: '#333',
                                fontSize: '1.1rem'
                            }}
                        >
                            🔧 {servicename}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                            Дополнительная услуга • {progress.completed} из {progress.total} шагов
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                        label={getStatusLabel()}
                        size="small"
                        sx={{
                            backgroundColor: group.status === 'completed' ? '#4caf50' :
                                group.status === 'active' ? '#2196f3' :
                                    group.status === 'cancelled' ? '#f44336' : '#9e9e9e',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    />

                    {/* НОВАЯ КНОПКА ОТМЕНЫ ГРУППЫ */}
                    {group.status !== 'completed' && group.status !== 'cancelled' && onCancelGroup && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancelGroup(group.linkId);
                            }}
                            sx={{
                                color: '#f44336',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                }
                            }}
                            title="Отменить всю группу"
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    )}

                    <IconButton
                        size="small"
                        sx={{
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                        }}
                    >
                        <ExpandMore />
                    </IconButton>
                </Box>
            </Box>

            {/* СПИСОК ВЛОЖЕННЫХ ШАГОВ - ОТОБРАЖАЮТСЯ ТОЧНО ТАК ЖЕ КАК ОБЫЧНЫЕ */}
            <Collapse in={expanded}>
                <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                    {group.steps.map((step, index) => {
                        const stepNumber = formatNestedStepNumber(parentStepNumber, index);
                        return (
                            <Box key={step.id} sx={{ mb: 2 }}>
                                {renderStep(step, stepNumber)}
                            </Box>
                        );
                    })}
                </Box>
            </Collapse>
        </Box>
    );
});