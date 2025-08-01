import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../_lib/auth';

export default withAuth(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Mock conversations data
    const conversations = [
      {
        otherUser: {
          id: '2',
          firstName: 'Alice',
          lastName: 'Johnson',
          profileImageUrl: null
        },
        lastMessage: {
          id: '1',
          content: 'Hey! How are you doing?',
          senderId: '2',
          receiverId: '1',
          createdAt: new Date(Date.now() - 60000).toISOString(),
          isRead: false
        },
        unreadCount: 1
      }
    ];
    
    res.json(conversations);
  } else if (req.method === 'POST') {
    try {
      const message = {
        id: Date.now().toString(),
        senderId: '1',
        receiverId: req.body.receiverId,
        content: req.body.content,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
});