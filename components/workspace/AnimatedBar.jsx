"use client";
import { useState, useEffect } from "react";

const AnimatedBar = ({ pct }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#6b7280",
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: 1,
          }}
        >
          COMPLETION
        </span>
        <span
          style={{
            fontSize: 13,
            color: "#a3c47a",
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          background: "#1e2128",
          borderRadius: 100,
          height: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 100,
            background: "linear-gradient(90deg, #a3c47a, #6ee7b7)",
            width: `${width}%`,
            transition: "width 1.2s cubic-bezier(.23,1,.32,1)",
            boxShadow: "0 0 12px #a3c47a66",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#374151",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          0
        </span>
        <span
          style={{
            fontSize: 10,
            color: "#374151",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          100
        </span>
      </div>
    </div>
  );
};

export default AnimatedBar;
