import express from 'express';
import {
    getAllIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue,
    addResponse,
} from '../controller/issueController.js';

const router = express.Router();

router.get('/', getAllIssues);
router.get('/:id', getIssueById);
router.post('/', createIssue);
router.put('/:id', updateIssue);
router.delete('/:id', deleteIssue);
router.put('/:id/response', addResponse);

export default router;
