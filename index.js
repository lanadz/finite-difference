window.onload = () => {
  const canvas = document.getElementById('coordinate-system');
  const ctx = canvas.getContext('2d');
  const step = 25;

  drawCoordinateSystem();

  function drawCoordinateSystem() {
    // Draw the axes
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw the markers on X-axis
    for (let i = step; i < canvas.width; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, canvas.height / 2 - 5);
      ctx.lineTo(i, canvas.height / 2 + 5);
      ctx.stroke();

      // Draw the label
      let label = (i - canvas.width / 2) / step;
      ctx.fillText(label, i - 5, canvas.height / 2 - 10);
    }

    // Draw the markers on Y-axis
    for (let i = step; i < canvas.height; i += step) {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 5, i);
      ctx.lineTo(canvas.width / 2 + 5, i);
      ctx.stroke();

      // Draw the label
      let label = (canvas.height / 2 - i) / step;
      ctx.fillText(label, canvas.width / 2 + 10, i + 5);
    }

    // Draw arrow on axis-X
    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, canvas.height / 2 - 5);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2 + 5);
    ctx.stroke();

    // Draw arrow on axis-Y
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 5, 10);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2 + 5, 10);
    ctx.stroke();

    // Draw the X and Y labels
    ctx.fillText("X", canvas.width - 10, canvas.height / 2 + 15);
    ctx.fillText("Y", canvas.width / 2 + 10, 10);
  }

  // Add new table row

  document.getElementById('add').addEventListener('click', function() {
    let plusButton = document.getElementById('add');
    let oldPlusCell = plusButton.parentElement;
    oldPlusCell.removeChild(plusButton);

    let table = document.getElementById('coords-table');
    let row = document.createElement('tr');
    let inputs = document.getElementById('coords').querySelectorAll('input[type="number"]');
    const indexForValues = inputs.length / 2 + 1;

    for (let i = 0; i < 3; i++) {
      let cell = document.createElement('td');
      let input = document.createElement('input');
      switch (i) {
        case 0:
          input.type = 'number';
          input.name = `x${indexForValues}`;
          input.value = indexForValues - 1;
          input.id = `x${indexForValues}`;
          cell.appendChild(input);
          break;
        case 1:
          input.type = 'number';
          input.name = `y${indexForValues}`;
          input.id = `y${indexForValues}`;
          cell.appendChild(input);
          break;
        case 2:
          cell.appendChild(plusButton);
          break;
      }
      row.appendChild(cell);
    }

    table.appendChild(row);
});
  // Guessing
  document.getElementById('find_differences').addEventListener('click', function(e) {
    e.preventDefault();
    let guessX = document.getElementById('x').value;
    let guessY = document.getElementById('y').value;

    // Convert guess coordinates to canvas coordinates
    let canvasX = guessX * step + canvas.width / 2;
    let canvasY = canvas.height / 2 - guessY * step;

    drawRedBall(canvasX, canvasY);
    // Draw projection lines
    ctx.strokeStyle = 'pink';
    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    ctx.lineTo(canvasX, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    ctx.lineTo(canvas.width / 2, canvasY);
    ctx.stroke();

    if (guessX > 10 || guessY > 10 || guessX < -10 || guessY < -10) {
      // Check if the guess is out of bounds
      drawWrongGuess(guessX, guessY)
      document.getElementById('result').innerHTML = 'RedBall flew away!';

      history.push({ x: guessX, y: guessY, status: "incorrect" });

    } else if (guessX == generatedX && guessY == generatedY) {
      document.getElementById('result').innerHTML = 'Correct!';
      document.getElementById('result').classList.add('green');
      document.getElementById('result').classList.remove('red');

      history.push({ x: guessX, y: guessY, status: "correct" });

      drawCorrectGuess(guessX, guessY);
      ({ x: generatedX, y: generatedY } = generateRandomPoint());
      renderPoint(generatedX, generatedY);

    } else {
      document.getElementById('result').innerHTML = 'Try again!';
      document.getElementById('result').classList.add('red');
      document.getElementById('result').classList.remove('green');

      history.push({ x: guessX, y: guessY, status: "incorrect" });
      drawWrongGuess(guessX, guessY)
    }

    renderHistory();
  });

  document.getElementById('clean').addEventListener('click', function (e) {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoordinateSystem();
  });
}

