# Supabase Setup Guide for SkillSwap

## Quick Setup Instructions

### 1. Access Your Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in to your account
3. Select your SkillSwap project

### 2. Create the Profiles Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **Run** to execute the SQL

### 3. Verify Table Creation

1. Go to **Table Editor** in the sidebar
2. You should see a new table called `profiles`
3. The table should have these columns:
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key)
   - `full_name` (Text)
   - `email` (Text)
   - `location` (Text, Default: 'Singapore')
   - `about_me` (Text)
   - `profile_image_url` (Text)
   - `skills_offered` (JSONB)
   - `skills_wanted` (JSONB)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

### 4. Test the Application

1. Start your React app: `npm run dev`
2. Login to your application
3. Go to "Edit Profile"
4. Add some skills and save
5. Check the **Table Editor** to see your data

## Security Features Included

- **Row Level Security (RLS)** - Users can only access their own profiles
- **Authentication Required** - Only logged-in users can create/edit profiles
- **Automatic Timestamps** - Created/updated timestamps are managed automatically

## Troubleshooting

- If you see "Error loading profile", the table hasn't been created yet
- If you see a warning about "Database table not found", run the SQL setup
- Check the browser console for detailed error messages

## Next Steps

Once the table is set up, users can:

- ✅ Create and edit their profiles
- ✅ Add/remove skills they can teach
- ✅ Add/remove skills they want to learn
- ✅ Upload profile pictures via URL
- ✅ Save all data persistently in Supabase
