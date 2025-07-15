import { Issue } from '../model/Issues.js';

export const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find().sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createIssue = async (req, res) => {
    try {
        const newIssue = new Issue(req.body);
        const saved = await newIssue.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateIssue = async (req, res) => {
    try {
        const updated = await Issue.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Issue not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteIssue = async (req, res) => {
    try {
        const deleted = await Issue.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Issue not found' });
        res.json({ message: 'Issue deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addResponse = async (req, res) => {
    const { message, by, status } = req.body;
    if (!message || !by) return res.status(400).json({ message: 'Message and "by" field are required' });

    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        issue.responses.push({ by, message });
        if (status) issue.status = status;
        issue.updatedAt = Date.now();

        const updated = await issue.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
