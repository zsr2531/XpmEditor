var lastColors = [];

function changeColor(value) {
  document.getElementById("color").value = value;
}

function onColorChange() {
  const newValue = document.getElementById("color").value;
  if (lastColors.indexOf(newValue) !== -1) {
    return;
  }

  const last = document.getElementById("recent-colors");
  const element = document.createElement("li");
  element.id = newValue.substring(1);
  element.innerHTML = `<button style="border: 2px solid black; background-color: ${newValue}; width: 18px; height: 18px;" onclick="changeColor('${newValue}')">`;

  last.prepend(element);
  lastColors.push(newValue);
}

function createCanvas(bypass) {
  if (!bypass && !confirm("Are you sure you want to create a new canvas? This operation will clear the canvas"))
    return;
  
  const cols = document.getElementById("col").value;
  const rows = document.getElementById("row").value;
  const grid = document.getElementById("pixels");
  
  grid.innerHTML = "";

  const count = cols * rows;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("button");
    item.style.backgroundColor = "transparent";
    item.onmouseover = function(e) {
      if (e.buttons === 1)
        fill(e.target);
      else if (e.buttons === 2)
        reset(e.target);
    }
    item.onmousedown = item.onmouseover;

    grid.appendChild(item);
  }

  document.getElementById("currCol").innerHTML = cols;
  document.getElementById("currRow").innerHTML = rows;
  onResolutionChanged();
}

function fill(pixel) {
  const color = document.getElementById("color").value;
  pixel.style.backgroundColor = color;
}

function reset(pixel) {
  pixel.style.backgroundColor = "transparent";
}

function collectColors() {
  let obj = {
    transparent: " "
  };

  let count = 0;
  const children = document.getElementById("pixels").children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    console.log(child);
    const color = child.style.backgroundColor;
    if (obj[color] !== undefined)
      continue;

    let char = String.fromCharCode(65 + count);
    count++;
    obj[color] = char;
  }

  obj.count = count + 1;
  return obj;
}

function zeroExtend(str) {
  if (str.length === 1) {
    return '0' + str;
  }

  return str;
}

function hexify(raw) {
  return zeroExtend(parseInt(raw).toString(16));
}

function colorToHex(color) {
  const regex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
  const matches = regex.exec(color);

  return '#' + hexify(matches[1]) + hexify(matches[2]) + hexify(matches[3]);
}

function generate() {
  const cols = parseInt(document.getElementById("currCol").innerText);
  const rows = parseInt(document.getElementById("currRow").innerText);
  const colors = collectColors();
  const header = `/* XPM */&#10;static char* icon[] = {&#10;"${cols} ${rows} ${colors.count} 1"`;
  const footer = "&#10;};";
  
  let content = "";
  
  for (let i in colors) {
    if (i == "count")
      continue;

    let name = i === "transparent" ? "None" : colorToHex(i);
    content += `,&#10;"${colors[i]}  c ${name}"`;
  }

  const pixels = document.getElementById("pixels").children;
  for (let row = 0; row < rows; row++) {
    content += ',&#10;"';

    for (let col = 0; col < cols; col++) {
      const pixel = pixels[row * cols + col];
      const color = pixel.style.backgroundColor;
      content += colors[color];
    }
    
    content += '"';
  }

  const final = header + content + footer;
  document.getElementById("code").innerHTML = final;
}

function onResolutionChanged() {
  const txt = document.getElementById("scale-text");
  const slider = document.getElementById("scale");
  const value = slider.value;

  txt.innerText = `${value}px`;
  const grid = document.getElementById("pixels");
  const cols = document.getElementById("col").value;
  const rows = document.getElementById("row").value;
  grid.style.gridTemplateColumns = `repeat(${cols}, ${value}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${value}px)`;
  
  const children = grid.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.width = value;
    children[i].style.height = value;
  }
}
