/**
 * Calculates the position and size of a grid cell.
 * @param row Row index
 * @param col Column index
 * @param containerWidth Width of the container
 * @param containerHeight Height of the container
 * @param navBarHeight Height of the navigation bar
 */

const GRID_ROWS = 2;
const GRID_COLS = 2;

export const getGridCellPosition = (
  row: number,
  col: number,
  containerWidth: number,
  containerHeight: number,
  navBarHeight: number
) => {
  const cellWidth = containerWidth / GRID_COLS;
  const cellHeight = containerHeight / GRID_ROWS;
  return {
    x: Math.round(col * cellWidth),
    y: Math.round(row * cellHeight + navBarHeight),
    width: Math.round(cellWidth),
    height: Math.round(cellHeight),
  };
};
