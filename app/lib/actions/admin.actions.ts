"use server";
import jwt from "jsonwebtoken";

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
type LoginProps = {
  name: string;
  password: string;
};

export async function adminLogin({ name, password }: LoginProps) {
  const JWT_SECRET = process.env.JWT_SECRET || "";
  try {
    if (
      name === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Credentials are correct, create a JWT token
      const token = jwt.sign(
        { username: name },
        JWT_SECRET, // Ensure you have a secret for JWT generation stored in environment variables
        { expiresIn: "1h" } // Token expires in 1 hour, adjust based on needs
      );

      return { status: "success", token }; // Send the token to the client
    } else {
      throw new Error("Invalid credentials"); // Throw error for wrong credentials
    }
  } catch (error) {
    throw error; // Handle or throw error
  }
}
