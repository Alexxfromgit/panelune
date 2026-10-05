// New stories and continuations. Dialogue stays in HTML, outside the artwork.
const panelSplits = {
  'last-light-ep1-2': 47.5,
  'after-the-rain-ep1-1': 45.5,
  'skybound-letters-2': 44
};
const scene = (file, alt, captions, split = panelSplits[file] || 50) => ({
  image: `./assets/${file}.webp`, alt, kind: 'comic', split,
  captions: captions.map(([speaker, text]) => ({ speaker, text }))
});
const episode = (title, pages) => ({ id: 'episode-1', label: 'Episode 1', title, pages });
const opening = (id, alt, narration) => ({ image: `./assets/${id}.webp`, alt, kind: 'opening', narration });

export const continuations = {
  'midnight-observatory': episode('The unwritten sky', [
    scene('midnight-observatory-ep1-1', 'Mara stops Elias from closing the observatory dome. Her brass map casts the outline of a hidden staircase onto the floor.', [
      ['Mara', '“Leave it open.” She caught his wrist. The last star brightened, and the brass map began to hum.'],
      ['Elias', 'A staircase shone through the floor. “I’ve kept this place for twelve years. That was never there.”']
    ]),
    scene('midnight-observatory-ep1-2', 'Mara and Elias descend a spiral stair to a brass console. Her map reveals a luminous chart of the future sky.', [
      ['Mara', 'Below the telescope, the letter fit a slot in a brass console. The room filled with unfamiliar constellations.'],
      ['Mara', '“These aren’t coordinates. They’re dates.” Tomorrow’s sky was changing. Someone was drawing it from the other side.']
    ])
  ]),
  'borrowed-sun': episode('The weather station', [
    scene('borrowed-sun-ep1-1', 'A tiny sun shines in June’s hair as Theo shields the café plants with an umbrella. Their empty jar reveals a magical route.', [
      ['June', 'The basil was getting a tan. “How do we return it?” Theo opened an umbrella. “Before breakfast, ideally.”'],
      ['Theo', 'He tapped the empty jar. A golden route curled toward the old weather station. “Its mother leaves directions.”']
    ]),
    scene('borrowed-sun-ep1-2', 'June and Theo reach an abandoned rooftop weather station. The little sun settles into a brass gauge and reveals stairs into the clouds.', [
      ['June', 'The station had been closed for years. Yet its brass rain gauge was warm, and someone had swept the steps.'],
      ['Theo', 'The little sun clicked into place. A staircase unfurled into the clouds. “You brought the jar, right?”']
    ])
  ]),
  'last-light': episode('Below the tide', [
    scene('last-light-ep1-1', 'Iris and Noah study a harbor map inside the lighthouse, then carry a lantern along a rocky coastal path after the storm.', [
      ['Noah', 'He traced the answering light on her father’s map. “There’s no boat there. But there used to be a path.”'],
      ['Iris', 'At low tide, the sea gave back a strip of stone. Iris took the lantern. “Then we walk it.”']
    ]),
    scene('last-light-ep1-2', 'Iris and Noah find a stone arch and a weathered signal box on the beach. Inside the box lies a brass key tied with faded ribbon.', [
      ['Iris', 'Beneath the arch stood a signal box, its hinges newly oiled. Someone had been keeping more than a lamp alive.'],
      ['Noah', 'Inside lay a key on her father’s blue ribbon. “The lock is below the tide line,” Noah said. “We have twenty minutes.”']
    ])
  ]),
  'paper-moons': episode('A ticket for two', [
    scene('paper-moons-ep1-1', 'Emi and Lina board an empty magical train amid floating letters. Inside, they sit together with a pair of mysterious tickets.', [
      ['Lina', '“We can get off at the next stop.” Emi took her hand. The carriage smelled of paper, rain, and orange peel.'],
      ['Emi', 'Two tickets waited on their seat. No destination. Only the first half of a sentence Emi knew by heart.']
    ]),
    scene('paper-moons-ep1-2', 'The train travels through hills of folded paper. At a carriage table, a crane unfolds between Emi and Lina as they meet each other’s gaze.', [
      ['Emi', 'Outside, paper hills rose beneath a painted moon. On Lina’s ticket: “I think I could be brave…”'],
      ['Lina', 'The crane unfolded between them. Emi looked up. “Then ask me.” Lina smiled. “Stay for one more stop?”']
    ])
  ]),
  'signal-zero': episode('The room before midnight', [
    scene('signal-zero-ep1-1', 'Ada and Ren enter a corridor lined with old radios and clocks. Ada connects a glowing receiver whose cable leads toward a studio.', [
      ['Ada', 'Every clock behind the door read 11:49. Every radio was silent. “This is where the missing minutes go.”'],
      ['Ren', 'Ada connected a receiver. His future voice crackled through it, and a cable lit a path to the studio.']
    ]),
    scene('signal-zero-ep1-2', 'Ada and Ren find an empty broadcast studio. Ren stands at the microphone while Ada prepares a reel-to-reel tape machine.', [
      ['Ren', 'The tape was blank. The microphone was warm. “We haven’t recorded the warning yet.”'],
      ['Ada', 'She threaded a fresh reel. “Then we can change what it says.” Ren leaned in. “Ada, listen carefully…”']
    ])
  ]),
  'velvet-city': episode('A stitch in time', [
    scene('velvet-city-ep1-1', 'Vesper examines the seam of a costume on the theater stage. Felix shows her an old pocket watch as she studies the stitching.', [
      ['Vesper', 'The leading lady’s costume carried her signature stitch. “I made this,” she said. “But I haven’t made it yet.”'],
      ['Felix', 'His watch ticked backward. “The play repeats until someone changes it. Most people try the lines.”']
    ]),
    scene('velvet-city-ep1-2', 'Vesper and Felix enter a mirrored costume hall. She draws a gold thread from a costume, and the city painted on the stage begins to change.', [
      ['Vesper', 'Behind the stage, every mirror showed a different ending. She reached for the costume’s gold thread.'],
      ['Vesper', 'One stitch came free. A new street appeared in the painted city. “I’m a designer,” she said. “I’ll change the scenery.”']
    ])
  ])
};

