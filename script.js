const imgInput = document.getElementById("imgInput");
const topTextInput = document.getElementById("topText");
const bottomTextInput = document.getElementById("bottomText");
const fontSizeInput = document.getElementById("fontSize");
const colorInput = document.getElementById("color");
const downloadBtn = document.getElementById("downloadBtn");
const uploadBtn = document.getElementById("uploadBtn");
const resetBtn = document.getElementById("resetBtn");

const topXInput = document.getElementById("topX");
const topYInput = document.getElementById("topY");
const bottomXInput = document.getElementById("bottomX");
const bottomYInput = document.getElementById("bottomY");

const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
let uploadedImage;

// Upload image
imgInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      topXInput.max = bottomXInput.max = canvas.width;
      topYInput.max = bottomYInput.max = canvas.height;

      uploadedImage = img;
      drawMeme();
    };
  };
  reader.readAsDataURL(file);
});

// Redraw when inputs change
[
  topTextInput, bottomTextInput, fontSizeInput, colorInput,
  topXInput, topYInput, bottomXInput, bottomYInput
].forEach(input => input.addEventListener("input", drawMeme));

function drawMeme() {
  if (!uploadedImage) return;

  ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colorInput.value;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";
  ctx.font = `${fontSizeInput.value}px Impact`;

  const topX = parseInt(topXInput.value);
  const topY = parseInt(topYInput.value);
  const bottomX = parseInt(bottomXInput.value);
  const bottomY = parseInt(bottomYInput.value);

  ctx.fillText(topTextInput.value, topX, topY);
  ctx.strokeText(topTextInput.value, topX, topY);

  ctx.fillText(bottomTextInput.value, bottomX, bottomY);
  ctx.strokeText(bottomTextInput.value, bottomX, bottomY);
}

// Download meme
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Upload meme to server
uploadBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first!");
    return;
  }

  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "meme.png");

    try {
      const res = await fetch("/api/memes/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      const url = `${window.location.origin}${data.imageUrl}`;
      alert("✅ Meme uploaded! URL: " + url);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("⚠️ Upload failed. Check backend logs.");
    }
  });
});

// Reset everything
resetBtn.addEventListener("click", () => {
  topTextInput.value = "";
  bottomTextInput.value = "";
  fontSizeInput.value = "32";
  colorInput.value = "#ffffff";
  topXInput.value = "300";
  topYInput.value = "50";
  bottomXInput.value = "300";
  bottomYInput.value = "550";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (uploadedImage) drawMeme();
});