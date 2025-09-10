import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const { data } = await api.get("notes", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(data);
  } catch (e) {
    const error = e as ApiError;
    return NextResponse.json(
      {
        error: error.response?.data.error ?? error.message,
      },
      {
        status: error.status,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = request.json();
  try {
    const { data } = await api.post("notes", body);
    return NextResponse.json(data);
  } catch (e) {
    const error = e as ApiError;
    return NextResponse.json(
      {
        error: error.response?.data.error ?? error.message,
      },
      {
        status: error.status,
      }
    );
  }
}
