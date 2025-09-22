import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Create Supabase client for server-side
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get saved posts for the user with the related need data
    const { data: savedPosts, error } = await supabase
      .from('saved')
      .select(`
        id,
        created_at,
        reaction,
        need_id,
        needs (
          id,
          body,
          created_at,
          sharing_code,
          answers,
          user_id
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved posts:', error);
      return NextResponse.json({ error: 'Failed to fetch saved posts' }, { status: 500 });
    }

    return NextResponse.json(savedPosts || []);
  } catch (error) {
    console.error('Error in saved posts API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for server-side
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { need_id, reaction } = await request.json();

    if (!need_id) {
      return NextResponse.json({ error: 'need_id is required' }, { status: 400 });
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved')
      .select('id')
      .eq('user_id', user.id)
      .eq('need_id', need_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Post already saved' }, { status: 400 });
    }

    // Save the post
    const { data, error } = await supabase
      .from('saved')
      .insert({
        user_id: user.id,
        need_id,
        reaction: reaction || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving post:', error);
      return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in save post API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Create Supabase client for server-side
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const need_id = searchParams.get('need_id');

    if (!need_id) {
      return NextResponse.json({ error: 'need_id is required' }, { status: 400 });
    }

    // Remove from saved
    const { error } = await supabase
      .from('saved')
      .delete()
      .eq('user_id', user.id)
      .eq('need_id', need_id);

    if (error) {
      console.error('Error removing saved post:', error);
      return NextResponse.json({ error: 'Failed to remove saved post' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in remove saved post API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
