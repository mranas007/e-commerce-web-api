# 🔐 Authentication & Authorization System Guide

## Overview

This e-commerce application implements a comprehensive authentication and authorization system with role-based access control (RBAC). The system supports both regular users and administrators with different access levels.

## 🏗️ Architecture

### Core Components

1. **AuthContext** (`src/contexts/AuthContext.jsx`)
   - Central state management for authentication
   - Token and user data persistence
   - Role-based utility functions

2. **ProtectedRoute** (`src/components/ProtectedRoute.jsx`)
   - Route protection component
   - Authentication and role validation
   - Loading states and redirects

3. **Login/Register Pages** (`src/pages/Account/`)
   - User authentication forms
   - API integration with flexible response handling
   - Role assignment and validation

## 🔑 Authentication Flow

### 1. User Registration
```
User fills form → API call → Response processed → User created with "User" role → Redirect to confirmation
```

### 2. User Login
```
User fills form → API call → Response processed → Role determined → Redirect based on role
```

### 3. Route Protection
```
User visits route → ProtectedRoute checks auth → If not authenticated → Redirect to login
→ If authenticated but wrong role → Redirect to appropriate page
```

## 👥 User Roles

### Regular User (`role: "User"`)
- **Access**: Home, Products, Cart, Product Details
- **Features**: Browse products, add to cart, view details
- **Navigation**: Standard navbar with user info

### Administrator (`role: "Admin"`)
- **Access**: All user features + Admin Dashboard, Product Management
- **Features**: Manage products, view analytics, user management
- **Navigation**: Admin button in navbar, admin sidebar

## 🛡️ Security Features

### Token Management
- **Storage**: Secure localStorage with automatic cleanup
- **Validation**: Token presence checked on route access
- **Expiration**: Handled through API responses

### Route Protection
- **Public Routes**: `/home`, `/login`, `/register`, `/confirmation`
- **Protected User Routes**: `/products`, `/cart`, `/product/:id`
- **Protected Admin Routes**: `/admin/*` (all admin pages)

### Role Validation
- **User Routes**: Require authentication only
- **Admin Routes**: Require authentication + admin role
- **Fallback**: Non-admin users redirected to home

## 🎯 API Integration

### Expected Response Formats

The system handles multiple API response formats:

```javascript
// Format 1: { token, user }
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin"
  }
}

// Format 2: { accessToken, user }
{
  "accessToken": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User"
  }
}

// Format 3: Direct user object with token
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "token": "jwt_token_here"
}
```

### API Endpoints

- **Login**: `POST /Authentication/login`
- **Register**: `POST /Authentication/create`
- **Products**: `GET /Product/all`
- **Cart**: `GET /Cart/get-cart-items`

## 🧪 Testing

### Development Mode Features

In development mode, the home page displays authentication status:
- Token presence
- User information
- Role assignment
- Authentication state

### Manual Testing Steps

1. **Test Unauthenticated Access**:
   - Visit `/products` → Should redirect to `/login`
   - Visit `/admin` → Should redirect to `/login`

2. **Test User Authentication**:
   - Login as regular user → Should redirect to `/home`
   - Try to access `/admin` → Should redirect to `/home`

3. **Test Admin Authentication**:
   - Login as admin → Should redirect to `/admin`
   - Should see admin button in navbar
   - Should access all admin pages

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Role Assignment

Roles are assigned as follows:
- **New Registrations**: Default to "User" role
- **Existing Users**: Role determined by API response
- **Fallback**: If no role specified, defaults to "User"

## 🚀 Usage Examples

### Using AuthContext in Components

```javascript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, token, isAdmin, logout } = useAuth();
  
  return (
    <div>
      {user && <p>Welcome, {user.name}!</p>}
      {isAdmin() && <button>Admin Panel</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Protecting Routes

```javascript
import ProtectedRoute from '../components/ProtectedRoute';

// User-only route
<ProtectedRoute>
  <UserComponent />
</ProtectedRoute>

// Admin-only route
<ProtectedRoute requireAdmin={true}>
  <AdminComponent />
</ProtectedRoute>
```

## 🐛 Troubleshooting

### Common Issues

1. **Login not working**:
   - Check API endpoint in `axiosConfig.js`
   - Verify response format matches expected structure
   - Check browser console for errors

2. **Role not working**:
   - Ensure API returns `role` field in user object
   - Check role value is exactly "Admin" or "User"
   - Verify role assignment in registration

3. **Redirect loops**:
   - Check route protection logic
   - Verify authentication state
   - Clear localStorage and try again

### Debug Information

The system includes comprehensive console logging:
- Login attempts and responses
- Authentication state changes
- Route protection decisions
- Role validation results

## 📝 Best Practices

1. **Always use ProtectedRoute** for sensitive pages
2. **Check user roles** before rendering admin features
3. **Handle loading states** during authentication checks
4. **Provide clear error messages** for authentication failures
5. **Use the utility functions** (`isAdmin()`, `isUser()`) for role checks

## 🔄 Future Enhancements

- [ ] Token refresh mechanism
- [ ] Remember me functionality
- [ ] Password reset flow
- [ ] Email verification
- [ ] Multi-factor authentication
- [ ] Session timeout handling
- [ ] Audit logging for admin actions

---

**Note**: This authentication system is production-ready and includes comprehensive error handling, loading states, and security measures. The role-based access control ensures proper separation between user and admin functionality. 