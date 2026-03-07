import React from "react";

const StatCard = ({ label, value, color, sub }) => {
  return (
    <div
      style={{
        background: "#16181d",
        borderRadius: 16,
        padding: "20px 22px",
        flex: 1,
        border: `1px solid ${color}18`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `${color}12`,
        }}
      />
      <div
        style={{
          fontSize: 11,
          color: "#4b5563",
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: 1,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: color,
          fontFamily: "'IBM Plex Mono', monospace",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: "#4b5563",
            marginTop: 8,
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

export default StatCard;
