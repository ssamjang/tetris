document.addEventListener('DOMContentLoaded', ()=>{
  // find .grid in html doc and assign to 'grid'
  const grid = document.querySelector('.grid');
  // select all squares in grid and convert to array and assign to 'squares'
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0
  let timerId

  // Tetrominoes
  // Shape drawn from top left corner of 0-199 grid divs
  // Width of the grid is 10 px
  //
  const jTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const lTetromino = [
    [0, 1, width+1, width*2+1],
    [2, width, width+1, width+2],
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, width*2]
  ]

  const zTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [1, width+1, width+2, width*2+2],
    [width+1, width+2, width*2, width*2+1],
    [1, width+1, width+2, width*2+2]
  ]

  const sTetromino = [
    [width+1, width, width*2+2, width*2+1],
    [1, width+1, width, width*2],
    [width+1, width, width*2+2, width*2+1],
    [1, width+1, width, width*2]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const theTetrominoes =
    [jTetromino, lTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino];
  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];


  //draw the tetromino
  //current = the first shape and rotation in theTetrominoes
  function draw() {
    current.forEach(index => {
      //classList.add('css class') colours the squares from style.css
      //'tetromino' is the css class in style.css we made
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  //make the tetromino move down every second
  //timerId = setInterval(moveDown, 500)

  //assign function to keyCodes
  function control(e) {
    if(e.keyCode === 37){
      moveLeft()
    } else if (e.keyCode === 38){
      rotate()
    } else if (e.keyCode === 39){
      moveRight()
    } else if (e.keyCode === 40){
      moveDown()
    }
  }
  document.addEventListener('keydown', control)

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width; //add 10 to current pos (move down 1 row)
    draw();
    freeze();
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        currentRotation = 0
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()

    }
  }

  //move left, unless it is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition += 1
    }
    draw()
  }

  //move right, unless it is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -= 1
    }
    draw()
  }

  //rotate the tetromino
  function rotate(){
    undraw()
    currentRotation ++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  //show next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //j tetromino
    [0, 1, displayWidth+1, displayWidth*2+1], //l tetromino
    [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1], //z tetromino
    [displayWidth+1, displayWidth, displayWidth*2+2, displayWidth*2+1], //s tetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //t tetromino
    [0, 1, displayWidth, displayWidth+1], //o tetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i tetromino
  ]

  //display the shape in the mini-grid
  function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })

    upNextTetrominoes[nextRandom].forEach(index => {
    	displaySquares[displayIndex + index].classList.add('tetromino')
    });
  }

  //add functionality to the start/pause button
  startBtn.addEventListener('click', ()=> {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })










})
