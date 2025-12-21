import React, { useState } from 'react';
import { EditPaymentsProps, MonthlyPayment } from '../types';

/**
 * PaymentHistoryModal component for viewing and managing payment history in a modal.
 * @param payments - The list of monthly payments.
 * @param onEdit - Callback to handle editing a payment.
 * @param onDelete - Callback to handle deleting a payment.
 * @param visible - Whether the modal is visible.
 * @param onClose - Callback to close the modal.
 */
interface PaymentHistoryModalProps extends EditPaymentsProps {
  visible: boolean;
  onClose: () => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  payments,
  onEdit,
  onDelete,
  visible,
  onClose
}) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({month: '', emiPaid: 0, extraPaid: 0});

  /**
   * Starts editing a payment entry.
   * @param p - The payment to edit.
   */
  const startEdit = (p: MonthlyPayment) => {
    setEditing(p.month);
    setEditData({month: p.month, emiPaid: p.emiPaid, extraPaid: p.extraPaid});
  };

  /**
   * Saves the edited payment.
   */
  const saveEdit = async () => {
    await onEdit({oldMonth: editing!, ...editData});
    setEditing(null);
  };

  /**
   * Cancels the editing process.
   */
  const cancelEdit = () => {
    setEditing(null);
  };

  /**
   * Deletes a payment entry after confirmation.
   * @param month - The month of the payment to delete.
   */
  const deletePayment = async (month: string) => {
    if (window.confirm(`Are you sure you want to delete the payment for ${month}?`)) {
      if (onDelete) {
        await onDelete(month);
      }
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--card)',
        borderRadius: '12px',
        padding: '20px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '800px'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <h3 style={{margin: 0}}>Payment History</h3>
          <button onClick={onClose} style={{background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer'}}>×</button>
        </div>
        {payments.length === 0 ? (
          <div>No payments yet.</div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #ccc'}}>
                  <th style={{padding: '8px', textAlign: 'left'}}>Month</th>
                  <th style={{padding: '8px', textAlign: 'right'}}>EMI Paid</th>
                  <th style={{padding: '8px', textAlign: 'right'}}>Extra Paid</th>
                  <th style={{padding: '8px', textAlign: 'right'}}>Interest</th>
                  <th style={{padding: '8px', textAlign: 'right'}}>Principal</th>
                  <th style={{padding: '8px', textAlign: 'right'}}>Remaining</th>
                  <th style={{padding: '8px', textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.month} style={{borderBottom: '1px solid #eee'}}>
                    {editing === p.month ? (
                      <>
                        <td style={{padding: '8px'}}>
                          <input type="month" value={editData.month} onChange={e => setEditData({...editData, month: e.target.value})} style={{width: '100%'}} />
                        </td>
                        <td style={{padding: '8px'}}>
                          <input type="number" placeholder="EMI Paid" value={editData.emiPaid} onChange={e => setEditData({...editData, emiPaid: Number(e.target.value)})} style={{width: '100%'}} />
                        </td>
                        <td style={{padding: '8px'}}>
                          <input type="number" placeholder="Extra Paid" value={editData.extraPaid} onChange={e => setEditData({...editData, extraPaid: Number(e.target.value)})} style={{width: '100%'}} />
                        </td>
                        <td colSpan={3} style={{padding: '8px', textAlign: 'center'}}>
                          <button onClick={saveEdit} style={{marginRight: 8}}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                        </td>
                        <td></td>
                      </>
                    ) : (
                      <>
                        <td style={{padding: '8px'}}>{p.month}</td>
                        <td style={{padding: '8px', textAlign: 'right'}}>₹{p.emiPaid}</td>
                        <td style={{padding: '8px', textAlign: 'right'}}>₹{p.extraPaid}</td>
                        <td style={{padding: '8px', textAlign: 'right'}}>₹{p.interestComponent}</td>
                        <td style={{padding: '8px', textAlign: 'right'}}>₹{p.principalComponent}</td>
                        <td style={{padding: '8px', textAlign: 'right'}}>₹{p.remainingPrincipal}</td>
                        <td style={{padding: '8px', textAlign: 'center'}}>
                          <button className="button" onClick={() => startEdit(p)} style={{marginRight: 4}}>Edit</button>
                          {onDelete && <button className="button" onClick={() => deletePayment(p.month)} style={{background: 'red', color: 'white'}}>Delete</button>}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryModal;