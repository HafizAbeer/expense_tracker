import React, { useState } from 'react';

const MonthlyHistory = ({ expenses }) => {
    const [expandedMonth, setExpandedMonth] = useState(null);

    // Group expenses by Month & Year
    const grouped = expenses.reduce((acc, exp) => {
        const date = new Date(exp.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = { total: 0, items: [] };
        acc[monthYear].total += exp.amount;
        acc[monthYear].items.push(exp);
        return acc;
    }, {});

    const months = Object.keys(grouped).sort((a, b) => {
        return new Date(b) - new Date(a); // Sort newest first
    });

    return (
        <div className="glass-card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Monthly History</h3>
            {months.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No history available.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {months.map((month) => (
                        <div
                            key={month}
                            style={{
                                border: '1px solid var(--glass-border)',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                background: 'rgba(255,255,255,0.02)'
                            }}
                        >
                            <div
                                onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
                                style={{
                                    padding: '1.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    background: expandedMonth === month ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div>
                                    <h4 style={{ margin: 0 }}>{month}</h4>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {grouped[month].items.length} Transactions
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.1rem' }}>
                                        Rs. {grouped[month].total.toLocaleString()}
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {expandedMonth === month ? 'Click to collapse' : 'Click to view details'}
                                    </span>
                                </div>
                            </div>

                            {expandedMonth === month && (
                                <div style={{
                                    padding: '0 1.2rem 1.2rem 1.2rem',
                                    borderTop: '1px solid var(--glass-border)',
                                    animation: 'fadeIn 0.3s ease'
                                }}>
                                    <div className="table-container">
                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                    <th style={{ padding: '0.5rem 0' }}>Title</th>
                                                    <th style={{ padding: '0.5rem 0' }}>Category</th>
                                                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {grouped[month].items.map((item, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                                        <td style={{ padding: '0.8rem 0' }}>{item.title}</td>
                                                        <td style={{ padding: '0.8rem 0' }}>
                                                            <span style={{
                                                                background: 'rgba(255,255,255,0.05)',
                                                                padding: '2px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.75rem'
                                                            }}>
                                                                {item.category}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.8rem 0', textAlign: 'right', fontWeight: '600' }}>
                                                            Rs. {item.amount.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MonthlyHistory;
