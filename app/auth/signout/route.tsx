import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  const url = new URL("/admin/login", request.url);
  return NextResponse.redirect(url, { status: 303 });
}