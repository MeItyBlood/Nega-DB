export async function GET() {
  const sheetURL = process.env.SHEET_URL;

  if (!sheetURL) {
    return Response.json([], { status: 200 }); // 空配列返す
  }

  try {
    const res = await fetch(sheetURL);
    if (!res.ok) return Response.json([], { status: 200 });

    const text = await res.text();
    const rows = text.split("\n").slice(1); // ヘッダー行除外

    const songs = rows.map((row) => {
      // CSV内のカンマを安全に扱う（簡易版：列数不足は空文字）
      const cols = row.split(",");
      const [id, title, artist, videoId, start, category, date] = cols.map(c => c?.trim() || "");
      return { id, title, artist, videoId, start, category, date };
    });

    return Response.json(songs);
  } catch (e) {
    return Response.json([], { status: 200 }); // fetch失敗時も空配列
  }
}