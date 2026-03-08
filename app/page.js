"use client";
import { useEffect, useState } from "react";

/* ------------------ 曲カード ------------------ */
function SongCard({ song, darkMode }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const occurrences = song.occurrences || [];
  const selected = occurrences[selectedIndex] || occurrences[0] || {};
  const thumbnail = selected.videoId ? `https://img.youtube.com/vi/${selected.videoId}/hqdefault.jpg` : "";

  return (
    <div
      style={{
        position: "relative",
        padding: "16px",
        borderRadius: "20px",
        backgroundColor: darkMode ? "#5b21b6" : "#fff",
        color: darkMode ? "#fff" : "#6b21a8",
        boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      <img
        src="/kyomu1.png"
        alt="icon"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          width: "20px",
          height: "20px",
        }}
      />

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
        {song.title}
      </h2>
      <p>アーティスト: {song.artist}</p>

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        {occurrences.map((o, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedIndex(i);
              setLoaded(false);
            }}
            style={{
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                i === selectedIndex
                  ? "#facc15"
                  : darkMode
                  ? "#a78bfa"
                  : "#fbcfe8",
              color: "#111",
            }}
          >
            {o.date}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "12px" }}>
        {selected.videoId && (
          !loaded ? (
            <div onClick={() => setLoaded(true)} style={{ cursor: "pointer", position: "relative" }}>
              <img
                src={thumbnail}
                alt="thumbnail"
                style={{ width: "100%", borderRadius: "12px" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "40px",
                  color: "#fff",
                }}
              >
                ▶
              </div>
            </div>
          ) : (
            <iframe
              style={{ width: "100%", height: "160px", borderRadius: "12px" }}
              src={`https://www.youtube.com/embed/${selected.videoId}?start=${selected.start || 0}&autoplay=1`}
              title={song.title || "動画"}
              allowFullScreen
            />
          )
        )}
      </div>
    </div>
  );
}

/* ------------------ メイン ------------------ */
export default function Home() {
  const [songs, setSongs] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const [dateDesc, setDateDesc] = useState(true);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 30;

  /* ダークモード読み込み */
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);

  /* ダークモード保存 */
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  /* データ取得 */
  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch(() => setSongs([]));
  }, []);

  /* 曲まとめ */
  const groupedSongs = Object.values(
    songs.reduce((acc, song) => {
      const key = song.title + "||" + song.artist;
      if (!acc[key]) {
        acc[key] = {
          title: song.title,
          artist: song.artist,
          occurrences: [
            {
              date: song.date,
              videoId: song.videoId,
              start: song.start,
            },
          ],
        };
      } else {
        acc[key].occurrences.push({
          date: song.date,
          videoId: song.videoId,
          start: song.start,
        });
      }
      return acc;
    }, {})
  );

  /* 日付順ソート */
  groupedSongs.forEach((song) => {
    song.occurrences.sort((a, b) => {
      const dateDiff = dateDesc
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);

      if (dateDiff !== 0) return dateDiff;
      return (a.start || 0) - (b.start || 0);
    });
  });

  const filtered = groupedSongs
    .filter((s) => s.title.includes(search) || s.artist.includes(search))
    .sort((a, b) => (sortAZ ? a.title.localeCompare(b.title, "ja") : 0));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: darkMode
          ? "linear-gradient(135deg, #1f2937, #4b5563)"
          : "linear-gradient(135deg, #d946ef, #f43f5e)",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#fff" }}>
          ネガちデータベース
        </h1>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="曲名・アーティスト検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              border: "2px solid #fff",
              outline: "none",
              width: "200px",
            }}
          />

          <button
            onClick={() => setSortAZ(!sortAZ)}
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#fff",
              color: "#d946ef",
              cursor: "pointer",
            }}
          >
            {sortAZ ? "五十音順解除" : "五十音順"}
          </button>

          <button
            onClick={() => setDateDesc(!dateDesc)}
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#fff",
              color: "#d946ef",
              cursor: "pointer",
            }}
          >
            {dateDesc ? "日付：新→旧" : "日付：旧→新"}
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#fff",
              color: "#d946ef",
              cursor: "pointer",
            }}
          >
            {darkMode ? "ライト" : "ダーク"}
          </button>

          <a
            href="/about"
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              color: "#d946ef",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            このサイトについて
          </a>
        </div>
      </div>

      {/* カード */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "32px",
        }}
      >
        {pageData.map((song) => (
          <SongCard key={song.title + song.artist} song={song} darkMode={darkMode} />
        ))}
      </div>

      {/* ページネーション */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          style={{
            padding: "6px 12px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#fff",
            color: "#d946ef",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          前のページ
        </button>

        <span style={{ color: "#fff" }}>
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          style={{
            padding: "6px 12px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#fff",
            color: "#d946ef",
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          次のページ
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "16px", color: "#fff" }}>
        現在 {filtered.length} 曲表示中
      </p>
    </main>
  );
}