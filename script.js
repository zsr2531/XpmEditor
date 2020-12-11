var lastColors = [];
document.addEventListener("onload", () => createCanvas(true));

function changeColor(value) {
  document.getElementById("color").value = value;
}

function onColorChange() {
  const newValue = document.getElementById("color").value;
  if (lastColors.indexOf(newValue) != -1) {
    return;
  }

  const last = document.getElementById("recent-colors");
  const element = document.createElement("li");
  element.innerHTML = `<button style="border: 2px solid black; background-color: ${newValue}; width: 18px; height: 18px;" onclick="changeColor('${newValue}')">`;

  last.prepend(element);
  lastColors.push(newValue);
}

function createCanvas(bypass) {
  if (!bypass) {
    if (!confirm("Are you sure you want to create a new canvas? This operation will clear the canvas"))
      return;
  }

  const cols = document.getElementById("col").value;
  const rows = document.getElementById("row").value;
}
