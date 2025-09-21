import { NextRequest, NextResponse } from 'next/server'

// Sample fallback data
const getSamplePosts = (page: number = 0, search: string = '') => {
  const allPosts = [
    { id: '1', date: '09/2025', content: 'Sometimes I wonder if we\'re all just trying to find our place in this vast digital landscape. The connections we make online feel both intimate and distant at the same time.', answers: [{ id: 'a1', content: 'I feel the same way. The digital world can be both connecting and isolating.' }] },
    { id: '2', date: '08/2025', content: 'I\'ve been thinking about the weight of words lately. How a simple message can carry so much meaning, yet sometimes fail to convey what we really want to say.', answers: null },
    { id: '3', date: '09/2025', content: 'There\'s something beautiful about shared silence. Not everything needs to be said, but everything needs to be felt.', answers: [{ id: 'a2', content: 'Silence speaks volumes sometimes.' }, { id: 'a3', content: 'This resonates deeply with me.' }] },
    { id: '4', date: '07/2025', content: 'The morning coffee tastes different when you\'re truly present. No notifications, no rush, just the warmth and the moment.', answers: null },
    { id: '5', date: '09/2025', content: 'I realized today that vulnerability isn\'t weakness—it\'s the courage to show up as yourself, even when you\'re not sure who that is.', answers: [{ id: 'a4', content: 'This is so true. Authenticity takes courage.' }] },
    { id: '6', date: '08/2025', content: 'Walking without a destination taught me more about purpose than any goal-setting workshop ever could.', answers: null },
    { id: '7', date: '09/2025', content: 'The best conversations happen when both people forget they\'re trying to impress each other.', answers: null },
    { id: '8', date: '07/2025', content: 'I miss the feeling of getting lost in a book so completely that hours pass without notice. When did reading become another task to optimize?', answers: null },
    { id: '9', date: '08/2025', content: 'Sometimes the most radical act is simply listening—to yourself, to others, to the world around you.', answers: null },
    { id: '10', date: '09/2025', content: 'The paradox of choice in our digital age: infinite options, yet we often feel more constrained than ever.', answers: null },
    { id: '11', date: '06/2025', content: 'I\'ve started leaving my phone in another room during meals. The food tastes better, conversations flow deeper.', answers: null },
    { id: '12', date: '08/2025', content: 'There\'s wisdom in admitting you don\'t know something. It opens doors that certainty keeps locked.', answers: null },
    { id: '13', date: '09/2025', content: 'The best ideas come when you\'re not trying to have them. Shower thoughts, walking thoughts, just-before-sleep thoughts.', answers: null },
    { id: '14', date: '07/2025', content: 'I wonder if future generations will understand the concept of boredom, or if we\'ve optimized it out of existence.', answers: null },
    { id: '15', date: '08/2025', content: 'Empathy isn\'t about fixing someone\'s problems. Sometimes it\'s just about sitting with them in their experience.', answers: null },
    { id: '16', date: '09/2025', content: 'The internet promised to connect us all, but I\'ve never felt more disconnected from my neighbors.', answers: null },
    { id: '17', date: '06/2025', content: 'Learning to say no has been harder than learning to say yes, but infinitely more valuable.', answers: null },
    { id: '18', date: '08/2025', content: 'I collect moments now instead of things. They take up no space but fill my heart completely.', answers: null },
    { id: '19', date: '09/2025', content: 'The art of conversation is dying, replaced by the efficiency of information exchange.', answers: null },
    { id: '20', date: '07/2025', content: 'Some days I feel like I\'m performing my own life instead of living it. Social media has made actors of us all.', answers: null },
    { id: '21', date: '08/2025', content: 'The most profound truths are often the simplest ones we\'ve forgotten how to see.', answers: null },
    { id: '22', date: '09/2025', content: 'I\'m learning that healing isn\'t linear. Some days you feel whole, others you\'re collecting your pieces.', answers: null },
    { id: '23', date: '06/2025', content: 'The sound of rain on the window is the same whether you\'re happy or sad. Nature doesn\'t match our moods, and there\'s comfort in that.', answers: null },
    { id: '24', date: '08/2025', content: 'We\'ve become so good at documenting our lives that we\'ve forgotten how to live them.', answers: null },
    { id: '25', date: '09/2025', content: 'The person you were yesterday is not the person you are today. Growth is the only constant.', answers: null },
    { id: '26', date: '07/2025', content: 'I miss the anticipation of not knowing what comes next. Algorithms have made life predictably unpredictable.', answers: null },
    { id: '27', date: '08/2025', content: 'Kindness to strangers costs nothing but can change everything—for them and for you.', answers: null },
    { id: '28', date: '09/2025', content: 'The space between thoughts is where creativity lives. We need more silence in our noisy world.', answers: null },
    { id: '29', date: '06/2025', content: 'I\'ve stopped asking \'What do you do?\' and started asking \'What brings you joy?\' The conversations are much better.' },
    { id: '30', date: '08/2025', content: 'Technology should amplify human connection, not replace it. We\'ve lost sight of this simple truth.' },
    { id: '31', date: '09/2025', content: 'The best teachers are those who show you something you already knew but had forgotten.' },
    { id: '32', date: '07/2025', content: 'I\'m trying to live more in questions than in answers. Curiosity keeps you young.' },
    { id: '33', date: '08/2025', content: 'The fear of missing out has made us miss what\'s happening right in front of us.' },
    { id: '34', date: '09/2025', content: 'Some conversations change you. You can feel yourself becoming different as the words are spoken.' },
    { id: '35', date: '06/2025', content: 'I\'ve learned more about myself in moments of failure than in any success. Struggle is a teacher.' },
    { id: '36', date: '08/2025', content: 'The art of being alone without being lonely is one of life\'s most valuable skills.' },
    { id: '37', date: '09/2025', content: 'We measure everything except what matters most: the depth of our connections and the quality of our presence.' },
    { id: '38', date: '07/2025', content: 'I want to be the kind of person who makes others feel seen and heard, not judged or fixed.' },
    { id: '39', date: '08/2025', content: 'The stories we tell ourselves shape our reality more than the facts ever could.' },
    { id: '40', date: '09/2025', content: 'In a world of instant everything, patience has become a revolutionary act.' },
    { id: '41', date: '06/2025', content: 'I\'m learning that boundaries aren\'t walls—they\'re gates that let the right things in and keep the wrong things out.' },
    { id: '42', date: '08/2025', content: 'The most important conversations are the ones we have with ourselves when no one else is listening.' },
    { id: '43', date: '09/2025', content: 'We\'ve forgotten that not every thought needs to be shared, not every moment needs to be captured.' },
    { id: '44', date: '07/2025', content: 'The difference between loneliness and solitude is the quality of your relationship with yourself.' },
    { id: '45', date: '08/2025', content: 'I miss the days when getting lost meant adventure, not anxiety about GPS signals.' },
    { id: '46', date: '09/2025', content: 'The most courageous thing you can do is be yourself in a world that\'s constantly trying to make you someone else.' },
    { id: '47', date: '06/2025', content: 'We\'re all just walking each other home. The journey is better when we remember we\'re not alone.' },
    { id: '48', date: '08/2025', content: 'The best gifts are presence, attention, and time. They can\'t be bought, only given.' },
    { id: '49', date: '09/2025', content: 'I\'m trying to live with more wonder and less worry. The world is full of magic if you know how to look.' },
    { id: '50', date: '07/2025', content: 'Sometimes the most profound thing you can do is simply show up, without agenda or expectation.' }
  ];

  // Filter by search if provided
  let filteredPosts = allPosts;
  if (search) {
    filteredPosts = allPosts.filter(post => 
      post.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Randomize
  const shuffled = [...filteredPosts].sort(() => Math.random() - 0.5);
  
  // Paginate
  const limit = 50;
  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  const paginatedData = shuffled.slice(startIndex, endIndex);

  return {
    posts: paginatedData,
    hasMore: endIndex < shuffled.length,
    total: filteredPosts.length,
    page
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '0')
  const search = searchParams.get('search') || ''

  console.log('API called with:', { page, search });

  // For now, always use sample data since Supabase isn't configured
  // You can uncomment the Supabase code below when you have it set up
  
  try {
    // Check if Supabase is configured
    const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
    
    if (!hasSupabase) {
      console.log('Supabase not configured, using sample data');
      const result = getSamplePosts(page, search);
      return NextResponse.json(result);
    }

    // Use the real Supabase data from 'needs' table
    const { supabase } = await import('../../../lib/supabase');
    
    let query = supabase
      .from('needs')
      .select('id, body, created_at, answers')
      .not('body', 'is', null)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('body', `%${search}%`);
    }

    const { data: allData, error: allError } = await query;

    if (allError) {
      console.error('Supabase error:', allError);
      // Fallback to sample data
      const result = getSamplePosts(page, search);
      return NextResponse.json(result);
    }

    if (!allData || allData.length === 0) {
      // If no data in database, use sample data
      const result = getSamplePosts(page, search);
      return NextResponse.json(result);
    }

    // Randomize the results
    const shuffled = [...allData].sort(() => Math.random() - 0.5);
    
    // Paginate the shuffled results
    const limit = 50;
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedData = shuffled.slice(startIndex, endIndex);

    // Transform data to match our frontend format
    const posts = paginatedData.map((item, index) => {
      // Format date
      const date = item.created_at 
        ? new Date(item.created_at).toLocaleDateString('en-US', { 
            month: '2-digit', 
            year: 'numeric' 
          }).replace('/', '/') 
        : new Date().toLocaleDateString('en-US', { 
            month: '2-digit', 
            year: 'numeric' 
          }).replace('/', '/')

      return {
        id: item.id || `post-${page}-${index}`,
        date,
        content: item.body || 'No content available',
        answers: item.answers || null
      }
    });

    const hasMore = endIndex < shuffled.length;

    return NextResponse.json({
      posts,
      hasMore,
      total: allData.length,
      page
    });

  } catch (error) {
    console.error('API error:', error);
    // Always fallback to sample data
    const result = getSamplePosts(page, search);
    return NextResponse.json(result);
  }
}
