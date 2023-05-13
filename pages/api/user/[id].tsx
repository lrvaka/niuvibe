// pages/api/user/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User, { IUser } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Find the user in the database by Auth0 ID or create a new one if it doesn't exist
        const user: IUser = await User.findOneAndUpdate(
          { auth0Id: id as string },
          {},
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Return the user data
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
