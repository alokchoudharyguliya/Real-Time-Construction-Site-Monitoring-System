Looking at your current JWT-based authentication system, here's a plan to migrate to cookie/session-based authentication:

Migration Plan: JWT to Cookie/Session Authentication
1. Session Storage Backend
Current: JWT tokens stored client-side
New: Use Django's session framework with MongoDB as session store
Install django-mongoengine-sessions or implement custom MongoDB session backend
Configure SESSION_ENGINE in Django settings
2. Authentication Flow Changes
Signup Process
Remove JWT token generation from signup() view
Create Django session after successful user creation
Set session data with user ID and email
Return success response (no token needed)
Login Process
Remove JWT token generation from login() view
Create Django session after password verification
Store user ID and relevant data in session
Set session cookies in response
Logout Process (New)
Create new logout endpoint
Clear/flush Django session
Delete session cookie
Return success response
3. Middleware Modifications
Replace JWTAuthenticationMiddleware
Remove JWT token verification logic
Check for active Django session instead
Verify session data contains required user information
Set request.user_id and request.user_email from session data
Session Configuration
Configure session cookie settings (secure, httponly, samesite)
Set appropriate session timeout
Configure session save behavior
4. Database Schema Changes
Session Collection
Create MongoDB collection for Django sessions
Schema: session_key, session_data, expire_date
Index on session_key and expire_date for performance
User Collection (Optional)
Consider adding last_login field
Track session activity if needed
5. Utility Functions Refactoring
Remove JWT Functions
Delete generate_jwt_token() and verify_jwt_token()
Remove JWT-related imports and dependencies
Add Session Helpers
Create session validation utilities
Session data serialization/deserialization helpers
Session cleanup utilities
6. Security Considerations
Cookie Security
Enable CSRF protection for state-changing operations
Configure secure cookie settings for production
Implement proper CORS settings for cross-origin requests
Session Management
Implement session rotation for sensitive operations
Add session timeout warnings
Consider concurrent session limits per user
7. Frontend Integration Impact
Request Headers
Remove Authorization Bearer token headers
Ensure cookies are included in requests (credentials: 'include')
Error Handling
Update authentication error responses
Handle session expiration gracefully
8. Configuration Updates
Django Settings
Add session middleware to MIDDLEWARE
Configure SESSION_* settings
Update INSTALLED_APPS if using session backend package
Environment Variables
Remove JWT secret key requirement
Add session-related configuration variables
9. Testing Strategy
Update Test Cases
Replace JWT token assertions with session checks
Test session persistence across requests
Verify proper session cleanup on logout
10. Deployment Considerations
Server Configuration
Ensure proper cookie handling in reverse proxy
Configure session store connection pooling
Monitor session storage performance
