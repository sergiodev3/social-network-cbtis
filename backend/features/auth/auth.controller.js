import User from './auth.model.js';
import jwt from 'jsonwebtoken';

// Controlador para registrar un usuario
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el correo ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso' });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({ username, email, password });

    res.status(201).json({ message: 'Usuario registrado con éxito', user: { id: newUser._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

// Controlador para iniciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por correo
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordValid(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};