/* ---------------------------------------------------------------------------
 * Neak — the pixel Apsara.
 *
 * A 24×34 sprite of the celestial dancer the product is named after, drawn to
 * the same reference the brand illustration uses: three-spire mokot, hair
 * framing the face and falling to the shoulder, gold collar and armbands, a
 * cream top over a coral sampot.
 *
 * The first attempt at this was 16×18 and read as uncanny. Three things were
 * wrong and all three are fixed here:
 *   - too small. A face needs more than three rows or the eyes become a skull's.
 *   - no hair. The head was a bare block of skin; the hair frame is most of
 *     what makes a small face read as a face.
 *   - skin painted from the ramp. Bright orange skin is a monster, not a
 *     dancer — it now has its own token.
 *
 * Poses are picked by what a surface means, not animated as a sequence.
 *
 * Palette keys:
 *   .  transparent   k  ink        g  gold light   G  gold deep
 *   h  hair          s  skin       w  cloth (top)  c/C  sampot
 * ------------------------------------------------------------------------- */

export const PIXEL_PET_SPRITES = {
  /* Standing, arms out with armbands showing — the resting pose. */
  idle: [
    "...........g............",
    "...........g............",
    "..........ggg...........",
    "..........ggg...........",
    ".......g..ggg..g........",
    ".......g..ggg..g........",
    "......ggg.ggg.ggg.......",
    ".....GGGGGGGGGGGGG......",
    ".....GggGGgggGGggG......",
    ".....GGGGGGGGGGGGG......",
    ".....hhhhhhhhhhhhh......",
    ".....hhssssssssshh......",
    ".....hhssssssssshh......",
    ".....hhskssssskshh......",
    ".....hhssssssssshh......",
    ".....hhssskskssshh......",
    ".....hh.sssssss.hh......",
    "......GGGGGGGGGGG.......",
    "....ssswwwwwwwwwsss.....",
    "...s...wwwwwwwww...s....",
    "...G...wwwwwwwww...G....",
    ".......GGGGGGGGG........",
    ".......ccccccccc........",
    "......ccccccccccc.......",
    "......ccccccccccc.......",
    ".....ccccccccccccc......",
    ".....ccccccccccccc......",
    "....ccccccccccccccc.....",
    "....CCCCCCCCCCCCCCC.....",
    "...CCCCCCCCCCCCCCCCC....",
    "...CCCCCCCCCCCCCCCCC....",
    "........sssssss.........",
    "........GGGGGGG.........",
    ".......sssssssss........",
  ],
  /* One arm raised in a mudra — greetings and first run. */
  wave: [
    "...........g............",
    "...........g............",
    "..........ggg...........",
    "..........ggg...........",
    ".......g..ggg..g........",
    ".......g..ggg..g........",
    "......ggg.ggg.ggg.......",
    ".....GGGGGGGGGGGGG......",
    ".....GggGGgggGGggG......",
    ".....GGGGGGGGGGGGG......",
    ".....hhhhhhhhhhhhh......",
    ".....hhssssssssshh......",
    ".....hhssssssssshh......",
    ".....hhskssssskshh...g..",
    ".....hhssssssssshh..s...",
    ".....hhssskskssshh.s....",
    ".....hh.sssssss.hhs.....",
    "......GGGGGGGGGGGs......",
    ".......wwwwwwwww........",
    "....ssswwwwwwwww........",
    "...s...wwwwwwwww........",
    ".......GGGGGGGGG........",
    ".......ccccccccc........",
    "......ccccccccccc.......",
    "......ccccccccccc.......",
    ".....ccccccccccccc......",
    ".....ccccccccccccc......",
    "....ccccccccccccccc.....",
    "....CCCCCCCCCCCCCCC.....",
    "...CCCCCCCCCCCCCCCCC....",
    "...CCCCCCCCCCCCCCCCC....",
    "........sssssss.........",
    "........GGGGGGG.........",
    ".......sssssssss........",
  ],
  /* Eyes closed, arms lowered — nothing here yet. */
  rest: [
    "...........g............",
    "...........g............",
    "..........ggg...........",
    "..........ggg...........",
    ".......g..ggg..g........",
    ".......g..ggg..g........",
    "......ggg.ggg.ggg.......",
    ".....GGGGGGGGGGGGG......",
    ".....GggGGgggGGggG......",
    ".....GGGGGGGGGGGGG......",
    ".....hhhhhhhhhhhhh......",
    ".....hhssssssssshh......",
    ".....hhssssssssshh......",
    ".....hhskkksskkkhh......",
    ".....hhssssssssshh......",
    ".....hhssssssssshh......",
    ".....hh.sssssss.hh......",
    "......GGGGGGGGGGG.......",
    ".......wwwwwwwww........",
    "....ssswwwwwwwwwsss.....",
    ".......wwwwwwwww........",
    ".......GGGGGGGGG........",
    ".......ccccccccc........",
    "......ccccccccccc.......",
    "......ccccccccccc.......",
    ".....ccccccccccccc......",
    ".....ccccccccccccc......",
    "....ccccccccccccccc.....",
    "....CCCCCCCCCCCCCCC.....",
    "...CCCCCCCCCCCCCCCCC....",
    "...CCCCCCCCCCCCCCCCC....",
    "........sssssss.........",
    "........GGGGGGG.........",
    ".......sssssssss........",
  ],
  /* Both arms raised — a match, a completed profile. */
  cheer: [
    "...........g............",
    "...........g............",
    "..........ggg...........",
    "..........ggg...........",
    ".......g..ggg..g........",
    ".......g..ggg..g........",
    "......ggg.ggg.ggg.......",
    ".....GGGGGGGGGGGGG......",
    ".....GggGGgggGGggG......",
    ".....GGGGGGGGGGGGG......",
    ".....hhhhhhhhhhhhh......",
    ".....hhssssssssshh......",
    ".....hhssssssssshh......",
    ".g...hhskssssskshh...g..",
    "..s..hhssssssssshh..s...",
    "...s.hhssskskssshh.s....",
    "....shh.sssssss.hhs.....",
    ".....sGGGGGGGGGGGs......",
    ".......wwwwwwwww........",
    ".......wwwwwwwww........",
    ".......wwwwwwwww........",
    ".......GGGGGGGGG........",
    ".......ccccccccc........",
    "......ccccccccccc.......",
    "......ccccccccccc.......",
    ".....ccccccccccccc......",
    ".....ccccccccccccc......",
    "....ccccccccccccccc.....",
    "....CCCCCCCCCCCCCCC.....",
    "...CCCCCCCCCCCCCCCCC....",
    "...CCCCCCCCCCCCCCCCC....",
    "........sssssss.........",
    "........GGGGGGG.........",
    ".......sssssssss........",
  ],
} as const;

export type TPixelPetPose = keyof typeof PIXEL_PET_SPRITES;

export const PET_WIDTH = 24;
export const PET_HEIGHT = 34;
