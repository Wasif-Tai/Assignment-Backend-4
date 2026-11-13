import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

// Create a user using only the public fields accepted by this endpoint.
export const createUser = async (req, res) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ message: "A valid request body is required" });
  }

  const { username, email, password } = body;

  // Validate required values before querying the database or hashing a password.
  if (
    typeof username !== "string" ||
    !username.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: "A valid email is required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    // Check first for a clear duplicate-email response; the unique index also
    // catches concurrent requests that pass this check at the same time.
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Hashing prevents the original password from ever being stored in MongoDB.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign the least-privileged role on the server and ignore any client role.
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    // Return only public fields; never expose the password or its hash.
    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "User details are invalid" });
    }

    console.error("User creation error", error);
    return res.status(500).json({ message: "Unable to create user" });
  }
};
