import { useEffect, useState } from "react";

export default function AnimatedProgress({ value }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setWidth(value);
    }, 200);
  }, [value]);

  return (
    <div style={styles.bar}>
      <div
        style={{
          ...styles.fill,
          width: `${width}%`,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  );
}

const styles = {
  bar: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    background: "#111827",
  },
};