# Development Guide - Auth Testing

## Development Authentication Panel

This project includes a powerful development tool that allows you to easily test different user roles and authentication states without implementing a full backend authentication system.

## How to Use

### 1. Development Panel Access
- **Location**: Bottom-right corner of the screen (orange gear icon)
- **Availability**: Only visible in development mode (`npm run dev`)
- **Toggle**: Click the gear icon to open/close the panel

### 2. Status Indicator
- **Location**: Top-left corner of the screen
- **Shows**: Current logged-in user and their role
- **Format**: `DEV: [User Name] ([role])` or `DEV: Not logged in`

### 3. Available Test Users

The system includes 4 pre-configured test users:

#### Student User
- **Name**: John Student
- **Email**: student@example.com
- **Role**: `student`
- **Access**: Dashboard, Tests, Profile pages

#### Content Manager
- **Name**: Sarah Content Manager  
- **Email**: content@example.com
- **Role**: `content_manager`
- **Access**: Student pages + Question management, Test creation

#### Admin
- **Name**: Mike Admin
- **Email**: admin@example.com
- **Role**: `admin`
- **Access**: Content Manager pages + User management, Plans, Reports

#### Super Admin
- **Name**: Alice Super Admin
- **Email**: superadmin@example.com
- **Role**: `super_admin`
- **Access**: All pages including Team management

### 4. Testing Protected Routes

1. **Open the development panel** (gear icon in bottom-right)
2. **Select a user** from the dropdown to log in as that user type
3. **Navigate to protected pages** using the quick access buttons or manually
4. **Switch users** to test different permission levels
5. **Logout** by selecting "Logout" from the dropdown

### 5. Quick Access Buttons

The development panel includes quick access buttons for common pages:
- **Dashboard**: Student dashboard
- **Admin**: Admin dashboard  
- **Exam Setup**: Test configuration page
- **Questions**: Question management (admin only)

### 6. Authentication Behavior

#### In Development Mode:
- **No redirects**: Protected pages show helpful messages instead of redirecting
- **Visual feedback**: Clear indication of required roles for each page
- **Persistent state**: User selection persists across page reloads
- **Instant switching**: No need to go through login forms

#### In Production Mode:
- **Normal redirects**: Unauthenticated users redirected to login
- **No dev tools**: Development panel and status bar are hidden
- **Real authentication**: Would use actual JWT tokens, sessions, etc.

### 7. Page Access Matrix

| Page Type | Student | Content Manager | Admin | Super Admin |
|-----------|---------|----------------|-------|-------------|
| Public Pages | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Exam/Practice | ✅ | ✅ | ✅ | ✅ |
| Profile | ✅ | ✅ | ✅ | ✅ |
| Questions | ❌ | ✅ | ✅ | ✅ |
| Tests | ❌ | ❌ | ✅ | ✅ |
| Plans | ❌ | ❌ | ✅ | ✅ |
| Users | ❌ | ❌ | ✅ | ✅ |
| Reports | ❌ | ❌ | ✅ | ✅ |
| Team | ❌ | ❌ | ❌ | ✅ |

### 8. Development Tips

- **Test role boundaries**: Try accessing pages with insufficient permissions
- **Check responsive design**: Test on different screen sizes
- **Verify data display**: Each role sees appropriate mock data
- **Test navigation**: Ensure proper redirects and access controls
- **Clear state**: Use logout to reset and test unauthenticated state

### 9. Technical Implementation

The development authentication system:
- Uses `localStorage` to persist user state
- Integrates with the existing `AuthGuard` component
- Provides mock users with realistic data
- Maintains the same API as production auth system
- Automatically handles page reloads and state persistence

### 10. Troubleshooting

**Panel not showing?**
- Ensure you're running in development mode (`npm run dev`)
- Check browser console for any JavaScript errors

**User state not persisting?**
- Check if localStorage is enabled in your browser
- Try clearing localStorage and selecting a user again

**Pages not updating after user switch?**
- The system automatically reloads the page when switching users
- If issues persist, manually refresh the page

**Permission errors?**
- Check the role requirements shown in the development panel
- Ensure you're logged in as a user with sufficient permissions

This development tool makes it easy to test the entire application's authentication and authorization system without needing a backend, allowing for rapid frontend development and testing.