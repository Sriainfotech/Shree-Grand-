import type { ImageKey } from "./images";

export type GalleryCategory =
  "property" | "rooms" | "pool" | "events" | "outdoor" | "celebrations" | "drone" | "videos";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  type: "image" | "video";
  image: ImageKey;
  /** True for generic placeholder visuals that are not property photography. */
  placeholder: boolean;
};

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "property", label: "Property" },
  { id: "rooms", label: "Rooms" },
  { id: "pool", label: "Pool" },
  { id: "events", label: "Events" },
  { id: "outdoor", label: "Outdoor" },
  { id: "celebrations", label: "Celebrations" },
  { id: "drone", label: "Drone" },
  { id: "videos", label: "Videos" },
];

const item = (
  id: string,
  title: string,
  category: GalleryCategory,
  image: ImageKey,
): GalleryItem => ({ id, title, category, type: "image", image, placeholder: true });

/**
 * Placeholder gallery. Every entry is flagged `placeholder: true` and the UI
 * states clearly that these are representative visuals, not property photos.
 * Drone footage, site videos and 3D renders will replace these once supplied.
 */
export const galleryItems: GalleryItem[] = [
  item("g1", "The property at dusk", "property", "hero"),
  item("g2", "Aerial view of the grounds", "drone", "aerial"),
  item("g3", "Swimming pool", "pool", "pool"),
  item("g4", "Open lawn", "outdoor", "lawn"),
  item("g5", "Party hall", "events", "hall"),
  item("g6", "Bedroom", "rooms", "room"),
  item("g7", "Dining under the pergola", "property", "dining"),
  item("g8", "Campfire evening", "outdoor", "campfire"),
  item("g9", "Garden path", "outdoor", "garden"),
  item("g10", "Wedding setup on the lawn", "celebrations", "wedding"),
  item("g11", "Birthday celebration", "celebrations", "birthday"),
  item("g12", "Corporate offsite", "events", "corporate"),
];

export const videosComingSoon =
  "Drone footage and site videos will be added once the property shoot is complete.";

/**
 * Richer, multi-photo browsing set used by the /gallery page. Every path
 * points at a curated stock / reference photograph in `public/images/` —
 * NOT confirmed photography of the actual property (see
 * `PLACEHOLDER_IMAGE_NOTE` in `./images`, shown alongside this data).
 */
export type PhotoCategoryId =
  | "pool"
  | "bedroom"
  | "dining"
  | "garden"
  | "campfire"
  | "kidsPlay"
  | "livingRoom"
  | "partyHall"
  | "parking"
  | "bbq"
  | "wedding";

export type Photo = { src: string; caption: string };

export type PhotoCategory = {
  id: PhotoCategoryId;
  label: string;
  photos: Photo[];
};

const photo = (file: string, caption: string): Photo => ({
  src: `/images/${file}`,
  caption,
});

