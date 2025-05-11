
# API Integration Guide for Django REST Framework

## API Endpoints

This frontend is designed to connect to a Django REST Framework backend with the following endpoints:

### Authentication Endpoints

- `POST /api/user/register/` - Register a new user
  - Request: `{ name: string, email: string, password: string }`
  - Response: `{ user: User, token: string }`

- `POST /api/user/login/` - Login a user
  - Request: `{ email: string, password: string }`
  - Response: `{ user: User, token: string }`

### Event Endpoints

- `GET /api/events/` - Get all events
  - Response: `Event[]`

- `GET /api/events/{id}/` - Get a specific event
  - Response: `Event`

- `POST /api/events/` - Create a new event (admin only)
  - Request: FormData with event details
  - Response: `Event`

- `PATCH /api/events/{id}/` - Update an event (admin only)
  - Request: FormData with updated event details
  - Response: `Event`

- `DELETE /api/events/{id}/` - Delete an event (admin only)

### Booking Endpoints

- `GET /api/bookings/` - Get all bookings (admin only)
  - Response: `Booking[]`

- `GET /api/bookings/user/` - Get bookings for current user
  - Response: `Booking[]`

- `POST /api/bookings/` - Create a new booking
  - Request: `{ eventId: number }`
  - Response: `Booking`

- `GET /api/bookings/check/{eventId}/` - Check if user has booked an event
  - Response: `{ isBooked: boolean }`

- `DELETE /api/bookings/{id}/` - Cancel a booking

## Data Models

### User

```typescript
{
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}
```

### Event

```typescript
{
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  image: string;
}
```

### Booking

```typescript
{
  id: number;
  event: Event;
  createdAt: string;
  userId: number;
}
```

## Authentication

This frontend expects JWT authentication from the Django REST Framework backend. The token is stored in `localStorage` and sent with each request in the `Authorization` header as:

```
Authorization: Bearer {token}
```

## Recommended Django Packages

For implementing the backend:
- Django REST Framework
- django-cors-headers (for handling CORS)
- djangorestframework-simplejwt (for JWT authentication)
- django-filter (for filtering capabilities)
- Pillow (for image handling)
