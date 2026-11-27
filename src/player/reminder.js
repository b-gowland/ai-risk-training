// Coming back without a login (27 Nov 2026).
//
// One-off sessions fade within weeks (scam forewarning lost significance by
// four weeks in Scheibe et al. 2014; fraud education needed a reminder at
// three months to last, Burke et al. 2021). A calendar file made in the
// browser is a refresher that needs no account and sends nothing anywhere:
// the file goes straight from this page to the player's own device.

// The public address, not window.location: inside an LMS the page is served
// from the LMS's own domain, and a link there would lead nowhere.
export const SITE = 'https://app.airiskpractice.org';

// The static page has a real path, a link preview and the tell, so it is the
// right thing to send to family or put in a calendar.
export const scenarioUrl = (id) => `${SITE}/scenarios/${id}/`;

const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

// RFC 5545 text values escape backslash, semicolon, comma and newline.
const esc = (t) => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// Lines longer than 75 octets must be folded. Folding by characters keeps
// this simple and is safe for the plain text used here.
const fold = (line) => {
  const out = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  out.push(rest);
  return out.join('\r\n');
};

// An all-day event fourteen days from `now`, so it lands on the right date
// whatever the time zone, with no time to get wrong.
export function reminderFile(scenario, now) {
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  const next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  const date = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const url = scenarioUrl(scenario.id);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AI Risk Practice//Reminder//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${scenario.id}-${stamp(now)}@airiskpractice.org`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART;VALUE=DATE:${date(day)}`,
    `DTEND;VALUE=DATE:${date(next)}`,
    `SUMMARY:${esc(`AI Risk Practice: ${scenario.title}`)}`,
    `DESCRIPTION:${esc(`${scenario.tell}\n\nTwo minutes to check it still comes to mind: ${url}`)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
