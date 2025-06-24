# Fix SignUp Email Confirmation Issue

## The Problem

Your Supabase project likely has email confirmation enabled, which means users must verify their email before they can sign in.

## Solution: Disable Email Confirmation (For Development)

### Step 1: Access Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your SkillSwap project
3. Navigate to **Authentication** > **Settings**

### Step 2: Disable Email Confirmation

1. Scroll down to **"Email Confirmation"**
2. **Turn OFF** the toggle for "Enable email confirmations"
3. Click **Save**

### Step 3: Test Signup

1. Go to http://localhost:5173/signup
2. Try creating a new account
3. You should now be able to sign up without email verification

## Alternative: Enable Email Confirmation (Production Ready)

If you want to keep email confirmation enabled:

1. **Set up email templates** in Supabase Dashboard
2. **Configure SMTP settings** for email delivery
3. Users will receive confirmation emails and must click the link

## Debug Information

Check your browser console (F12) for detailed error messages. You should see:

- "Signup result: {success: false, error: '...'}"
- Specific error messages from Supabase

## Common Errors & Solutions

| Error Message                              | Solution                                            |
| ------------------------------------------ | --------------------------------------------------- |
| "Please check your email to confirm"       | Disable email confirmation or set up email properly |
| "User already registered"                  | User exists, try signing in instead                 |
| "Invalid email"                            | Check email format                                  |
| "Password should be at least 6 characters" | Use longer password                                 |

After making these changes, your signup should work immediately! 🎉