export const newStories = [
  {
    id: 'after-the-rain', title: 'After the Rain', shortTitle: 'After\nthe Rain', style: 'Manhwa semi-real',
    genre: 'Romance · Urban fantasy', label: 'A city waiting to bloom', accent: '#a9cab7',
    tagline: 'Some places remember the people we meant to become.',
    synopsis: 'Architect Hana returns to restore a glass conservatory marked for demolition. Its quiet caretaker, Joon, has one unusual request: finish the blueprint her grandmother left behind. Every line she draws changes the building—and the paths that brought them together.',
    styleNote: 'Refined adult features, delicate ink lines, and softly modeled light. This semi-realistic manhwa direction pairs polished city scenes with intimate, expressive close-ups.',
    chapter: 'A place the rain forgot',
    notes: 'Gentle romantic tension, family memories, and magical suspense. No explicit content or graphic violence.',
    cast: 'Hana Seo, 29, an architect; Joon Park, 31, an urban botanist and conservatory caretaker.',
    pages: [
      opening('after-the-rain', 'Hana holds an old blueprint outside a luminous, ivy-covered conservatory. Joon waits beside her with a transparent umbrella.', 'Hana had drawn a hundred buildings. This was the first one that seemed to recognize her.'),
      scene('after-the-rain-2', 'The rain stops at the conservatory entrance. Hana unrolls a blueprint, and matching lines begin to glow across the glass door.', [
        ['Joon', 'Rain fell everywhere except the threshold. “It’s been waiting,” he said. “Your grandmother never finished the plans.”'],
        ['Hana', 'She unrolled the blueprint. A door lit up where there had only been glass. “Then let’s see what she left out.”']
      ])
    ],
    continuation: episode('The garden between the lines', [
      scene('after-the-rain-ep1-1', 'Hana draws an arch on the blueprint inside the conservatory. An arch of living vines and glass appears, and Joon reaches toward its leaves.', [
        ['Hana', 'There was a gap in the plan. She drew an arch, lightly, in pencil. The air smelled suddenly of spring.'],
        ['Joon', 'Vines curled into the new doorway. He touched a leaf. “Whatever you draw, it grows. Be sure you want to go there.”']
      ]),
      scene('after-the-rain-ep1-2', 'Hana and Joon follow a luminous garden path to a hidden glass staircase descending toward a glowing underground orangery.', [
        ['Hana', 'The path bent farther than the building should allow. Under the roots, warm light rose from another garden.'],
        ['Joon', 'At the glass stair, he offered his hand. “This part isn’t on any plan.” Hana closed her pencil. “Good.”']
      ])
    ])
  },
  {
    id: 'skybound-letters', title: 'Skybound Letters', shortTitle: 'SKYBOUND\nLETTERS', style: 'Anime cel-shade',
    genre: 'Fantasy · Sky adventure', label: 'No address is too far', accent: '#a8c9ed',
    tagline: 'One undeliverable letter. A whole sky of possibilities.',
    synopsis: 'Airship courier Aria prides herself on never losing a letter. Her latest delivery is addressed to an island erased from every map. With mechanic Leo at the helm and a compass that points down, she sets out to find the city everyone else has forgotten.',
    styleNote: 'Crisp silhouettes, expressive anime faces, and sharp bands of cel-shaded color. Bright skies and clear graphic shadows make this aerial adventure feel light and kinetic.',
    chapter: 'Return to somewhere',
    notes: 'Fantasy flight, heights, and mild adventure peril. Adult characters; no explicit content or graphic violence.',
    cast: 'Aria Vale, 27, an airship courier; Leo Aster, 30, a mechanic and pilot.',
    pages: [
      opening('skybound-letters', 'Aria holds a sealed letter at an airship railing beside Leo, with floating islands and a bright cloud sea beyond.', 'Every letter needed an address. This one needed an island that no longer existed.'),
      scene('skybound-letters-2', 'Aria shows Leo a sealed letter over an airship map. A blank area begins to glow as an island silhouette emerges beneath the clouds.', [
        ['Leo', '“There’s nothing at those coordinates.” Aria put the letter on his map. The empty space began to shine.'],
        ['Aria', 'Far below the clouds, a shape moved against the wind. “Then something’s been waiting a very long time for its mail.”']
      ])
    ],
    continuation: episode('Below the cloud line', [
      scene('skybound-letters-ep1-1', 'Aria ties the letter to a mast compass, revealing a ribbon of light. Leo steers the airship down through a break in the clouds.', [
        ['Aria', 'The compass ignored north. When she tied the letter to it, a ribbon of light pointed straight down.'],
        ['Leo', '“Hold on to something you trust.” Aria caught the rigging. He turned the wheel, and the sky opened beneath them.']
      ]),
      scene('skybound-letters-ep1-2', 'The airship arrives at an abandoned harbor among the clouds. Aria steps onto the quay as an ancient bell begins to glow overhead.', [
        ['Leo', 'A harbor hung in the blue silence, its ropes still tied for ships that had never returned. One berth was empty.'],
        ['Aria', 'As her boots touched the quay, the bell woke. The letter grew warm. At last, someone was coming to collect it.']
      ])
    ])
  },
  {
    id: 'sunset-dispatch', title: 'Sunset Dispatch', shortTitle: 'SUNSET\nDISPATCH', style: 'Retro pulp',
    genre: 'Adventure · Desert mystery', label: 'The scoop beyond the horizon', accent: '#dfa468',
    tagline: 'The camera sees a city. The desert keeps its secret.',
    synopsis: 'Photojournalist Nora develops a picture of a city standing in an empty desert. Pilot Cass calls it a trick of the light—until the coordinates start moving with the sunset. With one roll of film and a borrowed plane, they chase a story that refuses to stand still.',
    styleNote: 'Weathered paper, bold halftone texture, and sun-faded vermilion, ochre, and teal. Vintage pulp adventure art gives impossible discoveries the excitement of a well-thumbed magazine.',
    chapter: 'The impossible negative',
    notes: 'Flying, desert travel, and mild adventure suspense. No weapons, explicit content, or graphic violence.',
    cast: 'Nora Flint, 32, a photojournalist; Cass Reed, 35, a pilot.',
    pages: [
      opening('sunset-dispatch', 'Nora carries a brass camera beside pilot Cass and a vintage propeller plane in a sunset desert, with a distant stone arch.', 'Nora’s editor wanted a photograph of nothing. Unfortunately, nothing had a skyline.'),
      scene('sunset-dispatch-2', 'Nora compares a photograph of a city with an empty desert. Near the plane, her camera casts a glowing route across a map.', [
        ['Cass', '“Double exposure,” Cass said. Beyond the photograph stretched a perfectly empty desert. Then the city’s shadow moved.'],
        ['Nora', 'The camera threw a line across the map, following the sun. “How fast can that plane fly?”']
      ])
    ],
    continuation: episode('Chasing the disappearing city', [
      scene('sunset-dispatch-ep1-1', 'Nora and Cass fly an open-cockpit propeller plane over dunes. Nora sees a ghostly city through her camera while the desert below remains empty.', [
        ['Cass', 'They followed the sunset until the airfield became a speck. “If your city moves any faster, it can buy its own ticket.”'],
        ['Nora', 'Through the viewfinder, towers rose between the dunes. She lowered the camera. Sand. Raised it. A city, closer now.']
      ]),
      scene('sunset-dispatch-ep1-2', 'Their plane lands beside a vast stone arch. Nora raises the camera, revealing city architecture inside the arch while Cass touches its frame.', [
        ['Nora', 'They landed beside the only stone for miles. An arch, with no wall and no road. The final frame waited in her camera.'],
        ['Cass', 'Nora raised the lens. Beyond the arch, a street appeared. Cass touched the stone. “Tell your editor we’ll be late.”']
      ])
    ])
  },
  {
    id: 'blackwater-ledger', title: 'Blackwater Ledger', shortTitle: 'BLACKWATER\nLEDGER', style: 'Noir ink',
    genre: 'Mystery · Detective fiction', label: 'Every absence leaves a trace', accent: '#c9c9c2',
    tagline: 'The city erased a street. Someone kept the receipts.',
    synopsis: 'Detective Ruth Mercer takes a case with no victim and no crime: an entire city block has vanished from the records. Archivist Jonah brings her a ledger that insists it still exists. In a rain-soaked harbor, they follow an address that nobody admits to remembering.',
    styleNote: 'Pure black and white, heavy pools of ink, and patient crosshatching. Hard shadows and rain-slick reflections give this monochrome detective story its quiet, uneasy rhythm.',
    chapter: 'An address without a street',
    notes: 'Detective suspense, rain, shadows, and an eerie setting. No weapons, graphic violence, or explicit content.',
    cast: 'Ruth Mercer, 38, a detective; Jonah Bell, 41, a municipal archivist.',
    pages: [
      opening('blackwater-ledger', 'In stark black and white, Ruth carries a ledger beneath a harbor streetlamp while Jonah waits nearby with an umbrella.', 'The city had misplaced a street. According to the ledger, it was still collecting rent.'),
      scene('blackwater-ledger-2', 'Ruth and Jonah examine a ledger under venetian-blind shadows. A blank space on their map contrasts with a building reflected in the rainy window.', [
        ['Jonah', '“No demolition order. No fire. No sale.” He laid the map beside the ledger. A whole block had become blank paper.'],
        ['Ruth', 'In the window, a building reflected where the map showed nothing. “Paper’s easy to change,” Ruth said. “Let’s ask the street.”']
      ])
    ],
    continuation: episode('The stairs beneath the pier', [
      scene('blackwater-ledger-ep1-1', 'Ruth and Jonah retrieve an address file in a shadowy municipal archive, then follow a folded map along a rain-soaked wooden dock.', [
        ['Jonah', 'One file had escaped the revision. A delivery receipt, addressed beneath the harbor. The ink was still fresh.'],
        ['Ruth', 'They followed the old dock numbers through the rain. At the missing berth, the footsteps on the boards stopped.']
      ]),
      scene('blackwater-ledger-ep1-2', 'Behind hanging ropes under the pier, Ruth finds a stone staircase. She and Jonah descend to an enormous unmarked door.', [
        ['Ruth', 'Behind the ropes, steps led under the pier. Dry steps. Someone had swept them before the rain.'],
        ['Jonah', 'At the bottom stood a door with no number. From the other side came the sound of a stamp hitting paper. Twice.']
      ])
    ])
  }
];
