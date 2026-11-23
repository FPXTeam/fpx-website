import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const PUBLIC_ORIGIN = "https://www.fpx.nz";

function imageExtension(bytes: Buffer): "png" | "jpg" | "webp" | null {
  if (bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded image. Use a PNG, JPG or WebP under 4 MB." }, { status: 400 });
  }

  const rawIssue = String(form.get("issue") || "").trim();
  const issueNumber = Number(rawIssue);
  const month = String(form.get("month") || "").trim();
  const cover = form.get("cover");

  if (!/^\d{1,3}$/.test(rawIssue) || !Number.isInteger(issueNumber) || issueNumber < 1 || issueNumber > 999) {
    return NextResponse.json({ error: "Enter an issue number between 001 and 999." }, { status: 400 });
  }
  if (!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: "Choose the issue's month and year." }, { status: 400 });
  }
  if (!(cover instanceof File) || cover.size === 0) {
    return NextResponse.json({ error: "Select a cover image to upload." }, { status: 400 });
  }
  if (cover.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "This image is over 4 MB. Export a smaller PNG, JPG or WebP and try again." }, { status: 413 });
  }

  const bytes = Buffer.from(await cover.arrayBuffer());
  const extension = imageExtension(bytes);
  if (!extension) {
    return NextResponse.json({ error: "Only PNG, JPG and WebP cover images are supported." }, { status: 400 });
  }

  const token = process.env.GITHUB_PUBLISH_TOKEN;
  const repo = process.env.GITHUB_REPO || "FPXTeam/fpx-website";
  const branch = process.env.SAW_POINT_PUBLISH_BRANCH || "main";
  if (!token) {
    return NextResponse.json({ error: "The website's GitHub publishing connection is not configured." }, { status: 500 });
  }
  const [owner, repository] = repo.split("/");
  if (!owner || !repository) {
    return NextResponse.json({ error: "The website's GitHub repository is not configured." }, { status: 500 });
  }

  // Versioned filenames prevent older emails and newsletter issues changing
  // when a new cover is uploaded for the same month.
  const issue = String(issueNumber).padStart(3, "0");
  const fingerprint = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const unique = Date.now().toString(36);
  const fileName = `saw-point-${issue}-${month}-${fingerprint}-${unique}.${extension}`;
  const assetPath = `images/saw-point/covers/${fileName}`;
  const repoPath = `public/${assetPath}`;
  const contentUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${repoPath.split("/").map(encodeURIComponent).join("/")}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  };

  let uploaded: Response;
  try {
    uploaded = await fetch(contentUrl, {
      method: "PUT",
      headers,
      cache: "no-store",
      body: JSON.stringify({
        message: `Upload Saw Point Issue ${issue} cover (${month})`,
        content: bytes.toString("base64"),
        branch
      })
    });
  } catch {
    return NextResponse.json({ error: "Could not reach GitHub to save the image. Try again." }, { status: 502 });
  }

  if (!uploaded.ok) {
    const details = await uploaded.text();
    console.error("Saw Point cover upload failed:", uploaded.status, details.slice(0, 600));
    return NextResponse.json({ error: "The image could not be saved to FPX's website repository." }, { status: 502 });
  }

  const result = await uploaded.json();
  const commitSha = String(result?.commit?.sha || "");
  if (!commitSha) {
    return NextResponse.json({ error: "Image saved, but its deployment status could not be tracked." }, { status: 502 });
  }

  const deployHook = process.env.VERCEL_SAW_POINT_DEPLOY_HOOK;
  if (deployHook) {
    try {
      const deployment = await fetch(deployHook, { method: "POST" });
      if (!deployment.ok) console.error("Saw Point cover deployment hook failed:", deployment.status);
    } catch (error) {
      console.error("Saw Point cover deployment hook could not be reached:", error);
    }
  }

  return NextResponse.json({
    ok: true,
    issue,
    month,
    commitSha,
    url: `${PUBLIC_ORIGIN}/${assetPath}`,
    path: `/${assetPath}`,
    filename: fileName,
    branch
  });
}
