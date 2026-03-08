export async function GET() {
  const sheetURL = process.env.SHEET_URL;

  if (!sheetURL) {
    return Response.json({ error: "SHEET_URL not set" });
  }

  const res = await fetch(sheetURL);
  const text = await res.text();

  const rows = text.split("\n").slice(1);

  const songs = rows.map((row) => {
    const [id, title, artist, videoId, start, category, date] = row.split(",");
    return { id, title, artist, videoId, start, category, date };
  });

  return Response.json(songs);
}