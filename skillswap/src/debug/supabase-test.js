// Test file to debug Supabase connection
// You can run this in the browser console to test your Supabase setup

import { supabase } from '../lib/supabase.js';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check if Supabase client is initialized
    console.log('✅ Supabase client initialized');
    console.log('Supabase URL:', supabase.supabaseUrl);
    
    // Test 2: Check authentication status
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth error:', authError);
      return false;
    }
    
    if (authData.session) {
      console.log('✅ User is authenticated:', authData.session.user.email);
      console.log('User ID:', authData.session.user.id);
    } else {
      console.log('⚠️ User is not authenticated');
      return false;
    }
    
    // Test 3: Check if profiles table exists
    const { data: tableData, error: tableError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
      
    if (tableError) {
      console.error('❌ Table error:', tableError);
      if (tableError.code === '42P01') {
        console.log('📋 Profiles table does not exist. Please run the SQL setup.');
      } else if (tableError.message?.includes('permission denied')) {
        console.log('🔒 Permission denied. Check RLS policies.');
      }
      return false;
    }
    
    console.log('✅ Profiles table exists and is accessible');
    
    // Test 4: Try to insert a test record
    const testProfile = {
      user_id: authData.session.user.id,
      full_name: 'Test User',
      email: authData.session.user.email,
      location: 'Singapore',
      about_me: 'Test profile',
      skills_offered: [],
      skills_wanted: []
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .upsert(testProfile, { onConflict: 'user_id' })
      .select();
      
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return false;
    }
    
    console.log('✅ Successfully inserted/updated test profile:', insertData);
    console.log('🎉 All tests passed! Your Supabase setup is working correctly.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
};

// Auto-run test when imported
// testSupabaseConnection();
