/* ---------------------------------------------------------------------------
 * Neak — the pixel Apsara.
 *
 * A 32×34 bust of the celestial dancer the product is named after: mokot,
 * face, collar and shoulders. A portrait rather than a full figure, because
 * the Apsara identity lives almost entirely in the crown — spending the whole
 * canvas on it buys five spires, a jewelled band and side pendants, none of
 * which survive on a figure small enough to fit beside body and legs.
 *
 * It took several rounds to stop the face reading as uncanny. What was wrong,
 * in the order it mattered:
 *   - brows. Three cells of dark mass above the eye *is* a scowl at this
 *     scale. Removing them removed the anger; there are no brows now.
 *   - the mouth was a dark 5-cell bar, which reads as a grimace. It is two
 *     cells in a shade close to skin.
 *   - the face was a flat ±6 slab with square corners, which reads as a mask.
 *     It has a rounded hairline, a tapering jaw and a chin.
 *   - the face was so wide the hair was a sliver. Ceding two columns let the
 *     hair register and fall past the shoulders.
 *
 * A bust has no arms, so the set is expressions rather than poses. `smiling`
 * is the default and the only one whose expression survives being shrunk to
 * display size; `serene` and `resting` exist for calmer surfaces.
 *
 * Palette keys:
 *   .  transparent   k  ink          g  gold lit    G  gold      o  gold deep
 *   h  hair          H  hair lit     s  skin        S  skin shade
 *   w  cloth         r  sampot
 * ------------------------------------------------------------------------- */

export const PIXEL_PET_SPRITES = {
  smiling: [
    "...............g................",
    "...............g................",
    "...............g................",
    "..............ggg...............",
    "...........g..ggg..g............",
    "...........g..ggg..g............",
    "...........g..ggg..g............",
    ".......g..ggg.ggg.ggg..g........",
    ".......g..ggg.ggg.ggg..g........",
    ".......g..ggg.ggg.ggg..g........",
    "......ggg.ggg.ggg.ggg.ggg.......",
    ".......G...G...G...G...G........",
    ".....GGGGGGGGGGGGGGGGGGGGG......",
    ".......g.o.g.o.g.o.g.o.g........",
    ".....GGGGGGGGGGGGGGGGGGGGG......",
    "......ggggggggggggggggggg.......",
    ".....G.hhhhhhhhhhhhhhhhh.G......",
    ".....GhhhhhssssssssshhhhhG......",
    ".....GHhhhssssssssssshhhHG......",
    ".....GhhhhssssssssssshhhhG......",
    ".....GhhhhssssssssssshhhhG......",
    ".....ohhhhskkssssskkshhhho......",
    "......hhhgsssssssssssghhh.......",
    "......hhhGsssSsssSsssGhhh.......",
    "......hhhhssssSSSsssshhhh.......",
    "......hhhh.sssssssss.hhhh.......",
    "......hhhh..sssssss..hhhh.......",
    "......hhhh..SSSSSSS..hhhh.......",
    ".....hhhGGGGGGGGGGGGGGGhhh......",
    ".....hhggoggoggoggoggogghh......",
    ".....hGGGGGGGGGGGGGGGGGGGh......",
    ".....wwwwwwwwwwwwwwwwwwwww......",
    "....wwwwwwwwwwwwwwwwwwwwwww.....",
    "....rrrrrrrrrrrrrrrrrrrrrrr.....",
  ],
  serene: [
    "...............g................",
    "...............g................",
    "...............g................",
    "..............ggg...............",
    "...........g..ggg..g............",
    "...........g..ggg..g............",
    "...........g..ggg..g............",
    ".......g..ggg.ggg.ggg..g........",
    ".......g..ggg.ggg.ggg..g........",
    ".......g..ggg.ggg.ggg..g........",
    "......ggg.ggg.ggg.ggg.ggg.......",
    ".......G...G...G...G...G........",
    ".....GGGGGGGGGGGGGGGGGGGGG......",
    ".......g.o.g.o.g.o.g.o.g........",
    ".....GGGGGGGGGGGGGGGGGGGGG......",
    "......ggggggggggggggggggg.......",
    ".....G.hhhhhhhhhhhhhhhhh.G......",
    ".....GhhhhhssssssssshhhhhG......",
    ".....GHhhhssssssssssshhhHG......",
    ".....GhhhhssssssssssshhhhG......",
    ".....GhhhhssssssssssshhhhG......",
    ".....ohhhhskkkssskkkshhhho......",
    "......hhhgsssssssssssghhh.......",
    "......hhhGssssSSSssssGhhh.......",
    "......hhhhssssssssssshhhh.......",
    "......hhhh.sssssssss.hhhh.......",
    "......hhhh..sssssss..hhhh.......",
    "......hhhh..SSSSSSS..hhhh.......",
    ".....hhhGGGGGGGGGGGGGGGhhh......",
    ".....hhggoggoggoggoggogghh......",
    ".....hGGGGGGGGGGGGGGGGGGGh......",
    ".....wwwwwwwwwwwwwwwwwwwww......",
    "....wwwwwwwwwwwwwwwwwwwwwww.....",
    "....rrrrrrrrrrrrrrrrrrrrrrr.....",
  ],
  resting: [
    "...............g................",
    "...............g................",
    "...............g................",
    "..............ggg...............",
    "...........g..ggg..g............",
    "...........g..ggg..g............",
    "...........g..ggg..g............",
    ".......g..ggg.ggg.ggg..g........",
    ".......g..ggg.ggg.ggg..g........",
    ".......g..ggg.ggg.ggg..g........",
    "......ggg.ggg.ggg.ggg.ggg.......",
    ".......G...G...G...G...G........",
    ".....GGGGGGGGGGGGGGGGGGGGG......",
    ".......g.o.g.o.g.o.g.o.g........",
    ".....GGGGGGGGGGGGGGGGGGGGG......",
    "......ggggggggggggggggggg.......",
    ".....G.hhhhhhhhhhhhhhhhh.G......",
    ".....GhhhhhssssssssshhhhhG......",
    ".....GHhhhssssssssssshhhHG......",
    ".....GhhhhssssssssssshhhhG......",
    ".....GhhhhssssssssssshhhhG......",
    ".....ohhhhskkkssskkkshhhho......",
    "......hhhgsSSSsssSSSsghhh.......",
    "......hhhGssssSSSssssGhhh.......",
    "......hhhhssssssssssshhhh.......",
    "......hhhh.sssssssss.hhhh.......",
    "......hhhh..sssssss..hhhh.......",
    "......hhhh..SSSSSSS..hhhh.......",
    ".....hhhGGGGGGGGGGGGGGGhhh......",
    ".....hhggoggoggoggoggogghh......",
    ".....hGGGGGGGGGGGGGGGGGGGh......",
    ".....wwwwwwwwwwwwwwwwwwwww......",
    "....wwwwwwwwwwwwwwwwwwwwwww.....",
    "....rrrrrrrrrrrrrrrrrrrrrrr.....",
  ],
} as const;

export type TPixelPetExpression = keyof typeof PIXEL_PET_SPRITES;

export const PET_WIDTH = 32;
export const PET_HEIGHT = 34;
