"use client";

import { useState, useEffect } from "react";

function SongCard({ song, darkMode }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const occurrences = song.occurrences || [];
  const selected = occurrences[selectedIndex] || occurrences[0] || {};
  const thumbnail = selected.videoId
    ? `https://img.youtube.com/vi/${selected.videoId}/hqdefault.jpg`
    : "";

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          padding: "10px",
          borderRadius: "16px",
          backgroundColor: darkMode
            ? "rgba(91,33,182,0.6)"
            : "rgba(255,255,255,0.6)",
          color: darkMode ? "#fff" : "#6b21a8",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
          overflow: "hidden",
          fontSize: "12px",
          minHeight: "300px",
        }}
      >
        <img
          src="/kyomu1.png"
          alt="icon"
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            width: "16px",
            height: "16px",
          }}
        />
        <div>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "2px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              lineHeight: "1.2",
            }}
          >
            {song.title}
          </h2>
          <p
            style={{
              fontSize: "11px",
              margin: "2px 0 6px 0",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            {song.artist}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              marginBottom: "8px",
            }}
          >
            {occurrences.map((o, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                style={{
                  fontSize: "11px",
                  padding: "2px 5px",
                  borderRadius: "10px",
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
        </div>

        {selected.videoId && (
          <div
            onClick={() => setShowModal(true)}
            style={{
              width: "100%",
              height: "200px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <img
              src={thumbnail}
              alt="thumbnail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "26px",
                color: "#fff",
              }}
            >
              ▶
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "600px",
              aspectRatio: "16/9",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#000",
              position: "relative",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selected.videoId}?start=${
                selected.start || 0
              }&autoplay=1`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
              title={song.title || "動画"}
            />
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const [dateDesc, setDateDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [cols, setCols] = useState(3);

  const PAGE_SIZE = 30;

  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 900) setCols(4);
      else if (w < 1200) setCols(5);
      else setCols(6);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch(() => setSongs([]));
  }, []);

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
    .filter(
      (s) =>
        s.title.toLowerCase().replace(/[\u3000]/g, " ").includes(search.toLowerCase().replace(/[\u3000]/g, " ")) ||
        s.artist.toLowerCase().replace(/[\u3000]/g, " ").includes(search.toLowerCase().replace(/[\u3000]/g, " "))
    )
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
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
          }}
        >
          ♄ネガちデータベース
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
              fontSize: "12px",
            }}
          >
            このサイトについて
          </a>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: "18px",
        }}
      >
        {pageData.map((song) => (
          <SongCard
            key={song.title + song.artist}
            song={song}
            darkMode={darkMode}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          marginTop: "24px",
          flexWrap: "wrap",
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

        <input
          type="number"
          min="1"
          max={totalPages}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          placeholder="ページ番号"
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "2px solid #fff",
            outline: "none",
            width: "80px",
          }}
        />
        <button
          onClick={() => {
            const p = Math.min(Math.max(1, Number(pageInput)), totalPages);
            if (!isNaN(p)) setPage(p);
            setPageInput("");
          }}
          style={{
            padding: "6px 12px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#fff",
            color: "#d946ef",
            cursor: "pointer",
          }}
        >
          移動
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "16px", color: "#fff" }}>
        現在 {filtered.length} 曲表示中
      </p>
    </main>
  );
}