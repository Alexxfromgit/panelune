const image = (id, page = 1) => `./assets/${id}${page === 1 ? '' : `-${page}`}.webp`;
const opening = (id, alt, narration) => ({ image: image(id), alt, kind: 'opening', narration });
const page = (id, number, alt, captions, split = 50) => ({ image: image(id, number), alt, kind: 'comic', captions, split });

export const stories = [
  {
    id: 'midnight-observatory', title: 'The Midnight Observatory', shortTitle: 'The Midnight\nObservatory',
    style: 'Webcomic', genre: 'Mystery · Slow-burn romance', label: 'A midnight mystery', accent: '#98bac3',
    tagline: 'Some stars were never meant to be found.',
    synopsis: 'When an impossible constellation appears above a shuttered observatory, astronomer Mara Vale returns to the mountain she swore to forget. Waiting for her is a map, a stranger, and a message written in her own handwriting—thirty years ago.',
    styleNote: 'Expressive faces, precise linework, and luminous color. A cinematic webcomic style that lets a small glance carry a big secret.',
    chapter: 'A star out of place', notes: 'Atmospheric suspense, themes of loss, and gentle romantic tension. No graphic violence or explicit content.',
    cast: 'Mara Vale, 29, an astronomer; Elias Wren, 32, the observatory keeper.',
    pages: [
      opening('midnight-observatory', 'Mara holds a glowing brass star map on an observatory balcony beneath a huge moon. Elias waits nearby.', 'The observatory had been dark for thirty years. Tonight, someone had left a light on.'),
      page('midnight-observatory', 2, 'Inside the observatory, Mara examines an old star chart with Elias. A constellation glows above the telescope.', [
        { speaker: 'Mara', text: '“That star isn’t on any chart.” Elias turned the brass dial. “It wasn’t there yesterday.”' },
        { speaker: 'Elias', text: '“Your mother said you’d come when it returned.” Mara went still. “My mother never knew this place.”' }
      ]),
      page('midnight-observatory', 3, 'Mara and Elias discover a letter at the telescope. The open dome reveals an impossible constellation.', [
        { speaker: 'Mara', text: 'Inside the telescope case lay a letter dated thirty years earlier. The handwriting was hers.' },
        { speaker: 'The letter', text: '“When he asks you to close the dome, don’t.” Above them, the stars began to fade—except one.' }
      ])
    ]
  },
  {
    id: 'borrowed-sun', title: 'Borrowed Sun', shortTitle: 'Borrowed\nSun', style: 'Cartoon', genre: 'Fantasy · Romantic comedy',
    label: 'A little bottled magic', accent: '#f1ba69', tagline: 'A bad day. A borrowed sun. A very unusual neighbor.',
    synopsis: 'June has a failing rooftop café and exactly one sunny afternoon left in the bank. Then her new neighbor Theo offers her a jar of borrowed sunshine. There is only one rule: return it before the real sun notices.',
    styleNote: 'Bold shapes, warm gouache textures, and delightfully elastic expressions. A playful cartoon direction with room for grown-up feelings.',
    chapter: 'One sunny afternoon', notes: 'Light fantasy peril and gentle romantic humor. No nudity, explicit content, or graphic violence.',
    cast: 'June Park, 27, a café owner; Theo Bell, 28, an amateur collector of impossible things.',
    pages: [
      opening('borrowed-sun', 'June and Theo meet in a rooftop café surrounded by plants and golden jars of sunlight.', 'On the wettest Tuesday in the city’s history, June’s new neighbor brought her a sun.'),
      page('borrowed-sun', 2, 'Theo gives June a glowing jar in her café. Golden light fills the rooftop and revives the plants.', [
        { speaker: 'Theo', text: '“Borrowed, not stolen.” He put the warm jar beside the till. “There’s a difference. Usually.”' },
        { speaker: 'June', text: 'The basil stood up. The clouds parted. For the first time all month, every table was full.' }
      ]),
      page('borrowed-sun', 3, 'June and Theo look at a now empty jar as a tiny golden sun hovers mischievously above the rooftop.', [
        { speaker: 'June', text: 'At sunset, June reached for the jar. It was empty. Above the espresso machine, something sneezed light.' },
        { speaker: 'Theo', text: '“Good news: it likes you.” The little sun settled in her hair. “Bad news: we have to tell its mother.”' }
      ])
    ]
  },
  {
    id: 'last-light', title: 'The Last Light', shortTitle: 'The Last\nLight', style: 'Realistic', genre: 'Drama · Coastal mystery',
    label: 'Secrets beneath the surface', accent: '#9daea0', tagline: 'Every lighthouse has a story it refuses to tell.',
    synopsis: 'Iris comes home to sell her father’s lighthouse. But its lamp begins flashing a signal from a ship that vanished decades ago—and Noah, the quiet harbor mechanic, knows more about the message than he should.',
    styleNote: 'Natural proportions, textured brushwork, and film-like light. Painted realism draws you into a world that feels almost within reach.',
    chapter: 'The signal', notes: 'Storms, grief, and atmospheric suspense. No graphic injuries or explicit content.',
    cast: 'Iris Hale, 34, a restoration architect; Noah Reed, 36, a harbor mechanic.',
    pages: [
      opening('last-light', 'Iris and Noah stand near a weathered lighthouse above a turbulent sea, illuminated by its amber beam.', 'Iris came home with a buyer, a train ticket, and no intention of staying the night.'),
      page('last-light', 2, 'Iris examines the lighthouse mechanism with Noah while its amber lamp signals across the stormy water.', [
        { speaker: 'Iris', text: '“The power’s disconnected.” Yet the lamp swept the water: three short flashes, two long, three short.' },
        { speaker: 'Noah', text: 'Noah set down his tools. “That isn’t a warning. It’s a name.” He would not tell her whose.' }
      ]),
      page('last-light', 3, 'Iris uncovers a weathered photograph. She and Noah watch a distant amber light answer from the horizon.', [
        { speaker: 'Iris', text: 'Behind the switchboard: a photograph of her father beside a boat. On its bow, the same name.' },
        { speaker: 'Noah', text: 'Far beyond the reef, a second light answered. “Your father kept it lit for a reason,” Noah said.' }
      ])
    ]
  },
  {
    id: 'paper-moons', title: 'Paper Moons', shortTitle: 'Paper\nMoons', style: 'Watercolor', genre: 'Romance · Magical realism',
    label: 'A connection worth missing a train for', accent: '#d0abc1', tagline: 'The letters you never sent still find their way.',
    synopsis: 'At the station where all the lost things go, Emi finds an origami crane folded from a love letter she never posted. Following it leads her to Lina, a bookbinder who has been collecting the same impossible birds.',
    styleNote: 'Soft washes, ink that wanders, and the texture of real paper. A quiet watercolor direction for feelings that are difficult to put into words.',
    chapter: 'Platform nine', notes: 'Gentle romance between adult women and themes of missed connections. No explicit content or violence.',
    cast: 'Emi Sato, 30, a translator; Lina Moreau, 31, a bookbinder.',
    pages: [
      opening('paper-moons', 'Emi and Lina meet at a rainy old railway station as a luminous origami crane floats between them.', 'Emi had missed the last train. The paper bird, apparently, had been waiting for her.'),
      page('paper-moons', 2, 'Emi catches a paper crane at the station. Lina opens a case full of folded paper birds.', [
        { speaker: 'Emi', text: 'On the wing she recognized one sentence: “I think I could be brave, if you asked me.” Her sentence.' },
        { speaker: 'Lina', text: '“Yours too?” The woman on the bench opened a suitcase. A hundred paper birds stirred in their sleep.' }
      ], 44.3),
      page('paper-moons', 3, 'Emi and Lina unfold two halves of a letter together while a magical train arrives under the station clock.', [
        { speaker: 'Emi', text: 'They unfolded their cranes. Two halves of one letter. Neither had written the last line.' },
        { speaker: 'The letter', text: '“Meet me where the next story begins.” A train arrived at the abandoned platform. Lina offered her hand.' }
      ])
    ]
  },
  {
    id: 'signal-zero', title: 'Signal / Zero', shortTitle: 'SIGNAL\n/ ZERO', style: 'Neo-noir', genre: 'Sci-fi · Urban thriller',
    label: 'Tune into the impossible', accent: '#81c6bc', tagline: 'Tomorrow is calling. Don’t pick up.',
    synopsis: 'In a city that never goes offline, radio repairer Ada receives a broadcast from eleven minutes in the future. The voice belongs to Ren, a stranger standing at her door—and he has never seen a microphone in his life.',
    styleNote: 'Hard-edged ink, electric color, and deep cinematic shadows. Neo-noir turns every ordinary street corner into a question.',
    chapter: 'Eleven minutes', notes: 'Tension, a city blackout, and mild peril. No weapons, graphic violence, or explicit content.',
    cast: 'Ada Quinn, 33, a radio repairer; Ren Ito, 29, a courier.',
    pages: [
      opening('signal-zero', 'Ada and Ren stand beside a glowing vintage radio in a neon-lit, rain-soaked city alley.', 'At 11:49, Ada’s radio picked up a voice from midnight. At 11:50, that voice knocked on her door.'),
      page('signal-zero', 2, 'Ada tunes a vintage radio while Ren watches. Rain glows turquoise outside the repair shop.', [
        { speaker: 'The broadcast', text: '“Ada, listen carefully. In eleven minutes, every light in the city will go out. Except yours.”' },
        { speaker: 'Ren', text: 'The man at the door stared at the radio. “That’s my voice.” Ada checked the clock. Ten minutes.' }
      ]),
      page('signal-zero', 3, 'The city falls dark except for Ada’s glowing radio. Ada and Ren see a single bright doorway in the alley.', [
        { speaker: 'Ada', text: 'She pulled the plug. The voice kept talking. Outside, one neon sign after another blinked into darkness.' },
        { speaker: 'The broadcast', text: '“Good. Now you can see the door.” In the blank wall across the alley, a line of light appeared.' }
      ], 47.6)
    ]
  },
  {
    id: 'velvet-city', title: 'Velvet City', shortTitle: 'VELVET\nCITY', style: 'Ligne claire', genre: 'Mystery · Period drama',
    label: 'Everyone is playing a part', accent: '#d8a183', tagline: 'An invitation. A disappearance. A perfect performance.',
    synopsis: 'Costume designer Vesper receives an invitation to a play that closed forty years ago. Inside the old theater, every seat is taken—and every guest believes she is someone else. Only the pianist, Felix, seems to know the script.',
    styleNote: 'Crisp outlines, flat jewel colors, and carefully drawn architecture. A European ligne-claire direction with a taste for theatrical secrets.',
    chapter: 'The invitation', notes: 'Deception and atmospheric suspense. No graphic violence or explicit content.',
    cast: 'Vesper Laurent, 35, a costume designer; Felix March, 38, a pianist.',
    pages: [
      opening('velvet-city', 'Vesper holds a sealed invitation beside Felix at the amber-lit entrance to an ornate art-deco theater.', 'The invitation arrived without a stamp. The play on the ticket had closed before Vesper was born.'),
      page('velvet-city', 2, 'Vesper enters a richly decorated theater. Felix plays a grand piano beneath a burgundy curtain.', [
        { speaker: 'The usher', text: '“We’ve saved your usual seat.” Vesper had never been here. Every person in the room turned to smile.' },
        { speaker: 'Felix', text: 'The pianist slipped a note beneath her program: “Whatever happens, do not applaud.”' }
      ], 47.1),
      page('velvet-city', 3, 'Vesper studies a vintage theater poster that resembles her. Felix watches as a curtain rises on an empty stage.', [
        { speaker: 'Vesper', text: 'On the faded poster, the leading actress had her face. Beneath it: the date of tomorrow’s performance.' },
        { speaker: 'Felix', text: 'The curtain rose. The stage was empty. “They’re waiting for you,” Felix whispered. “They always have been.”' }
      ])
    ]
  }
].map((story, index) => ({ ...story, cover: image(story.id), number: String(index + 1).padStart(2, '0') }));

export const styles = ['All stories', ...stories.map(story => story.style)];
