const request = require('supertest');
const express = require('express');
const propertiesRouter = require('./properties_route');

jest.mock('./connection', () => ({
  query: jest.fn()
}));

const pool = require('./connection');

const app = express();
app.use(express.json());
app.use('/api/properties', propertiesRouter);

describe('Property Route Handlers', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  describe('GET /api/properties', () => {
    test('success', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 100 }]]) 
        .mockResolvedValueOnce([[{ L_ListingID: '123', L_City: 'Portland' }]]); 

      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body.results).toHaveLength(1);
    });

    test('pagination', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 100 }]]) 
        .mockResolvedValueOnce([[{ L_ListingID: '123', L_City: 'Portland' }]]); 

      const response = await request(app)
        .get('/api/properties?limit=20&offset=0')
        .expect(200);

      expect(response.body.total).toBe(100);
    });

    test('each filter type', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 50 }]])
        .mockResolvedValueOnce([[{ L_ListingID: '123', L_City: 'Portland' }]]);

      const response = await request(app)
        .get('/api/properties?city=Portland&minPrice=300000&maxPrice=500000')
        .expect(200);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.arrayContaining(['Portland'])
      );
    });

    test('invalid inputs', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 0 }]])
        .mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties?limit=abc')
        .expect(200);

      expect(response.body.results).toEqual([]);
    });
  });

  describe('GET /api/properties/:id', () => {
    test('success', async () => {
      pool.query.mockResolvedValueOnce([[
        { L_ListingID: '123', L_City: 'Portland', L_SystemPrice: 500000 }
      ]]);

      const response = await request(app)
        .get('/api/properties/123')
        .expect(200);

      expect(response.body.L_ListingID).toBe('123');
    });

    test('404', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/999')
        .expect(404);

      expect(response.body.error).toContain('Property not found');
    });

    test('invalid ID', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/invalid-id')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/properties/:id/openhouses', () => {
    test('success', async () => {
      pool.query
        .mockResolvedValueOnce([[{ L_ListingID: '123' }]]) 
        .mockResolvedValueOnce([[
          { OpenHouseDate: '2024-03-15', OH_StartTime: '1:00 PM' }
        ]]); 

      const response = await request(app)
        .get('/api/properties/123/openhouses')
        .expect(200);

      expect(response.body).toHaveLength(1);
    });

    test('empty results', async () => {
      pool.query
        .mockResolvedValueOnce([[{ L_ListingID: '123' }]])
        .mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/123/openhouses')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    test('404 for unknown property', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/999/openhouses')
        .expect(404);

      expect(response.body.error).toContain('Property not found');
    });
  });
});