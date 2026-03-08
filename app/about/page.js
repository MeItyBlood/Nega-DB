"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function About() {
  const [darkMode, setDarkMode] = useState(false);

  // 初回読み込み時に保存値を読む
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: darkMode
          ? "linear-gradient(135deg, #1f2937, #4b5563)"
          : "linear-gradient(135deg, #d946ef, #f43f5e)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: darkMode
            ? "rgba(91,33,182,0.9)"
            : "rgba(255,255,255,0.15)",
          padding: "32px",
          borderRadius: "20px",
          lineHeight: "1.8",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          このサイトについて
        </h1>

        <p>
          本サイトは個人的にまとめていた記録を、ある程度形を整えて管理している非公式ファンサイトです。
        </p>

        <p>
          本サイトでは
          <a
            href="https://youtube.com/channel/UCqBUNxnRjk-BHL4yOSGBknw"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffffff", textDecoration: "underline", fontWeight: "bold" }}
          >
            瀬川ネガの公式チャンネル
          </a>
          にて公開されている動画を埋め込み形式で掲載しています。
        </p>

        <p>掲載情報は参考目的であり、正確性・完全性を保証するものではありません。</p>
        <p>埋め込み動画の著作権は各権利者に帰属します。</p>

        <p>
          問題や不足がある場合は紅(
          <a
            href="https://twitter.com/MeIty_Blood"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffffff", textDecoration: "underline", fontWeight: "bold" }}
          >
            ＠MeIty_Blood
          </a>
          )までご連絡ください。
        </p>

        <p>サイトの構成は変更されることが多々あるかもしれませんがご了承ください。</p>
        <p>本サイトの利用により生じた損害について責任を負いかねます。</p>

        <p style={{ marginTop: "24px", fontWeight: "bold", textAlign: "center" }}>
          ご理解のうえご利用ください。
        </p>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {/* ダークモード切替 */}
          <button
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              localStorage.setItem("darkMode", newMode);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#ffffff",
              color: "#d946ef",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {darkMode ? "ライト" : "ダーク"}
          </button>

          {/* トップページリンク */}
          <Link
            href="/"
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              color: "#d946ef",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}