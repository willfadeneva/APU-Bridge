import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../_lib/auth';

// For Vercel deployment, we'll create a simplified API structure
export default withAuth(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Mock user data for demonstration - replace with your auth logic
    const user = {
      id: '1',
      email: 'demo@apu.edu',
      firstName: 'Demo',
      lastName: 'User',
      role: 'student',
      university: 'APU',
      major: 'Computer Science'
    };
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});