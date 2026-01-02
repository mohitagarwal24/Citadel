# 🔑 Default Admin Credentials

## Admin Account

After running the seed script (`npm run seed`), use these credentials to access the admin dashboard:

### Login Details
```
Email: admin@citadel.com
Password: admin123
```

## Access URLs

- **Landing Page**: http://localhost:3000
- **Login Page**: http://localhost:3000/auth/login
- **Dashboard**: http://localhost:3000/dashboard
- **Products**: http://localhost:3000/dashboard/products
- **Create Admin**: http://localhost:3000/dashboard/admin

## Important Security Notes

⚠️ **CRITICAL**: These are default credentials for development and testing only.

### For Production Deployment:

1. **Change the default password immediately**
   - Login with default credentials
   - Navigate to profile settings (future feature)
   - Or manually update in database

2. **Create a new admin with strong credentials**
   - Use the "Create Admin" feature in dashboard
   - Use a strong, unique password (20+ characters)
   - Enable 2FA when available (future feature)

3. **Delete or disable the default admin account**
   - After creating your production admin
   - Remove the default account from database

### Password Requirements

For production admin accounts:
- Minimum 12 characters (20+ recommended)
- Mix of uppercase and lowercase letters
- Include numbers and special characters
- Avoid common words or patterns
- Use a password manager

### Database Access

If you need to manually update credentials in MongoDB:

```javascript
// Connect to MongoDB
use citadel-ecommerce

// Update admin password (use bcrypt hash)
db.users.updateOne(
  { email: "admin@citadel.com" },
  { $set: { password: "<bcrypt-hashed-password>" } }
)
```

To generate a bcrypt hash:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-new-password', 12);
console.log(hash);
```

## Additional Test Accounts

The seed script only creates one admin account. To create additional test accounts:

1. **Via Admin Dashboard**:
   - Login as admin
   - Go to `/dashboard/admin`
   - Create new admin accounts

2. **Via API**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/create \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Admin",
       "email": "test@citadel.com",
       "password": "testpassword123"
     }'
   ```

3. **Via Seed Script**:
   - Modify `scripts/seed.ts`
   - Add additional user creation
   - Run `npm run seed` again

## Troubleshooting

### Cannot Login
- Verify database is running
- Check MongoDB connection in `.env.local`
- Ensure seed script ran successfully
- Clear browser cookies and try again

### Forgot Password
Currently, there's no password reset feature. To reset:

1. **Via Database**:
   - Generate new bcrypt hash
   - Update user document in MongoDB

2. **Via Seed Script**:
   - Run seed script again (will reset all data)

### Account Locked
If implementing account lockout (future feature):
- Wait for lockout period to expire
- Or manually unlock in database

## Security Best Practices

1. **Never commit credentials to Git**
   - Use `.env.local` (already in .gitignore)
   - Never hardcode passwords

2. **Rotate credentials regularly**
   - Change passwords every 90 days
   - Update API keys periodically

3. **Use environment-specific credentials**
   - Development: Simple passwords OK
   - Staging: Similar to production
   - Production: Maximum security

4. **Monitor access logs**
   - Track login attempts
   - Alert on suspicious activity
   - Review admin actions

5. **Implement additional security layers**
   - Two-factor authentication
   - IP whitelisting
   - Rate limiting
   - Session timeout

## Contact

For security concerns or to report vulnerabilities:
- Open a private security advisory on GitHub
- Or contact the security team directly

---

**Last Updated**: January 2024
**Version**: 1.0.0

