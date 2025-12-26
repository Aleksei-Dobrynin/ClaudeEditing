
// ===================================
// AddSignerDialog.tsx
import React, { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { observer } from 'mobx-react';
import documentFormsStore from './documentFormsStore';
import storeForm from '../store';
import AutocompleteCustom from 'components/Autocomplete';
import { useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface AddSignerDialogProps {
  stepId: number;
  onSuccess: () => void;
}

const AddSignerDialog: FC<AddSignerDialogProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const store = documentFormsStore;
  const Users = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  const Plus = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
  const CheckCircle = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
  const Clock = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
  const [newApprover, setNewApprover] = React.useState({
    order_number: 1,
    department_id: 0,
    position_id: 0,
    is_required: false
  });
  const getAvailableOrders = () => {
    const count = (store.signersDraft[props.stepId] ?? [])
      .filter(x => x.status !== 'is_deleted')
      .length;

    return Array.from({ length: count + 1 }, (_, i) => i + 1);
  };
  const groupedApprovers = (store.signersDraft[props.stepId] ?? []).filter(x => x.status != "is_deleted").reduce((acc: Record<number, any[]>, approver: any) => {
        const order = approver.order_number ?? 1;

        if (!acc[order]) acc[order] = [];
        acc[order].push(approver);

        return acc;
      }, {}) ?? {};

  const sortedOrders = Object.keys(groupedApprovers)
    .map(Number)
    .sort((a, b) => a - b);

  React.useEffect(() => {
    store.initSignersDraft(props.stepId);
  }, [props.stepId, store.signerDialogOpen]);

  return (
    <Dialog
      open={store.signerDialogOpen}
      onClose={() => store.closeSignerDialog()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={24} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
            Управление подписантами
          </h2>
        </div>
        <IconButton
          aria-label="close"
          onClick={() => store.closeSignerDialog()}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={{
          padding: '20px',
          backgroundColor: '#f9fafb',
          border: '2px dashed #d1d5db',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Plus size={20} />
            Добавить подписанта
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {/* Порядковый номер */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Порядковый номер *
              </label>
              <select
                value={newApprover.order_number}
                onChange={(e) => setNewApprover({ ...newApprover, order_number: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                {getAvailableOrders().map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Отдел */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Отдел *
              </label>
              <select
                value={store.signerForm.departmentId ?? 0}
                onChange={(e) => {
                  const departmentId = Number(e.target.value);
                  store.setSignerFormField('departmentId', departmentId);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value={0}>Выберите отдел...</option>
                {store.departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Должность */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Должность *
              </label>
              <select
                value={store.signerForm.positionId}
                onChange={(e) => {
                  const positionId = Number(e.target.value);
                  store.setSignerFormField('positionId', positionId);
                }}
                disabled={store.signerForm.departmentId == 0}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value={0}>Выберите должность...</option>
                {store.positions.map(pos => (
                  <option key={pos.id} value={pos.id}>{pos.name}</option>
                ))}
              </select>
            </div>

            {/* Обязательность */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#374151'
              }}>
                <input
                  type="checkbox"
                  checked={newApprover.is_required}
                  onChange={(e) => setNewApprover({ ...newApprover, is_required: e.target.checked })}
                  style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <span style={{ fontWeight: '500' }}>Обязательный подписант</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              store.addSignerLocal(props.stepId, {
                order_number: newApprover.order_number,
                department_id: store.signerForm.departmentId,
                position_id: store.signerForm.positionId,
                is_required: newApprover.is_required
              });

              setNewApprover({ order_number: 1, department_id: 0, position_id: 0, is_required: false });
            }}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={!store.isSignerFormValid}
          >
            <Plus size={18} />
            Добавить подписанта
          </button>
        </div>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
            Согласования:
          </h3>

          {sortedOrders.map((orderNum) => (
            <div key={orderNum} style={{ marginBottom: '16px' }}>
              {/* Порядок */}
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Порядок #{orderNum}
                {(groupedApprovers[orderNum]?.length ?? 0) > 1 && (
                  <span style={{
                    marginLeft: 8,
                    padding: '2px 8px',
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    ПАРАЛЛЕЛЬНО
                  </span>
                )}
              </div>

              {/* Подписанты */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(groupedApprovers[orderNum] ?? []).map((approver) => (
                  <div
                    key={approver.id}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: approver.status === 'signed' ? '#dcfce7' : '#fef3c7',
                      border: '1px solid',
                      borderColor: approver.status === 'signed' ? '#86efac' : '#fde047',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {approver.status === 'signed' ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Clock size={20} />
                      )}

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827'
                        }}>
                          {approver.department_name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {approver.position_name}
                          {approver.is_required && (
                            <span style={{
                              marginLeft: 8,
                              padding: '2px 6px',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              borderRadius: 6,
                              fontSize: 11
                            }}>
                              обязат.
                            </span>
                          )}
                        </div>
                      </div>

                      {approver.status === 'signed' ? (
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#86efac',
                          color: '#15803d',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                            Подписано
                          </span>
                      ) : (
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#fde047',
                          color: '#854d0e',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                            Ожидает подписи
                          </span>
                      )}
                      {approver.status !== 'signed' && (
                        <label style={{ fontSize: 12 }}>
                          <input
                            type="checkbox"
                            checked={!!approver.is_final}
                            onChange={(e) =>
                              store.setFinalApprover(props.stepId, approver.id, e.target.checked)
                            }
                          />
                          финальный
                        </label>
                      )}
                      {approver.status !== 'signed' && !approver.is_final && <select
                        value={approver.order_number}
                        onChange={(e) =>
                          store.changeApproverOrder(
                            props.stepId,
                            approver.id,
                            Number(e.target.value)
                          )
                        }
                        style={{
                          padding: '4px 6px',
                          borderRadius: 6,
                          border: '1px solid #d1d5db',
                          fontSize: 12
                        }}
                      >
                        {getAvailableOrders().map(num => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>}
                      {approver.status !== 'signed' && <input
                        type="checkbox"
                        checked={!!approver.is_required}
                        disabled={approver.status === 'signed'}
                        onChange={(e) =>
                          store.toggleApproverRequired(
                            props.stepId,
                            approver.id,
                            e.target.checked
                          )
                        }
                      />}
                      {approver.status !== 'signed' && <button
                        onClick={() =>
                          store.removeApprover(props.stepId, approver.id)
                        }
                        style={{
                          marginLeft: 8,
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 6px',
                          cursor: 'pointer'
                        }}
                      >
                        <DeleteOutlineIcon/>
                      </button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {store.closeSignerDialog()
          store.discardSignersDraft(props.stepId)}} color="inherit">
          Отмена
        </Button>
        <Button
          onClick={() => {
            // store.addSigner(props.stepId, props.onSuccess)
            store.applySignersDraft(props.stepId, props.onSuccess);
          }}
          variant="contained"
        >
          Сохранить изменения
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AddSignerDialog;