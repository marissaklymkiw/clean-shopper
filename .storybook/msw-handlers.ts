import { http, HttpResponse } from 'msw'

const BASE = 'https://gxszeczokcexmroklqvx.supabase.co'

export const mswHandlers = [
  http.get(`${BASE}/rest/v1/categories`, () =>
    HttpResponse.json([
      { id: 'cat-1', slug: 'personal-care', name: 'Personal Care', parent_id: null, sort_order: 1 },
      { id: 'cat-2', slug: 'cleaning', name: 'Cleaning', parent_id: null, sort_order: 2 },
    ])
  ),
  http.get(`${BASE}/rest/v1/products`, () =>
    HttpResponse.json([
      {
        id: 'prod-1', name: 'Clean Face Wash', image_url: null, clean_score: 88,
        category_id: 'cat-1', brands: { name: 'Evergreen' }, categories: { name: 'Personal Care' },
      },
    ])
  ),
  http.get(`${BASE}/rest/v1/cart_items`, () => HttpResponse.json([])),
  http.get(`${BASE}/auth/v1/session`, () => HttpResponse.json({ session: null })),
]
