import {biSortBlocks, findBiPath} from "./bi_dijkstra.js";

let openFor = [],
    openBack = [],
    calcPath = false;

export function setup(canvas) {
  canvas.open = [];
  canvas.closed = [];
  canvas.path = [];
  openFor = [];
  openBack = [];
  calcPath = false;

  openFor.pushBlock(canvas.startBlock);
  openBack.pushBlock(canvas.endBlock);
  

  for (let i = 0; i < canvas.r; i++) {
    for (let j = 0; j < canvas.c; j++) {
      let haFor = canvas.calcHa(canvas.blocks[canvas.index(i, j)], canvas.endBlock),
          haBack = canvas.calcHa(canvas.blocks[canvas.index(i, j)], canvas.startBlock);
      canvas.blocks[canvas.index(i, j)].ha = [haFor, haBack];
      canvas.blocks[canvas.index(i, j)].ga = [0, 0];
      canvas.blocks[canvas.index(i, j)].fa = [Infinity, Infinity];
      canvas.blocks[canvas.index(i, j)].visited = [false, false];
      canvas.blocks[canvas.index(i, j)].previous = [undefined, undefined];
    }
  }
}

export function algo(canvas) {
  if (calcPath) {
    return findBiPath(canvas)
  }

  if (openFor.length > 0 || openBack.length > 0) {

// ================== FORWARD =====================

    if (openFor.length > 0) {
      biSortBlocks(openFor, true);
      let current = openFor[0]

      // if (end || in openBack);
      if (current.end || openBack.includes(current)) {
        console.log(current.fa);
        calcPath = true;
        canvas.path.pushBlock(current);
        return findBiPath(canvas);
      }

      openFor.shift();
      canvas.closed.pushBlock(current);
      current.visited[0] = true;

      for (let i = 0; i < current.neighbors.length; i++) {
        let neighbor = current.neighbors[i];
        if (!neighbor.visited[0] && !neighbor.wall) {
          
          let tentGa = current.ga[0] + canvas.calcHa(neighbor, current);
  
          if (!openFor.includes(neighbor)) {
            openFor.push(neighbor)
            canvas.open.pushBlock(neighbor);
          } else if (tentGa >= neighbor.ga[0]) {
            continue
          }
          
          neighbor.ga[0] = tentGa;
          neighbor.fa[0] = neighbor.ga[0] + neighbor.ha[0];
          neighbor.previous[0] = current;
        }
      }
    }

// ================== BACKWARDS =====================

    if (openBack.length > 0) {
      biSortBlocks(openBack, false);
      let current = openBack[0]

      // if (start || in openFor);
      if (current.start || openFor.includes(current)) {
        calcPath = true;
        canvas.path.pushBlock(current);
        return findBiPath(canvas);
      }

      openBack.shift();
      canvas.closed.pushBlock(current);
      current.visited[1] = true;

      for (let i = 0; i < current.neighbors.length; i++) {
        let neighbor = current.neighbors[i];
        if (!neighbor.visited[1] && !neighbor.wall) {
          
          let tentGa = current.ga[1] + canvas.calcHa(neighbor, current);
  
          if (!openBack.includes(neighbor)) {
            openBack.push(neighbor)
            canvas.open.pushBlock(neighbor);
          } else if (tentGa >= neighbor.ga[1]) {
            continue
          }
          
          neighbor.ga[1] = tentGa;
          neighbor.fa[1] = neighbor.ga[1] + neighbor.ha[1];
          neighbor.previous[1] = current;
        }
      }
    }


    return true
  } else {
    // no solution
    canvas.successfulAlgo = false;
    canvas.updateAlgo = true;
    return false
  }
}