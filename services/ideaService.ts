import { supabase } from './supabaseClient';
import { SavedIdea } from '../types';

// Database interface matching the Supabase table structure (snake_case)
interface DatabaseIdea {
  id: string;
  user_id: string;
  content: SavedIdea; // JSONB column stores the entire SavedIdea object
  created_at: string;
}

// --- CRUD OPERATIONS ---

// 1. FETCH ALL IDEAS
export const fetchUserIdeas = async (): Promise<SavedIdea[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map database rows back to SavedIdea objects
    // We primarily use the 'content' JSONB field which holds the full structure
    return (data || []).map((row: DatabaseIdea) => ({
        ...row.content,
        id: row.id // Ensure the top-level ID matches the DB ID
    }));
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }
};

// 2. CREATE IDEA
export const createIdea = async (idea: SavedIdea): Promise<SavedIdea | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // We store the whole idea object in the 'content' JSONB column
    // We also explicitly set the 'id' column to match the idea.id for easier querying
    const { data, error } = await supabase
      .from('ideas')
      .insert([
        {
          id: idea.id, 
          user_id: user.id,
          content: idea 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return data ? { ...data.content, id: data.id } : null;
  } catch (error) {
    console.error('Error creating idea:', error);
    return null;
  }
};

// 3. UPDATE IDEA (Analysis, Blueprint, Kanban changes)
export const updateIdea = async (idea: SavedIdea): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ideas')
      .update({ content: idea }) // Update the JSON content
      .eq('id', idea.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating idea:', error);
    return false;
  }
};

// 4. DELETE IDEA
export const deleteIdea = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting idea:', error);
    return false;
  }
};