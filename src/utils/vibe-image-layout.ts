export type VibeImageLayout = {
  count: number;
  columns: number;
  rows: number;
  visibleRows: number;
  visibleCount: number;
  hiddenCount: number;
  isCollapsible: boolean;
};

const MAX_COLUMNS = 4;
const MAX_VISIBLE_ROWS = 4;

export function getVibeImageLayout(imageCount: number): VibeImageLayout {
  const count = Math.max(0, Math.floor(imageCount));

  if (count === 0) {
    return {
      count,
      columns: 0,
      rows: 0,
      visibleRows: 0,
      visibleCount: 0,
      hiddenCount: 0,
      isCollapsible: false,
    };
  }

  const columns = count <= 3 ? count : Math.min(MAX_COLUMNS, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / columns);
  const visibleRows = Math.min(rows, MAX_VISIBLE_ROWS);
  const visibleCount = Math.min(count, visibleRows * columns);

  return {
    count,
    columns,
    rows,
    visibleRows,
    visibleCount,
    hiddenCount: count - visibleCount,
    isCollapsible: rows > MAX_VISIBLE_ROWS,
  };
}
