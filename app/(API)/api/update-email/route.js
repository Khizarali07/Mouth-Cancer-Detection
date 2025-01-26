import { updateUserEmail } from "@/lib/actions/userActions";

export async function POST(req) {
  const { newEmail } = req.body;

  let message;

  if (!newEmail) {
    return (message = "New email is required.");
  }

  try {
    const response = await updateUserEmail({ newEmail });
    console.log("Email updated");

    // res.status(200).json(response);
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Failed to update email." });
  }
}
