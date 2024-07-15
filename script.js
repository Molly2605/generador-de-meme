document.addEventListener("DOMContentLoaded", function () {
  const toggleImagePanel = document.getElementById("toggleImagePanel");
  const toggleTextPanel = document.getElementById("toggleTextPanel");
  const toggleDarkMode = document.getElementById("toggleDarkMode");
  const imageFilters = document.getElementById("imageFilters");
  const textOptions = document.getElementById("textOptions");
  const imageForm = document.getElementById("imageForm");
  const imageUrlInput = document.getElementById("imageUrl");
  const memeImage = document.getElementById("memeImage");
  const downloadButton = document.getElementById("downloadButton");
  const topTextDisplay = document.getElementById("topTextDisplay");
  const bottomTextDisplay = document.getElementById("bottomTextDisplay");

  // Modo oscuro
  toggleDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
  });

  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
  }

  /*alternar panel imagen a texto*/
  toggleImagePanel.addEventListener("click", function () {
    imageFilters.style.display = "block";
    textOptions.style.display = "none";
  });

  toggleTextPanel.addEventListener("click", function () {
    imageFilters.style.display = "none";
    textOptions.style.display = "block";
  });

  /*carga imagen*/
  imageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const imageUrl = imageUrlInput.value;
    memeImage.src = imageUrl;
  });

  /*editar y remover*/
  const editTopTextButton = document.getElementById("editTopText");
  const removeTopTextButton = document.getElementById("removeTopText");
  const editBottomTextButton = document.getElementById("editBottomText");
  const removeBottomTextButton = document.getElementById("removeBottomText");

  editTopTextButton.addEventListener("click", function () {
    const topText = prompt("Introduce el texto superior:");
    if (topText !== null) {
      topTextDisplay.textContent = topText;
      drawMeme();
    }
  });

  removeTopTextButton.addEventListener("click", function () {
    topTextDisplay.textContent = "";
    drawMeme();
  });

  editBottomTextButton.addEventListener("click", function () {
    const bottomText = prompt("Introduce el texto inferior:");
    if (bottomText !== null) {
      bottomTextDisplay.textContent = bottomText;
      drawMeme();
    }
  });

  removeBottomTextButton.addEventListener("click", function () {
    bottomTextDisplay.textContent = "";
    drawMeme();
  });

  /*restablecer filtros*/
  const resetFiltersButton = document.getElementById("resetFilters");
  resetFiltersButton.addEventListener("click", function () {
    document.querySelectorAll("input[type=range]").forEach(function (input) {
      input.value = input.getAttribute("value");
    });
    applyFilters();
  });

  /*aplicar filtros*/
  const brightnessControl = document.getElementById("brightness");
  const opacityControl = document.getElementById("opacity");
  const contrastControl = document.getElementById("contrast");
  const blurControl = document.getElementById("blur");
  const grayscaleControl = document.getElementById("grayscale");
  const sepiaControl = document.getElementById("sepia");
  const hueControl = document.getElementById("hue");
  const saturateControl = document.getElementById("saturate");
  const invertControl = document.getElementById("invert");

  const filterControls = [
    brightnessControl,
    opacityControl,
    contrastControl,
    blurControl,
    grayscaleControl,
    sepiaControl,
    hueControl,
    saturateControl,
    invertControl,
  ];

  filterControls.forEach(function (control) {
    control.addEventListener("input", applyFilters);
  });

  function applyFilters() {
    const brightness = brightnessControl.value;
    const opacity = opacityControl.value;
    const contrast = contrastControl.value;
    const blur = blurControl.value;
    const grayscale = grayscaleControl.value;
    const sepia = sepiaControl.value;
    const hue = hueControl.value;
    const saturate = saturateControl.value;
    const invert = invertControl.value;

    memeImage.style.filter = `
            brightness(${brightness}%)
            opacity(${opacity}%)
            contrast(${contrast}%)
            blur(${blur}px)
            grayscale(${grayscale}%)
            sepia(${sepia}%)
            hue-rotate(${hue}deg)
            saturate(${saturate}%)
            invert(${invert}%)
        `;
  }

  /*SI NO HAY meme*/
  downloadButton.addEventListener("click", function () {
    if (!memeImage.complete || memeImage.naturalWidth === 0) {
      alert("La imagen aún no se ha cargado completamente. Por favor, espera.");
      return;
    }

    drawMeme();
    downloadMeme();
  });

  /*SI HAY MEME, descarga*/
  function downloadMeme() {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "meme.png";
    link.click();
  }

  // Función para dibujar el meme en el lienzo con los textos y estilos aplicados
  function drawMeme() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = memeImage.naturalWidth;
    canvas.height = memeImage.naturalHeight;

    context.drawImage(memeImage, 0, 0, canvas.width, canvas.height);

    /*top y bottom text*/
    const topText = topTextDisplay.textContent;
    const bottomText = bottomTextDisplay.textContent;

    if (topText) {
      drawText(context, topText, canvas.width / 2, 10, "center");
    }
    if (bottomText) {
      drawText(
        context,
        bottomText,
        canvas.width / 2,
        canvas.height - 10,
        "center"
      );
    }

    /*edicion de texto*/
    function drawText(context, text, x, y, align) {
      const fontFamily = document.getElementById("fontFamily").value;
      const fontSize = document.getElementById("fontSize").value;
      const textColor = document.getElementById("textColor").value;
      const backgroundColor = document.getElementById("backgroundColor").value;
      const transparentBackground = document.getElementById(
        "transparentBackground"
      ).checked;
      const textPadding = document.getElementById("textPadding").value;
      const lineHeight = document.getElementById("lineHeight").value;

      context.font = `${fontSize}px ${fontFamily}`;
      context.fillStyle = textColor;
      context.textAlign = align;
      context.textBaseline = "middle";

      if (transparentBackground) {
        context.strokeStyle = textColor;
        context.strokeText(text, x, y);
      } else {
        context.fillStyle = backgroundColor;
        context.fillRect(
          x - context.measureText(text).width / 2 - textPadding,
          y - fontSize / 2 - textPadding,
          context.measureText(text).width + textPadding * 2,
          fontSize + textPadding * 2
        );
        context.fillStyle = textColor;
        context.fillText(text, x, y);
      }
    }

    
  }
});
