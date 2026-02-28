import React from 'react';

const ExpenseList = ({ expenses, deleteExpense, setEditingExpense }) => {
    if (expenses.length === 0) {
        return <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No expenses added yet.</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {expenses.map((exp) => (
                <div
                    key={exp._id}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '1rem',
                        border: '1px solid var(--glass-border)'
                    }}
                >
                    <div>
                        <h4 style={{ fontWeight: '600' }}>{exp.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.category} • {new Date(exp.date).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Rs. {exp.amount.toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setEditingExpense(exp)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteExpense(exp._id)}
                                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExpenseList;
