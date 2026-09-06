import { NextResponse } from "next/server";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const BUCKET = "invitation-media";
const MAX_BYTES = 3 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function ensureBucket() {
  const storage = supabase().storage;
  const { data, error } = await storage.getBucket(BUCKET);
  if (data) return;
  if (error && !/not found/i.test(error.message)) throw new Error(error.message);

  const { error: createError } = await storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_BYTES,
    allowedMimeTypes: Object.keys(EXTENSIONS),
  });
  // Two simultaneous first uploads can race to create the same bucket.
  if (createError && !/already exists|duplicate/i.test(createError.message)) {
    throw new Error(createError.message);
  }
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu tải lên không hợp lệ." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  const slug = String(form.get("slug") ?? "").replace(/[^a-z0-9-]/gi, "-");
  const target = String(form.get("target") ?? "image").replace(/[^a-z0-9-]/gi, "-");
  if (!(file instanceof File) || !slug) {
    return NextResponse.json({ error: "Thiếu ảnh hoặc mã thiệp." }, { status: 400 });
  }
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc GIF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ảnh nặng hơn 3 MB." }, { status: 413 });
  }

  // Preserve the in-memory development fallback without requiring Supabase.
  if (!supabaseConfigured) {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    return NextResponse.json({ url: `data:${file.type};base64,${base64}` });
  }

  try {
    await ensureBucket();
    const path = `${slug}/${target}-${crypto.randomUUID()}.${extension}`;
    const db = supabase();
    const bytes = await file.arrayBuffer();
    const { error } = await db.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = db.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không tải được ảnh." },
      { status: 500 },
    );
  }
}
