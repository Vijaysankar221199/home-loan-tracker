import React, { useState } from 'react';
import { EditPaymentsProps, MonthlyPayment } from '../types';

/**
 * EditPayments component for editing monthly payment entries.
 * @param payments - The list of monthly payments.
 * @param onEdit - Callback to handle editing a payment.
 */
const EditPayments: React.FC<EditPaymentsProps> = ({payments, onEdit}) => {
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

  return (
    <div className="card">
      <div style={{fontWeight: 700, marginBottom: 8}}>Edit Payments</div>
      {payments.length === 0 ? (
        <div>No payments yet.</div>
      ) : (
        payments.map(p => (
          <div key={p.month} style={{borderBottom: '1px solid #ccc', padding: '8px 0'}}>
            {editing === p.month ? (
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <input type="month" value={editData.month} onChange={e => setEditData({...editData, month: e.target.value})} />
                <input type="number" placeholder="EMI Paid" value={editData.emiPaid} onChange={e => setEditData({...editData, emiPaid: Number(e.target.value)})} />
                <input type="number" placeholder="Extra Paid" value={editData.extraPaid} onChange={e => setEditData({...editData, extraPaid: Number(e.target.value)})} />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>{p.month}: EMI ₹{p.emiPaid}, Extra ₹{p.extraPaid}</span>
                <button onClick={() => startEdit(p)}>Edit</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EditPayments;