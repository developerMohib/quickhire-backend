import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { errors } from '../utils/AppError';
export interface IRegisterPayload {
  username: string;
  email: string;
  password: string;
}

class AuthService {
  async register(data: IRegisterPayload) {
    const { username, email, password } = data;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw errors.badRequest('Username or Email already exists');
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save to DB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return { id: newUser._id, username: newUser.username ,hashedPassword};
  }

  async login(usernameOrEmail: string, password: string) {
    // 1. Find user
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
    if (!user || !user.password) {
      throw errors.unauthorized('Invalid credentials');
    }
 
    // 2. Compare Password
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      throw errors.unauthorized('Invalid credentials');
    }

    // 3. Generate Token
    const token = generateToken({ id: user._id, role: 'user' });
    return { token, user: { id: user._id, username: user.username } };
  }
}

export default new AuthService();
