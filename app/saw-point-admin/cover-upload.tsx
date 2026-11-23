"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, ImagePlus, UploadCloud } from "lucide-react";

type CoverUploadResult = {
  ok?: boolean;
  url?: string;
  commitSha?: string;
  filename?: string;
  error?: string;
};

type UploadStatus = "idle" | "uploading" | "deploying" | "ready" | "pending" | "error";

export default function SawPointCoverUpload() {
  const [issue, setIssue] = useState("");
  const [month, setMonth] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function resetResult() {
    setCoverUrl("");
    setStatus("idle");
    setMessage("");
    setCopied(false);
  }

  async function checkDeployment(commitSha: string) {
    for (let attempt = 0; attempt < 36; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        const response = await fetch(
          "/api/saw-point-admin/status?sha=" + encodeURIComponent(commitSha),
          { cache: "no-store" }
        );
        if (!response.ok) continue;
        const result = await response.json();
        if (result?.status === "ready") {
          setStatus("ready");
          setMessage("Image is live on fpx.nz. Copy this link to reuse in Brevo and your website content.");
          return;
        }
        if (result?.status === "error") {
          setStatus("error");
          setMessage(result?.error || "The website deployment did not succeed. The file was saved to GitHub.");
          return;
        }
      } catch {
        // A temporary status-check failure does not invalidate the image upload.
      }
    }
    setStatus("pending");
    setMessage("Image saved. Vercel has not confirmed production yet. The link will work after the deployment finishes.");
  }

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setStatus("error");
      setMessage("Select your finished Saw Point cover image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setStatus("error");
      setMessage("The image must be 4 MB or smaller. Export a smaller copy and try again.");
      return;
    }

    setStatus("uploading");
    setCopied(false);
    setCoverUrl("");
    setMessage("Saving the original cover image to the FPX website...");
    const payload = new FormData();
    payload.set("issue", issue);
    payload.set("month", month);
    payload.set("cover", file);

    try {
      const response = await fetch("/api/saw-point-admin/upload-cover", {
        method: "POST",
        body: payload
      });
      const data = (await response.json()) as CoverUploadResult;
      if (!response.ok || !data.ok || !data.url || !data.commitSha) {
        throw new Error(data.error || "The cover could not be uploaded.");
      }
      setCoverUrl(data.url);
      setStatus("deploying");
      setMessage("Image saved. Publishing the permanent URL on fpx.nz...");
      await checkDeployment(data.commitSha);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The cover could not be uploaded.");
    }
  }

  async function copyUrl() {
    if (!coverUrl) return;
    try {
      await navigator.clipboard.writeText(coverUrl);
      setCopied(true);
    } catch {
      setCopied(false);
      setMessage("Select the link in the field and copy it manually.");
    }
  }

  return <section className="spcu-panel" aria-labelledby="spcu-heading">
    <div className="spcu-heading">
      <div>
        <span className="spcu-kicker">STEP 01 · COVER IMAGE</span>
        <h2 id="spcu-heading">Upload once. Use everywhere.</h2>
        <p>Prepare the cover yourself, then upload it here. FPX will host the original image at a reusable link that does not depend on LinkedIn.</p>
      </div>
      <span className="spcu-host">HOSTED ON FPX.NZ</span>
    </div>

    <form onSubmit={upload} className="spcu-form">
      <div className="spcu-fields">
        <label>
          <span>Issue number</span>
          <input value={issue} onChange={event => { setIssue(event.target.value); resetResult(); }}
            name="issue" type="text" inputMode="numeric" pattern="[0-9]{1,3}"
            maxLength={3} placeholder="005" required/>
        </label>
        <label>
          <span>Issue month and year</span>
          <input value={month} onChange={event => { setMonth(event.target.value); resetResult(); }}
            name="month" type="month" min="2026-01" max="2099-12" required/>
        </label>
      </div>
      <label className="spcu-file-label">
        <span>Finished cover image</span>
        <div className="spcu-file-area">
          <ImagePlus size={23} aria-hidden="true"/>
          <div>
            <strong>{file ? file.name : "Choose PNG, JPG or WebP"}</strong>
            <small>{file
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Original image preserved`
              : "Maximum 4 MB. We do not change the artwork or its wording."}</small>
          </div>
          <input type="file" name="cover" accept="image/png,image/jpeg,image/webp" required
            onChange={event => { setFile(event.currentTarget.files?.[0] || null); resetResult(); }}/>
        </div>
      </label>
      {preview && <figure className="spcu-preview">
        <img src={preview} alt="Preview of the selected Saw Point cover" />
        <figcaption>Cover preview. The complete image will be kept without cropping.</figcaption>
      </figure>}
      <button className="spcu-upload" type="submit" disabled={status === "uploading" || status === "deploying"}>
        <UploadCloud size={18} aria-hidden="true"/>
        {status === "uploading" ? "Uploading cover..." :
         status === "deploying" ? "Publishing image..." : "Upload cover and get link"}
      </button>
    </form>

    <div className={`spcu-status ${status}`} role="status" aria-live="polite">
      {status === "ready" && <CheckCircle2 size={18} aria-hidden="true"/>}
      <span>{message || "Your uploaded cover receives a permanent FPX image URL. No article is published by this step."}</span>
    </div>
    {coverUrl && <div className="spcu-result">
      <label htmlFor="spcu-image-url">YOUR FPX IMAGE URL</label>
      <div className="spcu-copy-row">
        <input id="spcu-image-url" type="text" value={coverUrl} readOnly onFocus={event => event.currentTarget.select()}/>
        <button type="button" onClick={copyUrl}><Copy size={16} aria-hidden="true"/>{copied ? "Copied" : "Copy URL"}</button>
      </div>
      <div className="spcu-actions">
        <a href={coverUrl} target="_blank" rel="noopener noreferrer">Open hosted image <ExternalLink size={14} aria-hidden="true"/></a>
        <span>Use this same URL for the Saw Point archive, Insights article, cover image and Brevo email.</span>
      </div>
    </div>}

    <style jsx>{`
      .spcu-panel{background:#fff;border:1px solid #dfe6e1;padding:30px;margin:0 0 28px}
      .spcu-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:26px}
      .spcu-kicker{font:700 11px/1.3 Lato,Arial,sans-serif;letter-spacing:.14em;color:#40973c}
      .spcu-heading h2{font-size:clamp(25px,3.3vw,35px);font-weight:750;letter-spacing:-.035em;line-height:1.12;margin:10px 0 9px;color:#102b1e}
      .spcu-heading p{font-size:14px;line-height:1.65;color:#64736c;max-width:620px;margin:0}
      .spcu-host{flex-shrink:0;border:1px solid #cbded0;background:#f2f8f3;color:#317443;border-radius:20px;font:700 10px/1.1 Lato,Arial,sans-serif;letter-spacing:.09em;padding:10px 12px}
      .spcu-form{display:grid;gap:19px}
      .spcu-fields{display:grid;grid-template-columns:1fr 1fr;gap:18px}
      .spcu-form label>span,.spcu-result label{display:block;margin-bottom:8px;font:700 11px/1 Lato,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#697f70}
      .spcu-fields input{width:100%;height:47px;border:1px solid #dce4dd;background:#fbfcfb;padding:10px 13px;font:400 14px/1.5 Arial,sans-serif;color:#132d20;border-radius:5px}
      .spcu-fields input:focus,.spcu-copy-row input:focus{outline:2px solid #91c69b;outline-offset:1px}
      .spcu-file-area{display:flex;align-items:center;gap:13px;border:1px dashed #aebfaf;border-radius:9px;background:#f8faf8;padding:20px;position:relative;min-height:82px;color:#438654}
      .spcu-file-area strong,.spcu-file-area small{display:block;overflow-wrap:anywhere}
      .spcu-file-area strong{font-size:14px;color:#163625}
      .spcu-file-area small{font-size:12px;line-height:1.5;color:#64736c;margin-top:4px}
      .spcu-file-area input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
      .spcu-file-area:focus-within{outline:2px solid #91c69b;outline-offset:2px}
      .spcu-preview{border:1px solid #dfe6e1;background:#f8faf8;border-radius:8px;padding:10px;margin:0}
      .spcu-preview img{display:block;max-width:100%;max-height:340px;object-fit:contain;margin:0 auto}
      .spcu-preview figcaption{text-align:center;margin-top:8px;font-size:12px;color:#64736c}
      .spcu-upload{display:inline-flex;gap:10px;align-items:center;justify-content:center;border:0;border-radius:6px;padding:16px 24px;background:#318544;color:#fff;font:700 13px/1 Lato,Arial,sans-serif;cursor:pointer;min-height:51px}
      .spcu-upload:disabled{opacity:.6;cursor:wait}
      .spcu-upload:hover:not(:disabled){background:#226934}
      .spcu-status{display:flex;gap:8px;align-items:center;margin-top:16px;padding:14px;background:#f4f7f4;color:#607568;font-size:13px;line-height:1.55}
      .spcu-status.ready{background:#eaf5ed;color:#286b3b}
      .spcu-status.error{background:#fff0ec;color:#953d30}
      .spcu-status.pending,.spcu-status.deploying{background:#fffaf0;color:#866329}
      .spcu-result{border-top:1px solid #e0e9e1;margin-top:24px;padding-top:24px}
      .spcu-copy-row{display:flex;gap:8px}
      .spcu-copy-row input{flex:1;min-width:0;border:1px solid #d5e1d8;border-radius:5px;background:#f9fbf9;padding:11px 12px;color:#18452a;font:400 13px/1.5 Arial,sans-serif}
      .spcu-copy-row button{flex-shrink:0;display:flex;gap:8px;align-items:center;border:0;background:#163d29;color:white;border-radius:5px;padding:0 16px;font:700 12px/1 Lato,Arial,sans-serif;cursor:pointer}
      .spcu-actions{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:13px}
      .spcu-actions a{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#287444;font-weight:700;text-decoration:underline;text-underline-offset:3px}
      .spcu-actions span{font-size:12px;color:#66786b}
      @media(max-width:700px){.spcu-panel{padding:22px}.spcu-heading{display:block}.spcu-host{display:inline-flex;margin-top:16px}.spcu-fields{grid-template-columns:1fr}.spcu-copy-row{flex-wrap:wrap}.spcu-copy-row button{min-height:43px;width:100%;justify-content:center}}
    `}</style>
  </section>;
}
