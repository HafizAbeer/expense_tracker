const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// Get all expenses for a user
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add expense
router.post('/', auth, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        const newExpense = new Expense({
            userId: req.user.id,
            title,
            amount,
            category,
            date
        });
        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });
        if (expense.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: { title, amount, category, date } }, { new: true });
        res.json(expense);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });
        if (expense.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