export const photoCategories: PhotoCategory[] = [
  {
    id: "pool",
    label: "Pool",
    photos: [
      photo(
        "graded/pool-01.jpg",
        "Close-up of a stainless-steel pool ladder curving into a kidney-shaped pool with dark blue tile edging and a thatched-roof cabana in the background.",
      ),
      photo(
        "graded/pool-02.jpg",
        "A stainless-steel entry ladder at the rounded corner of an oval pool, with wooden loungers and a stone barbecue on the paved patio behind it.",
      ),
      photo(
        "graded/pool-03.jpg",
        "A toddler splashes water with both hands raised while standing in a shallow infinity-edge pool, backlit by low sun through palm trees.",
      ),
      photo(
        "graded/pool-04.jpg",
        "Aerial view of a squared infinity pool with turquoise tiled steps and a wooden deck, overlooking dense jungle palms and banana leaves.",
      ),
      photo(
        "graded/pool-05.jpg",
        "A row of wooden sun loungers with cream umbrellas lines a dark rectangular pool beside a thatched-roof bamboo cabana with sheer curtains.",
      ),
      photo(
        "graded/pool-06.jpg",
        "A rendered courtyard pool with stone steps and a handrail, floor-to-ceiling glass walls, and white cushioned loungers on a grassy lawn.",
      ),
      photo(
        "graded/pool-07.jpg",
        "A stainless-steel handrail ladder enters a rectangular pool with pale green-tinted water, a paver deck, and a sunlit pine forest behind.",
      ),
      photo(
        "graded/pool-08.jpg",
        "A low-angle view of the same green-tinted rectangular pool with brighter turquoise tree reflections and a second steel ladder visible across the water.",
      ),
      photo(
        "graded/pool-09.jpg",
        "Twilight-blue rectangular pool reflecting two open-sided cabana structures with white drapes and taupe lounge chairs, framed by tall palm trees.",
      ),
      photo(
        "graded/pool-10.jpg",
        "Low-angle close-up at water level of a pool corner with a curved metal handrail against an orange brick wall decorated with hanging flower baskets.",
      ),
      photo(
        "graded/pool-11.jpg",
        "Wide shot of a kidney-shaped, blue-tiled pool fronting red-tile-roofed brick bungalows, with a white pergola and turquoise poolside lounge chairs.",
      ),
      photo(
        "graded/pool-12.jpg",
        "Sunset panorama of a curvy kidney-shaped pool beside a white villa, with a pergola dining area, sun loungers and an inflatable float near the edge.",
      ),
      photo(
        "graded/pool-13.jpg",
        "Sunset shot looking through two chrome pool-ladder handrails silhouetted against tall coconut palms, with a lake visible beyond the infinity edge.",
      ),
      photo(
        "graded/pool-14.jpg",
        "A thatched tiki-style umbrella and two red folding chairs beside a pale blue pool on a hilltop terrace, overlooking a hazy mountain valley.",
      ),
      photo(
        "graded/pool-15.jpg",
        "A rendered covered poolside lounge with a wood-beam ceiling, wrought-iron lanterns and a beige sofa, beside a rectangular pool with two entry ladders.",
      ),
      photo(
        "graded/pool-16.jpg",
        "Golden-hour close-up of a pool's stepped spillover ledge with water rippling over the edge, framed by dark wooden pergola beams.",
      ),
      photo(
        "graded/pool-17.jpg",
        "A long lap-style pool bordered by large bird-of-paradise plants, running alongside a multi-story building toward a wooden footbridge in the distance.",
      ),
      photo(
        "graded/pool-18.jpg",
        "A rustic lounge deck with white sling chairs and thatched umbrellas beside a dark green mosaic-tiled pool, set against dense bamboo greenery.",
      ),
      photo(
        "graded/pool-19.jpg",
        "Ground-level shot of water cascading over a dark stone infinity edge with blue mosaic coping, a thatched-roof bar counter blurred in the background.",
      ),
      photo(
        "graded/pool-20-poolside-loungers.jpg",
        "Backlit sunrise scene of two empty wooden reclining loungers beneath a large thatched umbrella on a frosty lawn, with no pool visible in frame.",
      ),
      photo(
        "graded/pool-21-poolside-seating.jpg",
        "Two wooden-framed loungers with white cushions and a side table sit under a cream market umbrella beside a curved pool near a mustard stucco wall.",
      ),
      photo(
        "graded/pool-22-poolside-furniture.jpg",
        "A cluster of gray upholstered sofas and armchairs sit beneath joined patio umbrellas beside a bright turquoise pool, with the ocean visible behind.",
      ),
    ],
  },
  {
    id: "bedroom",
    label: "Rooms",
    photos: [
      photo(
        "bedroom-01.jpg",
        "A loft-style bedroom with a dark wood dresser, a triangular mirror, a guitar mounted on the wall, and a bed with a dark photo-print duvet under mustard curtains.",
      ),
      photo(
        "bedroom-02.jpg",
        "Viewed through a partly open door, a corner bedroom with a bright yellow accent wall, a vase of orange bird-of-paradise flowers, and a pink-and-orange floral duvet.",
      ),
      photo(
        "bedroom-03.jpg",
        "A simply furnished room with a full wall of louvered pine wardrobe doors, navy curtains, an articulating desk lamp, and a low platform bed with plain white bedding.",
      ),
      photo(
        "bedroom-04.jpg",
        "A bed with a black leather-look headboard sits below a floating shelf of small decor pieces, flanked by wall-mounted reading lamps and a striped rug.",
      ),
      photo(
        "bedroom-05.jpg",
        "A vaulted-ceiling bedroom with a cream four-poster bed frame, a chunky grey knit throw, geometric pendant lights hung from the posts, and a woven storage basket.",
      ),
      photo(
        "bedroom-06.jpg",
        "A black metal-frame bed with white bedding and a fuchsia throw sits against a wood chevron headboard panel strung with warm string lights.",
      ),
      photo(
        "bedroom-07.jpg",
        "A close-up of an unmade bed with a padded cream tufted headboard and a rumpled white duvet, beside a two-tone nightstand with a mug and reading lamp.",
      ),
      photo(
        "bedroom-08.jpg",
        "A dark, moodily lit bedroom with a wood-slat accent wall covered in trailing vine plants and a vintage wooden radio-record console in the corner.",
      ),
      photo(
        "bedroom-09.jpeg",
        "A modern room with a wood-plank ceiling fan, a stone-textured accent wall, a glass balcony door with sheer curtains, and neatly rolled white towels on the bed.",
      ),
      photo(
        "bedroom-10.jpg",
        "A compact wood-paneled sleeping nook, likely in an RV or cabin, with a diamond-quilted taupe bedspread and a rust-orange throw pillow.",
      ),
      photo(
        "bedroom-11.jpg",
        "A warmly lit bedroom with mustard-orange walls, a brass wall sconce above the headboard, and glass French doors opening onto a garden view.",
      ),
      photo(
        "bedroom-12.jpg",
        "A bedroom with a charcoal upholstered headboard wall, black wire-frame side tables, a fringed grey throw on the bed, and felt slippers on the rug.",
      ),
      photo(
        "bedroom-13.jpg",
        "A hotel-style room with two twin beds topped with red-and-gold striped table runners, matching bedside lamps, and a deep red carpet.",
      ),
      photo(
        "bedroom-14.jpg",
        "A close-up of a bed with a navy textured coverlet folded over white sheets, with two cream hard-shell suitcases standing beside it near a window.",
      ),
    ],
  },
  {
    id: "dining",
    label: "Dining",
    photos: [
      photo(
        "dining-01.jpg",
        "An indoor table set with wine glasses and dark green plates on a beige cloth, surrounded by brown upholstered chairs and black metal shelving.",
      ),
      photo(
        "dining-02.jpg",
        "A low Japanese-style private dining room with a long wooden table set with chopsticks, floor cushions, and a hanging white floral-shaped pendant light.",
      ),
      photo(
        "dining-03.jpg",
        "An outdoor poolside restaurant terrace with round tables in white linens, director's-style chairs, string lights and a pool visible along the deck.",
      ),
      photo(
        "dining-04.jpg",
        "A rustic wood-paneled dining area with a long table set with black plates, a burlap runner and tall taper candles, a lit wood-burning stove behind.",
      ),
      photo(
        "dining-05.jpg",
        "A banquet-style room with a long table of white plates loaded with salads, spring rolls and shot-glass appetizers, surrounded by dark upholstered chairs.",
      ),
      photo(
        "dining-06.jpg",
        "A sunny garden courtyard viewed through tree branches, with a scatter of small mismatched bistro tables and chairs on a lawn beside a tiled-roof building.",
      ),
      photo(
        "dining-07.jpg",
        "A dimly lit modern restaurant interior with bentwood-style chairs at small tables set with turquoise placemats, under a honeycomb-panel ceiling light.",
      ),
      photo(
        "dining-08.jpg",
        "A long banquet table set for a formal event with white tablecloths, floral centerpieces and numbered place cards, lit by ornate candelabra chandeliers.",
      ),
      photo(
        "dining-09.jpg",
        "A close-up of a small outdoor cafe table holding a glass vase of pink carnations, with wicker chairs and another matching table blurred behind.",
      ),
      photo(
        "dining-10.jpg",
        "An outdoor lawn dining area with wooden tables and armchairs under large cream patio umbrellas, overlooking a lavender hedge and countryside at dusk.",
      ),
      photo(
        "dining-11-birthday.jpg",
        "A dining table set for a children's birthday with plates and snack bowls beneath a colorful hanging Happy Birthday letter banner and balloons.",
      ),
      photo(
        "dining-12-festive.jpg",
        "A holiday-themed table set with a teal and red cloth, red charger plates and blue taper candles, in front of a fireplace and a decorated Christmas tree.",
      ),
      photo(
        "dining-13-tea.jpg",
        "A close-up of an ornate gold tiered stand holding small white gold-trimmed cups on a jeweled gold tray in a softly lit dining room.",
      ),
      photo(
        "dining-14-kitchen.jpg",
        "A rustic wooden kitchen with open shelving of stacked plates and hanging mugs, a brass basin sink, and a round table with wooden stools by a large window.",
      ),
    ],
  },
  {
    id: "garden",
    label: "Garden & Outdoor",
    photos: [
      photo(
        "garden-01.jpg",
        "Pink and mint-green Adirondack chairs cluster around a small table on a lawn, framed through an arched trellis beneath a blooming frangipani tree.",
      ),
      photo(
        "garden-02.jpg",
        "A wood-slatted pergola shelters an outdoor sofa and dining table beside a stone-and-plaster fireplace, with a dome trellis visible in the sunset-lit lawn.",
      ),
      photo(
        "garden-03.jpg",
        "A wheelbarrow loaded with young tomato and pepper seedlings sits on a path beside a raised flowerbed of purple and yellow blooms and wooden vegetable beds.",
      ),
      photo(
        "garden-04.jpg",
        "A two-story log building rises behind a linen-draped outdoor dining table set with wine glasses, flanked by wicker chairs on a lawn among pine trees.",
      ),
      photo(
        "garden-05.jpg",
        "A polytunnel greenhouse interior shows dense rows of staked tomato plants with small yellow flowers lining a narrow dirt path.",
      ),
      photo(
        "garden-06-greenhouse.jpg",
        "Inside a whitewashed-frame greenhouse, hanging baskets of trailing ivy flank the doorway while potted geraniums spill over benches on either side.",
      ),
      photo(
        "garden-07-greenhouse.jpg",
        "A small aluminum-framed greenhouse with a shade-clothed roof sits at the end of a gravel path bordered by shrubs and yellow coneflowers.",
      ),
      photo(
        "garden-08-greenhouse.jpg",
        "A wood-framed greenhouse decorated for autumn overflows with baskets of orange and magenta chrysanthemums, strung with warm string lights.",
      ),
      photo(
        "garden-09-greenhouse.jpg",
        "A Victorian-style glass-and-brick greenhouse with a peaked glazed entrance and hanging flower baskets stands amid netting-covered beds.",
      ),
      photo(
        "garden-10-conservatory.jpg",
        "A mint-green-framed glasshouse interior with wooden crates of potted herbs on a brick-tiled floor leading to a potted citrus tree.",
      ),
      photo(
        "garden-11-patio.jpg",
        "A stone cottage with a glazed hexagonal conservatory extension opens onto a paved patio with a wood table, chairs and a closed lavender parasol.",
      ),
      photo(
        "garden-12-countryside.jpg",
        "A hanging rattan egg chair beside a swimming pool, with banana palms in the foreground and terraced green rice paddies stretching into the distance.",
      ),
    ],
  },
  {
    id: "campfire",
    label: "Campfire",
    photos: [
      photo(
        "campfire-01.jpg",
        "A group in sweaters and beanies sits around a stone fire pit at dusk roasting marshmallows, one strumming a guitar, with a string-lit cabin behind.",
      ),
      photo(
        "campfire-02.jpg",
        "Friends in coats and plaid blankets gather at night under a string-lit pergola, one playing guitar while another pets a dog on a leash.",
      ),
      photo(
        "campfire-03.jpg",
        "A close-up at night of several hands holding hot dogs on skewers over an open flame in a round rusted metal fire pit.",
      ),
      photo(
        "campfire-04.jpg",
        "A group in folding chairs sits around a diamond-mesh fire pit at dusk, roasting marshmallows on long wooden sticks in a backyard.",
      ),
      photo(
        "campfire-05.jpeg",
        "Two children sit reading and writing in notebooks on cushioned outdoor chairs beside a large blazing fire pit, with white pumpkins on the ground behind them.",
      ),
      photo(
        "campfire-06-lanterns.jpg",
        "Viewed from above, a family swings glowing red paper lanterns around a round stone table in a dusk courtyard strung with lanterns overhead.",
      ),
    ],
  },
  {
    id: "kidsPlay",
    label: "Children's Play Area",
    photos: [
      photo(
        "kids-play-01.jpg",
        "A boy smiles from the window of a brightly painted train-shaped play structure, with two other children visible in adjacent carriage windows.",
      ),
      photo(
        "kids-play-02.jpg",
        "A girl kneels in a sandbox digging with her hands, surrounded by toy buckets and molds inside a red-and-yellow wooden play structure.",
      ),
      photo(
        "kids-play-03.jpg",
        "Three children run and dive into an indoor pastel-colored ball pit set within a netted soft-play structure with wooden arches.",
      ),
      photo(
        "kids-play-04.jpg",
        "Two young children and two adults sit on the floor of a wood-paneled playroom with a toy train track and a small playhouse in the background.",
      ),
      photo(
        "kids-play-05.jpg",
        "A woman crouches to talk with a young girl through the rungs of an outdoor wooden climbing frame at a playground with a sand play surface.",
      ),
      photo(
        "kids-play-06.jpg",
        "Two young boys climb through a red rope-and-metal geometric climbing dome at an outdoor playground, with a shade sail and green lawn behind.",
      ),
      photo(
        "kids-play-07.jpg",
        "Two girls crouch in a sandy dig pit, using small brushes to uncover fossil-like bone shapes embedded in the sand near red rock formations.",
      ),
      photo(
        "kids-play-08.jpg",
        "Three children sit in a row on an orange padded surface inside an indoor play center with green mesh climbing structures behind them.",
      ),
      photo(
        "kids-play-09-park.jpg",
        "A toddler stands between two small plastic playhouses on a sandy area, with toy trucks and buckets scattered at her feet.",
      ),
    ],
  },
  {
    id: "livingRoom",
    label: "Living Spaces",
    photos: [
      photo(
        "living-room-01.jpg",
        "A living room with a teal sofa and armchair with mustard throw pillows, a large flat-screen TV, and a wood-and-glass nesting coffee table on a grey rug.",
      ),
      photo(
        "living-room-02.jpg",
        "An open-plan living room with a stone-clad fireplace, a black grand piano, a cream sectional sofa and a rattan sofa, opening into a kitchen.",
      ),
      photo(
        "living-room-03.jpg",
        "A styled living room with a rust-orange leather sofa and navy pillows, a dark wood console with abstract artwork, and a black wingback chair.",
      ),
      photo(
        "living-room-04.jpg",
        "An overhead view of a rustic living room with two mauve sofas, a low wooden coffee table with a metal tray, and a wood-burning stove by tall windows.",
      ),
      photo(
        "living-room-05.jpg",
        "A close-up of a grey sofa piled with blue and cream throw pillows, facing a light wood coffee table with a bowl of lemons.",
      ),
      photo(
        "living-room-06.jpg",
        "A tiled living-dining room with taupe reclining sofas, a rustic wood coffee table on a patchwork rug, and sliding doors opening to a patio.",
      ),
      photo(
        "living-room-07.jpg",
        "A wide shot of a beige slipcovered sofa in the corner of a room with wood flooring and a dark wood console table topped with a small bonsai.",
      ),
      photo(
        "living-room-08.jpg",
        "A modern living room corner with a wall-mounted TV in a wood-slat niche, a leather armchair, and a round white marble coffee table.",
      ),
      photo(
        "living-room-09.jpg",
        "An overhead-angle view of a room with stone-textured accent walls, a beige sofa with a striped throw, an upright piano, and a staircase visible through a doorway.",
      ),
      photo(
        "living-room-10-lifestyle.jpg",
        "A grey cat lounges on a teal ottoman in the foreground while a woman checks her phone at a dining table in an adjoining room.",
      ),
      photo(
        "living-room-11-family.jpg",
        "A woman and a young girl sit together on a sage-green sofa reading a book, under a large abstract artwork, viewed through an open doorway.",
      ),
      photo(
        "living-room-12-family.jpg",
        "An overhead view of a toddler kneeling beside a beige sofa, playing with toy castles, dinosaurs and a wooden train track on a green rug.",
      ),
      photo(
        "living-room-13-decor.jpg",
        "A close-up of a wooden tray with lit white pillar candles and a vase of white blossom branches on an ottoman, beside an olive-green velvet sofa.",
      ),
    ],
  },
  {
    id: "partyHall",
    label: "Party Hall",
    photos: [
      photo(
        "party-hall-01.jpg",
        "A long banquet table set with white china, lit taper candles in silver candelabras and small wrapped gifts, framed by gold curtains against exposed brick.",
      ),
      photo(
        "party-hall-02-festive.JPG",
        "An industrial-style room with a black spiral staircase, exposed brick walls, a lit wood-burning stove, and a small dining table set near a window.",
      ),
    ],
  },
  {
    id: "parking",
    label: "Parking",
    photos: [
      photo(
        "parking-01.jpg",
        "An aerial drone view of a large gravel and paved parking lot with several irregular rows of parked cars beside a corrugated-metal warehouse building.",
      ),
    ],
  },
  {
    id: "bbq",
    label: "Barbecue",
    photos: [
      photo(
        "bbq-01.jpg",
        "An open-lid barrel-style charcoal grill smoking with ribs and sausages cooking, raw meat resting on a wooden board on a stone-walled patio.",
      ),
      photo(
        "bbq-02.jpg",
        "Tongs lift a large smoking cut of meat off a tabletop charcoal brazier, with place settings visible on a linen-covered table behind.",
      ),
      photo(
        "bbq-03.jpg",
        "A small folding charcoal grill with a mesh top sits on a wooden table next to trays of raw marbled beef slices and a board with tongs and herbs.",
      ),
      photo(
        "bbq-04.jpg",
        "A gas grill loaded with bratwurst and hot dogs is tended with tongs while a lakeside patio dining table with colorful plates sits behind.",
      ),
      photo(
        "bbq-05.jpg",
        "Meat and vegetable skewers grill on a rectangular metal fire-pit brazier, with a glass patio table and log cabin siding in the background.",
      ),
      photo(
        "bbq-06.jpg",
        "A built-in outdoor kitchen island with a black gas grill stands against a tiled wall, near a spiral staircase and a wood dining table with wire-frame chairs.",
      ),
    ],
  },
  {
    id: "wedding",
    label: "Weddings",
    photos: [
      photo(
        "wedding-01.jpg",
        "A dimly lit reception deck with a draped ivory-and-burgundy fabric ceiling, a wrought-iron candle chandelier, and purple and white balloons.",
      ),
      photo(
        "wedding-02.jpg",
        "A dark wood oval table set for an intimate dinner, lined with taper candles in brass holders and cascading eucalyptus-and-rose garlands.",
      ),
      photo(
        "wedding-03.jpg",
        "Several long wooden tables in a rustic stone-walled hall, each set with rattan placemats, wine glasses and small white gerbera-daisy centerpieces.",
      ),
    ],
  },
];
