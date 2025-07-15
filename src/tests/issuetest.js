

import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { Issue } from '../model/Issues.js';

let issueId = '';
const baseUrl = '/api/issues';

beforeAll(async () => {
    // Connect to the test DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_issues');
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('🧪 Issue API Tests', () => {

    test('POST /api/issues - Create new issue', async () => {
        const res = await request(app).post(baseUrl).send({
            title: 'Login page not working',
            description: 'User cannot login with correct credentials',
            category: 'Bug',
            priority: 'High',
            status: 'Open',
            userName: 'John Doe',
            userEmail: 'john@example.com',
        });


        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Login page not working');
        issueId = res.body._id;
    });

    test('GET /api/issues - Fetch all issues', async () => {
        const res = await request(app).get(baseUrl);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/issues/:id - Fetch single issue by ID', async () => {
        const res = await request(app).get(`${baseUrl}/${issueId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(issueId);
    });

    test('PUT /api/issues/:id - Update issue details', async () => {
        const res = await request(app).put(`${baseUrl}/${issueId}`).send({
            status: 'In Progress',
            priority: 'Urgent'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('In Progress');
        expect(res.body.priority).toBe('Urgent');
    });

    test('PUT /api/issues/:id/response - Add admin response', async () => {
        const res = await request(app).put(`${baseUrl}/${issueId}/response`).send({
            message: 'We are working on it.',
            by: 'admin',
            status: 'In Progress'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.responses.length).toBeGreaterThan(0);
        expect(res.body.responses[0].by).toBe('admin');
    });

    test('PUT /api/issues/:id/response - Invalid response (missing message)', async () => {
        const res = await request(app).put(`${baseUrl}/${issueId}/response`).send({
            by: 'admin'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Message and "by" field are required/);
    });

    test('DELETE /api/issues/:id - Delete issue', async () => {
        const res = await request(app).delete(`${baseUrl}/${issueId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Issue deleted successfully');
    });

    test('GET /api/issues/:id - Fetch deleted issue (should fail)', async () => {
        const res = await request(app).get(`${baseUrl}/${issueId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Issue not found');
    });

    test('PUT /api/issues/:invalidId - Invalid ID format', async () => {
        const res = await request(app).put(`${baseUrl}/invalid123`).send({
            status: 'Resolved'
        });

        expect(res.statusCode).toBe(400);
    });

    test('DELETE /api/issues/:invalidId - Invalid ID format', async () => {
        const res = await request(app).delete(`${baseUrl}/invalid123`);
        expect(res.statusCode).toBe(500); // or 400 depending on your middleware
    });

});
