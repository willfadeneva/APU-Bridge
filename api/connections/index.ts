import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../_lib/auth';

export default withAuth(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Mock connections data
    const connections = [
      {
        id: '1',
        requester: {
          id: '2',
          firstName: 'Alice',
          lastName: 'Johnson',
          title: 'Computer Science Student',
          university: 'APU',
          profileImageUrl: null
        },
        addressee: {
          id: '1',
          firstName: 'Demo',
          lastName: 'User',
          title: 'Student',
          university: 'APU'
        },
        status: 'accepted',
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json(connections);
  } else if (req.method === 'POST') {
    try {
      const connection = {
        id: Date.now().toString(),
        requesterId: '1',
        addresseeId: req.body.addresseeId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      res.json(connection);
    } catch (error) {
      console.error("Error creating connection:", error);
      res.status(500).json({ message: "Failed to send connection request" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
});