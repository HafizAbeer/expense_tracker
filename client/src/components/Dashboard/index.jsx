import React, { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import BudgetOverview from './BudgetOverview';
import MonthlyHistory from './MonthlyHistory';
import Modal from '../UI/Modal';

const Dashboard = ({ user, setUser, logout, token }) => {
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/expenses', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (res.ok) setExpenses(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Filter expenses based on selectedMonth
    const filteredExpenses = expenses.filter(exp => {
        const expMonth = new Date(exp.date).toISOString().slice(0, 7);
        return expMonth === selectedMonth;
    });

    // Get unique months from all expenses for the selector
    const availableMonths = Array.from(new Set([
        new Date().toISOString().slice(0, 7),
        ...expenses.map(exp => new Date(exp.date).toISOString().slice(0, 7))
    ])).sort().reverse();

    const addExpense = async (expense) => {
        try {
            const res = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(expense)
            });
            if (res.ok) fetchExpenses();
        } catch (err) {
            console.error(err);
        }
    };

    const updateExpense = async (id, updatedData) => {
        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                fetchExpenses();
                setEditingExpense(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteExpense = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${confirmDeleteId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                fetchExpenses();
                setConfirmDeleteId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateBudget = async (newBudget) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/budget', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ budget: newBudget })
            });
            if (res.ok) {
                const updatedUser = { ...user, monthlyBudget: newBudget };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Expense <span style={{ color: 'var(--primary)' }}>Tracker</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.username}</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <select
                            className="input-field"
                            style={{ padding: '0.6rem 2.5rem 0.6rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {availableMonths.map(m => (
                                <option key={m} value={m}>
                                    {new Date(m).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn" onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <BudgetOverview budget={user?.monthlyBudget} expenses={filteredExpenses} updateBudget={updateBudget} />
                    <ExpenseForm addExpense={addExpense} />
                </div>
                <div className="glass-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Expenses for {new Date(selectedMonth).toLocaleString('default', { month: 'long' })}</h3>
                    <ExpenseList expenses={filteredExpenses} deleteExpense={(id) => setConfirmDeleteId(id)} setEditingExpense={setEditingExpense} />
                </div>
            </div>

            <MonthlyHistory expenses={expenses} />

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingExpense}
                onClose={() => setEditingExpense(null)}
                title="Edit Expense"
            >
                <ExpenseForm
                    editingExpense={editingExpense}
                    updateExpense={updateExpense}
                    clearEdit={() => setEditingExpense(null)}
                />
            </Modal>

            <Modal
                isOpen={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                title="Confirm Deletion"
            >
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Are you sure you want to delete this expense? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" onClick={deleteExpense} style={{ flex: 1, background: 'var(--danger)' }}>Delete</button>
                    <button
                        className="btn"
                        onClick={() => setConfirmDeleteId(null)}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
