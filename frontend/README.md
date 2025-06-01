# Project Structure and Configuration Guide

## File Structure
The following components and pages should be placed in their respective directories:

| Component/Page          | Location                          |
|-------------------------|-----------------------------------|
| `Footer.tsx`            | `./src/components/layout/`        |
| `Navbar.tsx`            | `./src/components/layout/`        |
| `HomePage.tsx`          | `./src/pages/Home/`               |
| `KalendarzPage.tsx`     | `./src/pages/Kalendarz/`          |
| `ProfilePage.tsx`       | `./src/pages/Profile/`            |
| `ZgloszeniaAdmin.tsx`   | `./src/pages/Zgloszenia/`         |
| `HistoriaPage.tsx`      | `./src/pages/Historia/`           |
| `LoginPage.tsx`         | `./src/pages/auth/`               |
| `Error.tsx`             | `./src/pages/`                    |

## Authentication Configuration
Location: `./src/store/slices/authSlice.ts`

This file manages user roles and authentication state. To control UI visibility based on user roles, modify the `initialState`:

```typescript
const initialState: AuthState = {
  isAuthenticated: true,  // Set to `false` when logged out
  userRole: 'admin',      // Options: 'admin', 'user', or `null` (logged out)
  isLoading: false,
  error: null,
};
## 🧭 Routing & Pages

### ➕ Adding a New Page

#### 1. Import the Component
In `routesConfig.tsx`, import the page component using `lazy`:
```tsx
const HomePage = lazy(() => import('../pages/Home/HomePage'));
```

#### 2. Add the Route Configuration
Add an entry to the routes array:
```tsx
{
  path: '/',
  element: <HomePage />,
}
```

---

## 🚪 Logout Behavior

### 🔐 On Logout

#### Set the Following:
- `userRole`: `null`
- `isAuthenticated`: `false`

> **⚠️ Note:** Do **not** modify services for now.

---

## 🎨 Styling

### 📁 Style Location
Styles for pages are located in:
```
./src/styles/pages/
```

Use this directory for page-specific styles to maintain modularity and consistency.
