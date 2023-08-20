const chessboard = document.querySelector('#chessboard');
const submitPos = document.querySelector('#submitPos');
const resetPage = document.querySelector('#resetPos');
const startDiv = document.querySelector('#startPosition');
const endDiv = document.querySelector('#endPosition');
const modalContainer = document.querySelector('#modalContainer');
const modalContent = document.querySelector('#modalContent');
const modalButton = document.querySelector('#modalButton');
let startPos = null;
let endPos = null;

// Chessboard DOM
const chessBoardDOM = () => {
  const squares = Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => [row, col]),
  ).flat();

  squares.forEach(([row, col]) => {
    const square = document.createElement('div');
    square.id = `${row},${col}`;
    if ((row + col) % 2 === 0) {
      square.className = 'white';
    } else {
      square.className = 'black';
    }
    square.addEventListener('click', () => {
      if (startPos === null) {
        startPos = [row, col];
        startDiv.innerHTML = `[${startPos}]`;
        square.style.backgroundColor = 'rgba(152, 251, 152, 0.7)';
      } else if (endPos === null) {
        endPos = [row, col];
        endDiv.innerHTML = `[${endPos}]`;
        square.style.backgroundColor = 'rgba(240, 128, 128, 1)';
      }
    });
    chessboard.appendChild(square);
  });
};

const refreshPage = () => window.location.reload();

const showModal = message => {
  modalContent.textContent = message;
  modalContainer.style.display = 'block';
};

const closeModal = () => {
  const modalContainer = document.querySelector('#modalContainer');
  modalContainer.style.display = 'none';
};

const findPath = () => {
  const startPosition = startPos;
  const endPosition = endPos;

  if (startPosition === null || endPosition === null) {
    showModal('Please select start and end positions.');
    return;
  }

  const message = knightMoves(startPosition, endPosition);

  if (message === null) {
    showModal('No path found!');
    return;
  }

  showModal(message);

  // Highlight the squares on the path
  const path = message.split('\n').slice(1, -1);
  for (let pos of path) {
    const [x, y] = pos.split(',').map(Number);
    const square = document.getElementById(`${x},${y}`);
    square.style.backgroundColor = '#0080ff';
  }
};

// Algorithm logic
function createQueue() {
  const elements = [];

  const el = () => elements;

  function enqueue(element) {
    return elements.push(element);
  }

  function dequeue() {
    return elements.shift();
  }

  function isEmpty() {
    return elements.length === 0;
  }

  return {
    el,
    enqueue,
    dequeue,
    isEmpty,
  };
}

const knightFactory = (x, y, distance = null, visited = false, prev = null) => {
  return {
    x,
    y,
    distance,
    visited,
    prev,
  };
};

const createGameBoard = () => {
  const chessBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));

  return chessBoard;
};

const getLegalMoves = (knightPosX, knightPosY) => {
  let x = knightPosX;
  let y = knightPosY;

  let legalMoves = [
    { x: x + 2, y: y + 1 },
    { x: x + 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x + 1, y: y + 2 },
    { x: x - 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x + 1, y: y - 2 },
  ];

  legalMoves = legalMoves.filter(
    move => move.x >= 0 && move.x <= 7 && move.y >= 0 && move.y <= 7,
  );

  return legalMoves;
};

const knightMoves = (startPos, endPos) => {
  const visited = new Set();

  const startingX = startPos[0];
  const startingY = startPos[1];
  let startingKnight = knightFactory(startingX, startingY, 0, true, null);
  visited.add(`${startingX}, ${startingY}`);

  // Create a queue using the queue function and enqueue the startingKnight object.
  const queue = createQueue();
  queue.enqueue(startingKnight);

  while (!queue.isEmpty()) {
    const current = queue.dequeue();

    if (current.x === endPos[0] && current.y === endPos[1]) {
      const path = [];
      let node = current;
      while (node !== null) {
        path.unshift([node.x, node.y]);
        node = node.prev;
      }
      const distance = path.length;
      const message = `You made it in ${distance} moves! Here's your path:\n${path.join(
        '\n',
      )}\n`;
      return message;
    } else {
      const checkLegalMoves = getLegalMoves(current.x, current.y);

      for (let move of checkLegalMoves) {
        const newKnight = knightFactory(
          move.x,
          move.y,
          current.distance + 1,
          true,
        );

        const newPosKey = `${move.x}, ${move.y}`;
        if (!visited.has(newPosKey)) {
          visited.add(newPosKey);
          newKnight.prev = current;
          queue.enqueue(newKnight);
        }
      }
    }
  }

  return null;
};

chessBoardDOM();

// Event listeners
submitPos.addEventListener('click', findPath);
resetPage.addEventListener('click', refreshPage);
modalContainer.addEventListener('click', closeModal);