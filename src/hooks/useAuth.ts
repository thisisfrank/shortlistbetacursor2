import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  role: 'client' | 'sourcer' | 'admin';
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('Getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      console.log('Initial session user:', currentUser?.email);
      
      setUser(currentUser);
      
      if (currentUser) {
        const profile = await fetchUserProfile(currentUser.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
      console.log('Auth initialization complete');
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        const currentUser = session?.user ?? null;
        
        setUser(currentUser);
        
        if (currentUser) {
          const profile = await fetchUserProfile(currentUser.id);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      console.log('Sign in result:', { success: !error, error: error?.message });
      
      return { data, error };
    } catch (error) {
      console.error('Sign in catch error:', error);
      return { 
        data: null, 
        error: { message: 'Network error. Please try again.' } 
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('Attempting signup with:', { email, passwordLength: password.length });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined
      },
    });
    
    console.log('Signup result:', { success: !error, error: error?.message });
    return { data, error };
  };

  const signOut = async () => {
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setUserProfile(null);
    }
    return { error };
  };

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};