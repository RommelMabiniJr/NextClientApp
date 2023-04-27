import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password, user_type } = req.body;
    try {
      const response = await axios.post('/register', {
        username,
        email,
        password,
        user_type,
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

