import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../_lib/auth';

export default withAuth(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      // Mock post creation for demonstration
      const post = {
        id: Date.now().toString(),
        content: req.body.content,
        authorId: '1',
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
      };
      
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  } else if (req.method === 'GET') {
    // Mock feed data
    const posts = [
      {
        id: '1',
        content: 'Welcome to APU Bridge! This is a sample post.',
        authorId: '1',
        author: {
          firstName: 'Demo',
          lastName: 'User',
          profileImageUrl: null
        },
        createdAt: new Date().toISOString(),
        likeCount: 5,
        commentCount: 2
      }
    ];
    
    res.json(posts);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
});