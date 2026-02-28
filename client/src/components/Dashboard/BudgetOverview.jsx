import React, { useState } from 'react';
import Modal from '../UI/Modal';

const BudgetOverview = ({ budget, expenses, updateBudget }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBudget, setNewBudget] = useState(budget);

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = budget - totalSpent;
    const percentage = budget > 0 ? (totalSpent / budget) * 100 : 0;

    const handleUpdate = (e) => {
        e.preventDefault();
        updateBudget(Number(newBudget));
        setIsModalOpen(false);
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span>Monthly Budget</span>
                <button
                    onClick={() => {
                        setNewBudget(budget);
                        setIsModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    Edit Budget
                </button>
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Rs. {(budget || 0).toLocaleString()}</h2>

            <div style={{ marginTop: '2rem' }}>
                <div className="budget-details" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Spent: Rs. {(totalSpent || 0).toLocaleString()}</span>
                    <span style={{ color: (remaining || 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        Remaining: Rs. {(remaining || 0).toLocaleString()}
                    </span>
                </div>
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                        style={{
                            width: `${Math.min(percentage, 100)}%`,
                            height: '100%',
                            background: percentage > 90 ? 'var(--danger)' : 'var(--success)',
                            transition: 'width 0.5s ease'
                        }}
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update Monthly Budget"
            >
                <form onSubmit={handleUpdate}>
                    <div className="input-group">
                        <label>New Budget Amount (Rs.)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={newBudget}
                            onChange={(e) => setNewBudget(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>Update Budget</button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setIsModalOpen(false)}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BudgetOverview;
