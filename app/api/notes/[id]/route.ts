import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const cookieStore = await cookies();
  const { id } = await params;
  try {
    const { data } = await api.get(`notes/${id}`, {
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
