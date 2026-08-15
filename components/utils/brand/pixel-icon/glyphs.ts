/* ---------------------------------------------------------------------------
 * Pixel glyphs.
 *
 * Each icon is a 9×9 bitmap written as nine strings of nine characters. `#` is
 * an inked cell, anything else is transparent. They are authored as ASCII on
 * purpose: the shape is legible in the source, a designer can edit one without
 * touching path data, and the grid is enforced by the format rather than by
 * discipline.
 *
 * 9×9 is the smallest odd square that still carries a recognisable silhouette
 * for this set — odd so that centred forms (the cross, the diamond, the bell
 * clapper) have a true middle column instead of straddling two.
 *
 * These replace Lucide only where an icon is decorative or symbolic — empty
 * states, section marks, stat headers. Lucide stays for dense functional UI,
 * where 16px line icons read better than a 9-cell bitmap.
 * ------------------------------------------------------------------------- */

export const PIXEL_GLYPHS = {
  /* Empty tray — the default "nothing here yet" mark. */
  inbox: [
    "#########",
    "#.......#",
    "#.......#",
    "#.......#",
    "###...###",
    "..#...#..",
    "..#####..",
    ".........",
    "#########",
  ],
  /* Warning — a solid triangle with the bang knocked out of it, so the mark
     reads at 18px where an outlined bang closes up into a blob. */
  alert: [
    "....#....",
    "...###...",
    "...#.#...",
    "..##.##..",
    "..##.##..",
    ".###.###.",
    ".##.#.##.",
    ".#######.",
    "#########",
  ],
  /* Heart — likes given. */
  heart: [
    ".##...##.",
    "#########",
    "#########",
    "#########",
    ".#######.",
    "..#####..",
    "...###...",
    "....#....",
    ".........",
  ],
  /* Two opposed arrows — a mutual match. The heads are drawn as diagonals off
     the shaft; the earlier version put them on the same side and read as
     filter sliders rather than as an exchange. */
  match: [
    "......#..",
    ".......#.",
    "#########",
    ".......#.",
    "......#..",
    "..#......",
    ".#.......",
    "#########",
    ".#.......",
  ],
  /* Bookmark — saved favourites. */
  bookmark: [
    "#######..",
    "#.....#..",
    "#.....#..",
    "#.....#..",
    "#.....#..",
    "#.....#..",
    "#..#..#..",
    "#.###.#..",
    "##...##..",
  ],
  /* Bar chart — analytics and performance. */
  chart: [
    ".........",
    "......##.",
    "......##.",
    "...##.##.",
    "...##.##.",
    "##.##.##.",
    "##.##.##.",
    "##.##.##.",
    "#########",
  ],
  /* Pulse — one continuous trace that runs flat, dips, then climbs. Drawn as a
     single unbroken line of cells; the previous version was symmetric about
     the centre and read as a row of W's rather than as a reading. */
  pulse: [
    ".........",
    ".........",
    ".......##",
    "......#..",
    "##...#...",
    "..#.#....",
    "...#.....",
    ".........",
    ".........",
  ],
  /* Two figures — people, matches, candidates. */
  users: [
    "..##.##..",
    "..##.##..",
    ".........",
    ".##...##.",
    "####.####",
    "#########",
    "#.......#",
    "#.......#",
    ".........",
  ],
  /* Speech frame — messages. */
  message: [
    "#########",
    "#.......#",
    "#.#.#.#.#",
    "#.......#",
    "#.#.#.#.#",
    "#.......#",
    "####.####",
    "..##.....",
    "..#......",
  ],
  /* Bell — notifications. */
  bell: [
    "....#....",
    "...###...",
    "..#####..",
    "..#####..",
    ".#######.",
    ".#######.",
    "#########",
    ".........",
    "...###...",
  ],
  /* Document — resumes and files. */
  document: [
    "######...",
    "#....##..",
    "#.....#..",
    "#.....#..",
    "#.###.#..",
    "#.....#..",
    "#.###.#..",
    "#.....#..",
    "#######..",
  ],
  /* Plus — add a record. */
  plus: [
    ".........",
    "...###...",
    "...###...",
    "...###...",
    "#########",
    "#########",
    "...###...",
    "...###...",
    "...###...",
  ],
  /* Magnifier — search. */
  search: [
    ".#####...",
    "#.....#..",
    "#.....#..",
    "#.....#..",
    "#.....#..",
    ".#####...",
    "....###..",
    ".....###.",
    "......###",
  ],
  /* Briefcase — open roles and jobs. */
  briefcase: [
    "...###...",
    "..#...#..",
    "#########",
    "#.......#",
    "#..###..#",
    "#..###..#",
    "#.......#",
    "#.......#",
    "#########",
  ],
  /* Calendar — interviews and scheduling. */
  calendar: [
    ".#.....#.",
    ".#.....#.",
    "#########",
    "#.......#",
    "#.##.##.#",
    "#.......#",
    "#.##.##.#",
    "#.......#",
    "#########",
  ],
  /* Check — success and completion. */
  check: [
    ".........",
    ".......##",
    "......##.",
    ".....##..",
    "##..##...",
    ".####....",
    "..##.....",
    ".........",
    ".........",
  ],
} as const;

export type TPixelGlyph = keyof typeof PIXEL_GLYPHS;
