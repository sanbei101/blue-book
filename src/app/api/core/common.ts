import { NextResponse } from "next/server";

export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

export function errorResponse(message: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>({ success: false, error: message }, { status });
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data, message });
}
