import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const iconBuffer = readFileSync(join(process.cwd(), "public/waveform-icon.png"));
  const iconSrc = `data:image/png;base64,${iconBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050f1c",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <img
          src={iconSrc}
          alt=""
          width={32}
          height={32}
          style={{ objectFit: "cover", objectPosition: "75% 40%" }}
        />
      </div>
    ),
    { ...size }
  );
}
