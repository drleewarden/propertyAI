# API Documentation - Property Investment AI

Complete API reference for the Property Investment AI application.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.vercel.app`

## Authentication

All protected endpoints require a valid NextAuth session. Session is managed via HTTP-only cookies.

## Endpoints

### Authentication Endpoints

#### POST /api/auth/signup

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "parentId": "optional-parent-id"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

**Errors:**
- `400`: Invalid email or password
- `400`: Email already in use
- `400`: Parent user not found

---

#### POST /api/auth/[...nextauth]

NextAuth authentication endpoint. Handles:
- Email/password login (credentials provider)
- Google OAuth
- Session management

Redirect to `/login` for sign in.

---

### Questions Endpoints

#### GET /api/questions

Get all property analysis questions.

**Response (200):**
```json
[
  {
    "id": "question-id",
    "question": "What is the property address?",
    "type": "text",
    "category": "property",
    "required": true,
    "order": 1,
    "options": null
  },
  {
    "id": "question-id-2",
    "question": "What is the property type?",
    "type": "select",
    "category": "property",
    "required": true,
    "order": 2,
    "options": ["Single Family", "Multi-Family", "Commercial"]
  }
]
```

**Query Parameters:** None

---

#### POST /api/questions

Create a new property question (Admin only).

**Request:**
```json
{
  "question": "What is the property type?",
  "type": "select",
  "category": "property",
  "required": true,
  "order": 3,
  "options": ["Single Family", "Multi-Family", "Commercial"]
}
```

**Response (201):**
```json
{
  "id": "new-question-id",
  "question": "What is the property type?",
  "type": "select",
  "category": "property",
  "required": true,
  "order": 3,
  "options": "['Single Family', 'Multi-Family', 'Commercial']"
}
```

---

### Reports Endpoints

#### POST /api/reports/create

Create a new property analysis report.

**Authentication:** Required

**Request:**
```json
{
  "answers": {
    "question-id-1": "123 Main St",
    "question-id-2": "Single Family",
    "question-id-3": "4",
    "question-id-4": "2"
  }
}
```

**Response (200):**
```json
{
  "reportId": "new-report-id",
  "message": "Report created successfully"
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Subscription expired or trial ended
- `404`: User not found

---

#### GET /api/reports/[id]

Get a specific report.

**Authentication:** Required

**Response (200):**
```json
{
  "id": "report-id",
  "userId": "user-id",
  "title": "Property Investment Analysis",
  "summary": "This property shows good investment potential...",
  "analysis": "Detailed analysis...",
  "status": "completed",
  "googleDocUrl": "https://docs.google.com/document/d/...",
  "googleDocId": "document-id",
  "createdAt": "2024-01-15T10:30:00Z",
  "answers": [
    {
      "id": "answer-id",
      "questionId": "question-id",
      "answer": "123 Main St"
    }
  ]
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Report not found

---

#### POST /api/reports/[id]/export

Export report to Google Docs.

**Authentication:** Required

**Response (200):**
```json
{
  "googleDocUrl": "https://docs.google.com/document/d/...",
  "message": "Report exported successfully"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Report not found
- `500`: Export failed

---

### Dashboard Endpoints

#### GET /api/dashboard/reports

Get all reports for the authenticated user.

**Authentication:** Required

**Response (200):**
```json
[
  {
    "id": "report-id",
    "title": "Property Investment Analysis",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Errors:**
- `401`: Unauthorized
- `404`: User not found

---

#### GET /api/dashboard/subscription

Get subscription information for the authenticated user.

**Authentication:** Required

**Response (200):**
```json
{
  "plan": "free",
  "status": "active",
  "trialEndDate": "2024-02-15T10:30:00Z",
  "currentPeriodStart": null,
  "currentPeriodEnd": null,
  "isCancelled": false,
  "cancelledAt": null
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Subscription not found

---

### Subscription Endpoints

#### GET /api/subscription/check

Check if user can create a report (trial not expired and paid if needed).

**Authentication:** Required

**Response (200):**
```json
{
  "canCreateReport": true
}
```

---

#### POST /api/stripe/checkout

Create a Stripe checkout session for Pro plan upgrade.

**Authentication:** Required

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_live_..."
}
```

**Errors:**
- `401`: Unauthorized
- `404`: User not found
- `500`: Failed to create checkout session

---

### Stripe Webhooks (Production)

#### POST /api/stripe/webhooks

Handle Stripe webhook events.

**Headers:**
```
Stripe-Signature: t=...,v1=...
```

**Webhook Events:**
- `checkout.session.completed` - Update user subscription when payment succeeds
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Handle subscription cancellation

---

## Question Types

### text
Single-line text input
```json
{
  "type": "text",
  "options": null
}
```

### number
Numeric input
```json
{
  "type": "number",
  "options": null
}
```

### textarea
Multi-line text input
```json
{
  "type": "textarea",
  "options": null
}
```

### select
Dropdown/select field
```json
{
  "type": "select",
  "options": ["Option 1", "Option 2", "Option 3"]
}
```

---

## Report Status

- **draft** - Report created, waiting for AI analysis
- **completed** - Analysis complete, ready to view/export
- **archived** - Report archived by user

---

## Subscription Plans

### Free
- Duration: 30 days trial
- Price: $0
- Features: Unlimited property analysis, AI reports, Google Docs export
- Auto-downgrade: After 30 days, limited access

### Pro
- Duration: Monthly recurring
- Price: $3/month
- Features: Everything in Free, priority support, unlimited reports
- Cancellation: Anytime

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (subscription expired)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- No rate limiting implemented yet
- Recommended: Add rate limiting before production

---

## CORS

- Configured for same-origin requests only
- NextAuth handles session cookies

---

## Best Practices

1. **Always check authentication** before accessing user data
2. **Validate input** on both client and server
3. **Use HTTPS** in production
4. **Store sensitive data** in environment variables
5. **Handle errors gracefully** with meaningful messages
6. **Test webhook handlers** thoroughly
7. **Monitor API performance** in production

---

## Example Workflows

### Create and Get a Report

```bash
# 1. Get all questions
curl http://localhost:3000/api/questions

# 2. Answer questions and create report
curl -X POST http://localhost:3000/api/reports/create \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "question-id-1": "123 Main St",
      "question-id-2": "Single Family"
    }
  }'

# Response: {"reportId": "report-123"}

# 3. Get report details
curl http://localhost:3000/api/reports/report-123

# 4. Export to Google Docs
curl -X POST http://localhost:3000/api/reports/report-123/export
```

### Subscribe to Pro Plan

```bash
# 1. Check subscription status
curl http://localhost:3000/api/subscription/check

# Response: {"canCreateReport": true}

# 2. Create checkout session if trial expired
curl -X POST http://localhost:3000/api/stripe/checkout

# Response: {"url": "https://checkout.stripe.com/..."}

# 3. Redirect user to checkout URL
```

---

## Support

For API issues or questions, please:
1. Check this documentation
2. Review application logs
3. Open an issue on GitHub
4. Contact support
