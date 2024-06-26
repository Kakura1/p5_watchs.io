let hourOffset = 0;
let minuteOffset = 0;
let secondOffset = 0;

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(24);
  // Configurar el input
  let input = createInput('');
  input.position(550, 800);
  let button = createButton('Configurar Hora');
  button.position(input.x + input.width + 15, input.y);
  button.mousePressed(setCustomTime);
}

function draw() {
  background(255);
  // Calcular la hora para cada reloj
  let currentTime = new Date();
  let hour1 = (currentTime.getHours() + hourOffset + 9) % 12;
  let hour2 = (currentTime.getHours() + hourOffset + 3) % 12;
  let hour3 = (currentTime.getHours() + hourOffset + 4) % 12;
  let minute = currentTime.getMinutes();
  let second = currentTime.getSeconds();
  // Dibujar los relojes
  drawClock(width / 4 - 10, height / 2, hour1, minute, second, "puntoPendiente");
  drawClock(width / 2 - 5, height / 2, hour2, minute, second, "DDA");
  drawClock(width * 3 / 4, height / 2, hour3, minute, second, "Bresenham");
}

function drawClock(x, y, h, m, s, algorithm) {
  // Dibujar el círculo del reloj
  stroke(0);
  strokeWeight(2);
  noFill();
  drawCircle(x, y, 100);
  // Dibujar las manecillas
  switch (algorithm) {
    case "puntoPendiente":
      drawHandPuntoPendiente(x, y, h % 12 * TWO_PI / 12 - HALF_PI, 50, 6, "red"); // Horas
      drawHandPuntoPendiente(x, y, m * TWO_PI / 60 - HALF_PI, 70, 4, "blue"); // Minutos
      drawHandPuntoPendiente(x, y, s * TWO_PI / 60 - HALF_PI, 90, 2, "green"); // Segundos
      break;
    case "DDA":
      drawHandDDA(x, y, h % 12 * TWO_PI / 12 - HALF_PI, 50, 6, "red"); // Horas
      drawHandDDA(x, y, m * TWO_PI / 60 - HALF_PI, 70, 4, "blue"); // Minutos
      drawHandDDA(x, y, s * TWO_PI / 60 - HALF_PI, 90, 2, "green"); // Segundos
      break;
    case "Bresenham":
      drawHandPuntoPendiente(x, y, h % 12 * TWO_PI / 12 - HALF_PI, 50, 6, "red"); // Horas
      drawHandPuntoPendiente(x, y, m * TWO_PI / 60 - HALF_PI, 70, 4, "blue"); // Minutos
      drawHandPuntoPendiente(x, y, s * TWO_PI / 60 - HALF_PI, 90, 2, "green"); // Segundos
      break;
  }
}

function drawHand(x, y, angle, length, weight) {
  strokeWeight(weight);
  line(x, y, x + cos(angle) * length, y + sin(angle) * length);
}

function setCustomTime() {
  let customTime = parseInt(document.querySelector('input').value);
  hourOffset = customTime - new Date().getHours();
}

function drawHandPuntoPendiente(x, y, angle, length, weight, color) {
  stroke(color);
  let endX = x + cos(angle) * length;
  let endY = y + sin(angle) * length;
  let dx = endX - x;
  let dy = endY - y;
  let steps = max(abs(dx), abs(dy));
  let xIncrement = dx / steps;
  let yIncrement = dy / steps;
  let xCurrent = x;
  let yCurrent = y;
  strokeWeight(weight);
  for (let i = 0; i < steps; i++) {
    point(xCurrent, yCurrent);
    xCurrent += xIncrement;
    yCurrent += yIncrement;
  }
}

function drawHandDDA(x, y, angle, length, weight, color) {
  stroke(color);
  let xEnd = x + cos(angle) * length;
  let yEnd = y + sin(angle) * length;
  let dx = xEnd - x;
  let dy = yEnd - y;
  let steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);
  let xIncrement = dx / steps;
  let yIncrement = dy / steps;
  let xCurrent = x;
  let yCurrent = y;
  strokeWeight(weight);
  for (let i = 0; i < steps; i++) {
    point(xCurrent, yCurrent);
    xCurrent += xIncrement;
    yCurrent += yIncrement;
  }
}

function calculateEndPoint(x, y, angle, length) {
  let xEnd = Math.trunc(x + cos(angle) * length);
  let yEnd = Math.trunc(y + sin(angle) * length);
  return {x: xEnd, y: yEnd};
}

function drawHandBresenham(x, y, angle, length, weight, color) {
  stroke(color);
  let endPoint = calculateEndPoint(x, y, angle, length);
  let xEnd = endPoint.x;
  let yEnd = endPoint.y;
  let dx = abs(xEnd - x);
  let dy = abs(yEnd - y);
  let sx = x < xEnd ? 1 : -1;
  let sy = y < yEnd ? 1 : -1;
  let err = dx - dy;

  strokeWeight(weight);

  while (x !== xEnd || y !== yEnd) {
    point(x, y);
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (x === xEnd && y === yEnd) break;
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}



function drawCircle(xc, yc, r) {
  let x = r;
  let y = 0;
  let p = 1 - r;

  while (x > y) {
    point(xc + x, yc + y);
    point(xc - x, yc + y);
    point(xc + x, yc - y);
    point(xc - x, yc - y);
    point(xc + y, yc + x);
    point(xc - y, yc + x);
    point(xc + y, yc - x);
    point(xc - y, yc - x);

    y++;

    if (p <= 0) {
      p = p + 2 * y + 1;
    } else {
      x--;
      p = p + 2 * y - 2 * x + 1;
    }
  }
}