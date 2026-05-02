import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const BUCKET_KTM = "ktm";
export const BUCKET_PAYMENT = "payment-proofs";
export const BUCKET_DELIVERABLE = "deliverables";

export async function uploadToBucket(
  bucket: string,
  path: string,
  file: Blob,
  contentType: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true });

  if (error) throw new Error(`Upload gagal: ${error.message}`);
  return path;
}

export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function signOrNull(bucket: string, path: string | null | undefined, expiresIn = 3600) {
  if (!path) return null;
  try {
    return await createSignedUrl(bucket, path, expiresIn);
  } catch {
    return null;
  }
}
