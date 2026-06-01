import { NextResponse } from "next/server"
import { getAllVillas } from "@/lib/villas"

export async function GET() {
  try {
    const villas = await getAllVillas()

    return NextResponse.json({
      success: true,
      data: villas,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch villas",
      },
      { status: 500 }
    )
  }
}