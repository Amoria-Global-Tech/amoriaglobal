
import { NextResponse } from "next/server";
import client from "../utils/db"; // Adjust the path as needed

export async function GET() {
  try {
    let query = "SELECT * FROM products";

    const result = await client.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
