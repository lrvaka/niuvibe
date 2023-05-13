import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User"; // Assuming you have a User model defined

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, userId } = req.body;

    await dbConnect();

    await User.updateOne({ userId }, { $set: { name } }, { upsert: true });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
