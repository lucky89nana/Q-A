const request = require('supertest');
const app = require('../app');

describe('GET Questions Endpoint', () => {
  test('should respond with a 200 status code for a product in the database', async () => {
    const res = await request(app)
      .get('/qa/questions')
      .query({ product_id: 1 });
    expect(res.statusCode).toBe(200);
  });

  test('should specify json in the content type headers for a product in the database', async () => {
    const res = await request(app)
      .get('/qa/questions')
      .query({ product_id: 1 });
    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });

  test('response has product_id and results for a product in the database', async () => {
    const res = await request(app)
      .get('/qa/questions')
      .query({ product_id: 1 });
    expect(res.body['product_id']).toBeDefined();
    expect(res.body['results']).toBeDefined();
  });

  test('should respond with a 200 status code for a product not in the database', async () => {
    const res = await request(app)
      .get('/qa/questions')
      .query({ product_id: 0 });
    expect(res.statusCode).toBe(200);
  });

  test('should specify json in the content type headers for a product not in the database', async () => {
    const res = await request(app)
      .get('/qa/questions')
      .query({ product_id: 0 });
    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });

  test('response has product_id and results for a product not in the database', async () => {
    const res = await request(app)
      .get('/qa/questions')
      .query({ product_id: 0 });
    expect(res.body['product_id']).toBeDefined();
    expect(res.body['results']).toHaveLength(0);
  });
});

describe('GET Answers Endpoint', () => {
  test('should respond with a 200 status code for a question in the database', async () => {
    const res = await request(app).get('/qa/questions/1/answers');
    expect(res.statusCode).toBe(200);
  });

  test('should specify json in the content type headers for a question in the database', async () => {
    const res = await request(app).get('/qa/questions/1/answers');
    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });

  test('response has question_id and results for a question in the database', async () => {
    const res = await request(app).get('/qa/questions/1/answers');
    expect(res.body.question).toBeDefined();
    expect(res.body.results).toBeDefined();
  });

  test('should respond with a 200 status code for a question not in the database', async () => {
    const res = await request(app).get('/qa/questions/0/answers');
    expect(res.statusCode).toBe(200);
  });

  test('should specify json in the content type headers for a question not in the database', async () => {
    const res = await request(app).get('/qa/questions/0/answers');
    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });

  test('response has product_id and results for a question not in the database', async () => {
    const res = await request(app).get('/qa/questions/0/answers');
    expect(res.body.question).toBeDefined();
    expect(res.body.results).toBeDefined();
  });
});

describe('POST Questions Endpoint', () => {
  test('should respond with a 201 status code when post a new question', async () => {
    const randomProductId = Math.floor(Math.random() * 90000);
    const body = {
      body: 'this is a test',
      name: 'tester',
      email: 'tester@tester.com',
      product_id: randomProductId,
    };
    const res = await request(app)
      .post('/qa/questions')
      .set('Content-type', 'application/json')
      .send(body);
    expect(res.statusCode).toBe(201);
  });
});

describe('POST Answers Endpoint', () => {
  test('should respond with a 201 status code when post a new answer to an existed question', async () => {
    const randomQuestionId = Math.floor(Math.random() * 10000) + 1;
    const body = {
      body: 'this is a test',
      name: 'tester',
      email: 'tester@tester.com',
    };
    const res = await request(app)
      .post(`/qa/questions/${randomQuestionId}/answers`)
      .set('Content-type', 'application/json')
      .send(body);
    expect(res.statusCode).toBe(201);
  });
});

describe('PUT Questions Helpfulness Endpoint', () => {
  test('should respond with a 204 status code when updates a question to show it was found helpful', async () => {
    const randomQuestionId = Math.floor(Math.random() * 10000) + 1;
    const res = await request(app).put(
      `/qa/questions/${randomQuestionId}/helpful`
    );
    expect(res.statusCode).toBe(204);
  });
});

describe('PUT Answers Helpfulness Endpoint', () => {
  test('should respond with a 204 status code when updates an answer to show it was found helpful', async () => {
    const randomAnswerId = Math.floor(Math.random() * 10000) + 1;
    const res = await request(app).put(`/qa/answers/${randomAnswerId}/helpful`);
    expect(res.statusCode).toBe(204);
  });
});

describe('PUT Questions Report Endpoint', () => {
  test('should respond with a 204 status code when updates a question to show it has been reported', async () => {
    const randomAnswerId = Math.floor(Math.random() * 10000) + 1;
    const res = await request(app).put(`/qa/answers/${randomAnswerId}/report`);
    expect(res.statusCode).toBe(204);
  });
});

describe('PUT Answers Report Endpoint', () => {
  test('should respond with a 204 status code when updates an answer to show it has been reported', async () => {
    const randomQuestionId = Math.floor(Math.random() * 10000) + 1;
    const res = await request(app).put(
      `/qa/questions/${randomQuestionId}/report`
    );
    expect(res.statusCode).toBe(204);
  });
});
