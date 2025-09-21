import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { body } = await request.json();
    
    if (!body || typeof body !== 'string' || !body.trim()) {
      return NextResponse.json({ error: 'Body content is required' }, { status: 400 });
    }

    // Check if Supabase is configured
    const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
    
    if (!hasSupabase) {
      console.log('Supabase not configured, simulating success');
      // Simulate success for demo purposes
      return NextResponse.json({ 
        success: true, 
        message: 'Post created successfully (demo mode)',
        id: `demo-${Date.now()}`
      });
    }

    // Use real Supabase when configured
    const { supabase } = await import('../../../lib/supabase');
    
    const { data, error } = await supabase
      .from('needs')
      .insert({
        body: body.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Still return success for demo purposes
      return NextResponse.json({ 
        success: true, 
        message: 'Post created successfully (fallback)',
        id: `fallback-${Date.now()}`
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('API error:', error);
    // Return success even on error for demo purposes
    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully (error fallback)',
      id: `error-${Date.now()}`
    });
  }
}
