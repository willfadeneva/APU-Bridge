import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth } from '../_lib/auth';

export default withAuth(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Mock jobs data
    const jobs = [
      {
        id: '1',
        title: 'Software Engineer Intern',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        description: 'Join our team as a software engineer intern...',
        type: 'internship',
        isRemote: false,
        salary: '$25/hour',
        createdAt: new Date().toISOString(),
        poster: {
          firstName: 'Jane',
          lastName: 'Smith',
          title: 'HR Manager'
        }
      },
      {
        id: '2',
        title: 'Data Analyst',
        company: 'Analytics Inc',
        location: 'Remote',
        description: 'Analyze data and create insights...',
        type: 'full-time',
        isRemote: true,
        salary: '$70,000 - $90,000',
        createdAt: new Date().toISOString(),
        poster: {
          firstName: 'John',
          lastName: 'Doe',
          title: 'Hiring Manager'
        }
      }
    ];
    
    res.json(jobs);
  } else if (req.method === 'POST') {
    try {
      const job = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        poster: {
          firstName: 'Demo',
          lastName: 'User'
        }
      };
      
      res.json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
});