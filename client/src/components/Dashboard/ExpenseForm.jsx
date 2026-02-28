import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ addExpense, editingExpense, updateExpense, clearEdit }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (editingExpense) {
            setFormData({
                title: editingExpense.title,
                amount: editingExpense.amount,
                category: editingExpense.category,
                date: new Date(editingExpense.date).toISOString().split('T')[0]
            });
        } else {
            setFormData({
                title: '',
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [editingExpense]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (editingExpense) {
            updateExpense(editingExpense._id, { ...formData, amount: Number(formData.amount) });
        } else {
            addExpense({ ...formData, amount: Number(formData.amount) });
        }
        setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className={editingExpense ? "" : "glass-card"} style={{ padding: editingExpense ? '0' : '2rem' }}>
            {!editingExpense && <h3 style={{ marginBottom: '1.5rem' }}>Add New Expense</h3>}
            <form onSubmit={onSubmit}>
                <div className="input-group">
                    <label>Date</label>
                    <input
                        className="input-field"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Expense Title</label>
                    <input
                        className="input-field"
                        placeholder="e.g. Grocery"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Amount (Rs.)</label>
                    <input
                        className="input-field"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Category</label>
                    <select
                        className="input-field"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option>Food</option>
                        <option>Rent</option>
                        <option>Utilities</option>
                        <option>Transport</option>
                        <option>Leisure</option>
                        <option>Other</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ flex: 1 }}>
                        {editingExpense ? 'Update' : 'Add Expense'}
                    </button>
                    {editingExpense && (
                        <button
                            type="button"
                            className="btn"
                            onClick={clearEdit}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;
