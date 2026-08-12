import { useRef, useState } from "react";
import heic2any from "heic2any";

const BUILDER_CLASSES = [
  "THE SHIPPER",
  "THE ARCHITECT",
  "THE HACKER",
  "THE BUILDER",
  "THE DEBUGGER",
  "THE DISRUPTOR",
  "THE SYSTEM THINKER",
  "THE NIGHT OWL",
];

function App() {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [builderClass, setBuilderClass] = useState("");

  // =========================
  // HANDLE PHOTO UPLOAD
  // =========================

  const handleFile = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      let imageFile = file;

      // Convert HEIC / HEIF to JPEG
      if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        const converted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.92,
        });

        imageFile = Array.isArray(converted)
          ? converted[0]
          : converted;
      }

      const imageUrl = URL.createObjectURL(imageFile);

      setPreview(imageUrl);
      setImageBlob(imageFile);

      // Generate random builder class
      const randomClass =
        BUILDER_CLASSES[
          Math.floor(Math.random() * BUILDER_CLASSES.length)
        ];

      setBuilderClass(randomClass);
    } catch (error) {
      console.error(error);
      alert("Couldn't process that image. Try another photo.");
    }
  };

  // =========================
  // LOAD IMAGE
  // =========================

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;

      image.src = src;
    });

  // =========================
  // COVER-CROP IMAGE
  // =========================

  const drawCoverImage = (
    ctx,
    image,
    x,
    y,
    width,
    height
  ) => {
    const imageRatio = image.width / image.height;
    const boxRatio = width / height;

    let sourceWidth;
    let sourceHeight;
    let sourceX;
    let sourceY;

    if (imageRatio > boxRatio) {
      sourceHeight = image.height;
      sourceWidth = image.height * boxRatio;

      sourceX = (image.width - sourceWidth) / 2;
      sourceY = 0;
    } else {
      sourceWidth = image.width;
      sourceHeight = image.width / boxRatio;

      sourceX = 0;
      sourceY = (image.height - sourceHeight) / 2;
    }

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height
    );
  };

  // =========================
  // CREATE CARD CANVAS
  // =========================

  const createCardCanvas = async () => {
    if (!imageBlob) return null;

    const canvas = document.createElement("canvas");

    const width = 1080;
    const height = 1500;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Your browser could not create the image.");
    }

    const imageUrl = URL.createObjectURL(imageBlob);

    try {
      const image = await loadImage(imageUrl);

      // =========================
      // BACKGROUND
      // =========================

      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, width, height);

      // =========================
      // HEADER
      // =========================

      ctx.fillStyle = "#f1eee5";
      ctx.font = "bold 30px Arial";

      ctx.textAlign = "left";

      ctx.fillText("HH", 55, 60);

      ctx.textAlign = "right";

      ctx.fillText(
        "GOA '26",
        width - 55,
        60
      );

      ctx.textAlign = "left";

      // =========================
      // PHOTO
      // =========================

      const photoX = 55;
      const photoY = 100;
      const photoWidth = width - 110;
      const photoHeight = photoWidth;

      drawCoverImage(
        ctx,
        image,
        photoX,
        photoY,
        photoWidth,
        photoHeight
      );

      // =========================
      // INFORMATION
      // =========================

      const infoY =
        photoY + photoHeight + 70;

      // =========================
      // NAME
      // =========================

      ctx.fillStyle = "#f1eee5";
      ctx.font = "bold 65px Arial";
      ctx.textAlign = "left";

      const displayName = (
        name || "YOUR NAME"
      ).toUpperCase();

      ctx.fillText(
        displayName,
        55,
        infoY
      );

      // =========================
      // STACK / ROLE
      // =========================

      ctx.font = "bold 26px Arial";
      ctx.fillStyle = "#aaaaaa";

      ctx.fillText(
        (
          stack || "YOUR STACK / ROLE"
        ).toUpperCase(),
        55,
        infoY + 45
      );

      // =========================
      // BUILDER CLASS
      // =========================

      const classText =
        builderClass || "BUILDER CLASS";

      ctx.font = "bold 25px Arial";

      const classWidth =
        ctx.measureText(classText).width + 40;

      ctx.fillStyle = "#d8ff00";

      ctx.fillRect(
        55,
        infoY + 80,
        classWidth,
        52
      );

      ctx.fillStyle = "#111111";

      ctx.fillText(
        classText,
        75,
        infoY + 115
      );

      // =========================
      // EVENT METADATA
      // =========================

      ctx.fillStyle = "#777777";
      ctx.font = "bold 19px Arial";

      ctx.fillText(
        "GOA, INDIA · 28—31 OCT 2026",
        55,
        height - 200
      );

      // =========================
      // FOOTER
      // =========================

      ctx.fillStyle = "#f1eee5";
      ctx.font = "bold 21px Arial";

      const footerY = height - 150;

      ctx.textAlign = "left";

      ctx.fillText(
        "LESS NOISE.",
        55,
        footerY
      );

      ctx.textAlign = "right";

      ctx.fillText(
        "MORE SIGNAL.",
        width - 55,
        footerY
      );

      ctx.textAlign = "left";

      return canvas;
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  // =========================
  // DOWNLOAD CARD
  // =========================

  const generateCard = async () => {
    if (!imageBlob) return;

    try {
      const canvas = await createCardCanvas();

      if (!canvas) return;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Couldn't generate the image.");
            return;
          }

          const url = URL.createObjectURL(blob);

          const link =
            document.createElement("a");

          link.href = url;

          link.download =
            "HH-Goa-2026-Builder-ID.png";

          link.style.display = "none";

          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        },
        "image/png"
      );
    } catch (error) {
      console.error(error);
      alert("Couldn't generate the builder card.");
    }
  };

  // =========================
  // SHARE TO X
  // =========================

  const shareToX = async () => {
    if (!imageBlob) return;

    const caption =
      "Built different at Hacker House Goa 2026. #FrameInGoa";

    try {
      const canvas = await createCardCanvas();

      if (!canvas) return;

      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          resolve,
          "image/png"
        );
      });

      if (!blob) {
        throw new Error(
          "Couldn't create share image."
        );
      }

      const file = new File(
        [blob],
        "HH-Goa-2026-Builder-ID.png",
        {
          type: "image/png",
        }
      );

      // =========================
      // MOBILE NATIVE SHARE
      // =========================

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          text: caption,
          files: [file],
        });

        return;
      }

      // =========================
      // DESKTOP X FALLBACK
      // =========================

      const xUrl =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(caption);

      window.open(
        xUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      // User cancelled native sharing
      if (error?.name === "AbortError") {
        return;
      }

      console.error(
        "Share failed:",
        error
      );

      alert(
        "Sharing isn't supported here. Download the image and post it on X."
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <main className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="brand">
          HH GOA 2026
        </div>

        <div className="nav-label">
          BUILDER ID / 01
        </div>

      </nav>

      {/* BUILDER */}

      <section className="builder">

        {/* LEFT SIDE */}

        <div className="builder-copy">

          <p className="eyebrow">
            HACKER HOUSE GOA
          </p>

          <h1>
            Build your
            <br />
            <span>identity.</span>
          </h1>

          <p className="description">
            Your photo. Your stack. Your
            builder class. One HH Goa
            identity ready to share.
          </p>

          <div className="form">

            {/* NAME */}

            <label>
              NAME

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                maxLength={32}
              />
            </label>

            {/* STACK */}

            <label>
              STACK / ROLE

              <input
                type="text"
                placeholder="e.g. AI / Full Stack / Designer"
                value={stack}
                onChange={(e) =>
                  setStack(e.target.value)
                }
                maxLength={40}
              />
            </label>

            {/* UPLOAD */}

            <button
              className="upload-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              {preview
                ? "Change Photo"
                : "Upload Photo"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/heic,image/heif"
              onChange={handleFile}
              hidden
            />

            <p className="formats">
              JPG · PNG · HEIC
            </p>

            {/* ACTION BUTTONS */}

            {preview && (
              <div className="action-buttons">

                <button
                  className="download-button"
                  onClick={generateCard}
                >
                  DOWNLOAD BUILDER ID
                </button>

                <button
                  className="share-button"
                  onClick={shareToX}
                >
                  SHARE TO X
                </button>

              </div>
            )}

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="card-area">

          <div className="builder-card">

            {/* CARD HEADER */}

            <div className="card-top">

              <span>
                HH
              </span>

              <span>
                GOA '26
              </span>

            </div>

            {/* PHOTO */}

            <div className="photo-container">

              {preview ? (

                <img
                  src={preview}
                  alt="Builder"
                />

              ) : (

                <div className="photo-placeholder">

                  <span>
                    UPLOAD
                  </span>

                  <strong>
                    PHOTO
                  </strong>

                </div>

              )}

            </div>

            {/* CARD INFORMATION */}

            <div className="card-info">

              <div className="builder-name">
                {name || "YOUR NAME"}
              </div>

              <div className="builder-stack">
                {stack ||
                  "YOUR STACK / ROLE"}
              </div>

              <div className="builder-class">
                {builderClass ||
                  "BUILDER CLASS"}
              </div>

            </div>

            {/* CARD FOOTER */}

            <div className="card-bottom">

              <span>
                LESS NOISE.
              </span>

              <span>
                MORE SIGNAL.
              </span>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default App;