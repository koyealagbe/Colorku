function Cell(row, col, fixed, value) {
  this.row = row;
  this.col = col;
  this.fixed = fixed;
  this.value = value;
  this.options = new Set();
}

function Board(size) {
  this.size = size;
  this.cells = new Array(size);
  this.initialize = function() {
    for (var i = 0; i < this.size; i++) {
      this.cells[i] = new Array(this.size);
      for (var j = 0; j < this.size; j++) {
        this.cells[i][j] = new Cell(i, j, false, 0);
        for (var k = 1; k < this.size + 1; k++) this.cells[i][j].options.add(k);
      }
    }
  }
}

function getRowCells(board, cell) {
  var cells = [];
  for (var i = 0; i < board.size; i++) cells.push(board.cells[cell.row][i]);
  return cells;
}

function getColCells(board, cell) {
  var cells = [];
  for (var i = 0; i < board.size; i++) cells.push(board.cells[i][cell.col]);
  return cells;
}

function getSquareCells(board, cell) {
  var cells = [];
  for (var i = 0; i < board.size; i++) {
    for (var j = 0; j < board.size; j++) {
      if (Math.floor(i / Math.sqrt(board.size)) == Math.floor(cell.row / Math.sqrt(board.size)) &&
          Math.floor(j / Math.sqrt(board.size)) == Math.floor(cell.col / Math.sqrt(board.size))) {
        cells.push(board.cells[i][j]);
      }
    }
  } 
  return cells;
}

function populateBoard(board, fixedCells) {
  for (var i = 0; i < fixedCells.length; i++) {
    var r = fixedCells[i].x;
    var c = fixedCells[i].y;
    var val = fixedCells[i].value;
    board.cells[r][c].fixed = true;
    board.cells[r][c].value = val;
    board.cells[r][c].options.clear();
    var rowCells = getRowCells(board, board.cells[r][c]);
    var colCells = getColCells(board, board.cells[r][c]);
    var squareCells = getSquareCells(board, board.cells[r][c]);
    for (var k = 0; k < board.size; k++) {
      rowCells[k].options.delete(val);
      colCells[k].options.delete(val);
      squareCells[k].options.delete(val);
    }
  }
  console.log(board);
}

function compareFreeCells(cell1, cell2) {
  return Array.from(cell1.options).length - Array.from(cell2.options).length;
}

function findFreeCell(board) {
  var cell = null;
  for (var i = 0; i < board.size; i++) {
    for (var j = 0; j < board.size; j++) {
      if (board.cells[i][j].value == 0) {
        cell = board.cells[i][j];
        break;
      }
    }
    if (cell) break;
  }

  for (var i = 0; i < board.size; i++) {
    for (var j = 0; j < board.size; j++) {
      if (board.cells[i][j].value == 0 && compareFreeCells(board.cells[i][j], cell) < 0) cell = board.cells[i][j];
    }
  }
  return cell;
}

function solvePuzzle(board) {
  // Base case: No empty cell, puzzle is solved
  var freeCell = new Cell();
  if (!(freeCell = findFreeCell(board))) {
    console.log("Solved!");
    return board;
  }

  // Recursive case
  var boardCopy = _.cloneDeep(board);
  for (var val of Array.from(board.cells[freeCell.row][freeCell.col].options)) {
    board.cells[freeCell.row][freeCell.col].value = val;
    var rowCells = getRowCells(board, board.cells[freeCell.row][freeCell.col]);
    var colCells = getColCells(board, board.cells[freeCell.row][freeCell.col]);
    var squareCells = getSquareCells(board, board.cells[freeCell.row][freeCell.col]);
    for (var i = 0; i < board.size; i++) {
      rowCells[i].options.delete(val);
      colCells[i].options.delete(val);
      squareCells[i].options.delete(val);
    }
    board.cells[freeCell.row][freeCell.col].options.clear();
    if (board = solvePuzzle(board)) {
      console.log("Returning true!");
      console.log(board);
      return board;
    }
    board = _.cloneDeep(boardCopy);
  }

  console.log("Returning false");
  return null;
}