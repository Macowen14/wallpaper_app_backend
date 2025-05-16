import { create, findOne } from '../models/User';
import { hash as _hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    const hash = await _hash(password, 10);
    const user = await create({ email, password: hash });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const match = await compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
