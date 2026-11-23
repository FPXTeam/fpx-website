import { BREVO_TEMPLATE, BREVO_STORY_TEMPLATE } from "./saw-point-brevo-template";
import { escapeHtml, monthLabel, type PreparedContent } from "./saw-point-publishing";

export function renderSawPointBrevo(input:{
  issue:string;date:string;title:string;coverUrl:string;linkedinUrl:string;prepared:PreparedContent;
}):string {
  const {issue,date,coverUrl,linkedinUrl,prepared}=input;
  // The approved Issue 004 Brevo layout and the native {{ unsubscribe }}
  // and {{ update_profile }} placeholders are deliberately preserved.
  const selected=prepared.storySummaries.slice(0,6);
  const stories=selected.map((story,index) =>
    BREVO_STORY_TEMPLATE
      .replaceAll("__SP_STORY_TITLE__",escapeHtml(story.title))
      .replaceAll("__SP_STORY_SUMMARY__",escapeHtml(story.summary))
      .replace(index===selected.length-1?'<div style="margin-bottom:24px;">':"__no_change__",index===selected.length-1?"<div>":"__no_change__")
  ).join("\n\n");
  const tokens:Record<string,string>={
    "__SP_ISSUE_TITLE__":escapeHtml("Saw Point | Issue "+issue+" | "+monthLabel(date)),
    "__SP_PREHEADER__":escapeHtml(prepared.preheader),
    "__SP_COVER_URL__":escapeHtml(coverUrl),
    "__SP_IMAGE_ALT__":escapeHtml("Saw Point Issue "+issue+" "+monthLabel(date)),
    "__SP_ISSUE_NUMBER__":escapeHtml(issue),
    "__SP_MONTH_YEAR__":escapeHtml(monthLabel(date).toUpperCase()),
    "__SP_EMAIL_HEADLINE__":escapeHtml(prepared.emailHeadline),
    "__SP_EMAIL_INTRO__":escapeHtml(prepared.emailIntro),
    "__SP_STORIES__":stories,
    "__SP_TEASER__":escapeHtml(prepared.teaser),
    "__SP_LINKEDIN_URL__":escapeHtml(linkedinUrl)
  };
  let output=BREVO_TEMPLATE;
  for(const [token,value] of Object.entries(tokens))output=output.replaceAll(token,value);
  return output;
}
