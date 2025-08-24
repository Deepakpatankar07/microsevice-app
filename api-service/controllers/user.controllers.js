import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { publishToQueue } from "../utils/rabbitmq.js";
import redisClient from "../utils/redisClient.js";
import DataModel from "../models/data.models.js";
import dotenv from 'dotenv';
dotenv.config();



export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: `User with email ${email} already exists` });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword });

    // publish event
    await publishToQueue({ event: "UserRegistered", email: result.email, userId: result._id });

    res.status(201).json({ message: "Registration successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getData = async (req, res) => {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10); 

    const redisKey = `data:${numId}`; 

    // Check Redis cache
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      console.log("⚡ Cache hit");
      return res
        .status(200)
        .json({ source: "cache", data: JSON.parse(cachedData) });
    }

    // Fetch from DB using numId
    const data = await DataModel.findOne({ numId });
    if (!data) return res.status(404).json({ message: "Data not found" });

    // Store in Redis for future requests
    await redisClient.set(redisKey, JSON.stringify(data), { EX: 60 }); // cache for 60 sec

    res.status(200).json({ source: "db", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      user: existingUser.email,
      token: token,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDatas = async (req, res) => {
  try {
    const datas = await DataModel.find();
    res.status(200).json(datas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
