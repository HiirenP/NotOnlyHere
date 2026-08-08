/**
 * Download curated multicultural Unsplash photos into public/images.
 * Keeps logo.png and ava-mascot.png unchanged.
 */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';

const OUT = path.resolve('public/images');

/** filename -> { id, w, h } using known Unsplash photo IDs showing diverse people */
const PHOTOS = {
  // Heroes / wide community moments
  'mission-hero.jpg': { id: '1529156069898-49953e39b3ac', w: 1600, h: 900 }, // diverse friends laughing
  'stories-hero.jpg': { id: '1511632765486-a01980e01a18', w: 1600, h: 900 }, // multicultural gathering
  'impact-hero.jpg': { id: '1523240795612-9a054b0db644', w: 1400, h: 800 }, // diverse students
  'feature-circles-v2.jpg': { id: '1543269865-cbf427effbad', w: 1600, h: 1000 }, // diverse women talking
  'about-our-story.jpg': { id: '1522202176988-66273c2fd55f', w: 800, h: 1000 }, // diverse team collaborating
  'support-community-1.jpg': { id: '1531482615713-2afd69097998', w: 800, h: 1000 }, // Black friends outdoors
  'deepdive-img.jpg': { id: '1491438590914-bc09fcaaf77a', w: 800, h: 1000 }, // multicultural friends park

  // Mission / approach
  'mission-origin.jpg': { id: '1573497019940-1c28c88b4f3e', w: 900, h: 700 }, // Black woman conversation
  'mission-approach.jpg': { id: '1580489944761-15a19d654956', w: 900, h: 700 }, // East Asian woman reflective

  // Features
  'feature-anon.jpg': { id: '1519085360753-af0119f7cbe7', w: 800, h: 500 }, // East Asian man quiet moment
  'feature-moderated.jpg': { id: '1556761175-5973dc0f32e7', w: 800, h: 500 }, // diverse workplace meeting
  'feature-stories.jpg': { id: '1544005313-94ddf0286df2', w: 800, h: 500 }, // South Asian woman calm
  'feature-solidarity.jpg': { id: '1523580494863-6f3031224c94', w: 600, h: 600 }, // diverse graduates/community

  // Impact highlights
  'impact-h1.jpg': { id: '1600880292203-757bb62b4baf', w: 800, h: 500 }, // diverse office circle
  'impact-h2.jpg': { id: '1573164713714-d95e436ab8d6', w: 800, h: 500 }, // Black woman writing/reflection
  'impact-h3.jpg': { id: '1475724017902-8abac65154ab', w: 800, h: 500 }, // conversation over coffee

  // Testimonials (portraits — diverse)
  'testimonial-carousel-1.jpg': { id: '1531123897727-8f129e1688ce', w: 600, h: 800 }, // Black woman
  'testimonial-carousel-2.jpg': { id: '1560250097-0b93528c311a', w: 600, h: 800 }, // Black man professional
  'testimonial-carousel-3.jpg': { id: '1611432579699-484f7990b127', w: 600, h: 800 }, // Latina woman

  // Polaroids (hero collage)
  'polaroid-01.jpg': { id: '1529156069898-49953e39b3ac', w: 600, h: 800 },
  'polaroid-02.jpg': { id: '1543269865-cbf427effbad', w: 600, h: 800 },
  'polaroid-03.jpg': { id: '1519085360753-af0119f7cbe7', w: 600, h: 800 },
  'polaroid-04.jpg': { id: '1556761175-5973dc0f32e7', w: 600, h: 800 },
  'polaroid-05.jpg': { id: '1531482615713-2afd69097998', w: 600, h: 800 },
  'polaroid-06.jpg': { id: '1522202176988-66273c2fd55f', w: 600, h: 800 },
  'polaroid-07.jpg': { id: '1511632765486-a01980e01a18', w: 600, h: 800 },
  'polaroid-08.jpg': { id: '1475724017902-8abac65154ab', w: 600, h: 800 },

  // Circles / how we work
  'circle-scroll-01.jpg': { id: '1573496359142-b8d87734a5a2', w: 900, h: 1200 }, // South Asian woman professional
  'circle-scroll-02.jpg': { id: '1507003211169-0a1dd7228f2d', w: 900, h: 1200 }, // Middle Eastern man thoughtful
  'circle-scroll-03.jpg': { id: '1551836022-d5d88e9218df', w: 900, h: 1200 }, // Latina/Hispanic woman
  'circle-scroll-04.jpg': { id: '1629425733761-caae3b5f2e50', w: 900, h: 1200 }, // diverse group embrace

  'circle-card-01.jpg': { id: '1523240795612-9a054b0db644', w: 900, h: 1200 },
  'circle-card-02.jpg': { id: '1491438590914-bc09fcaaf77a', w: 900, h: 1200 },
  'circle-card-03.jpg': { id: '1573497019940-1c28c88b4f3e', w: 900, h: 1200 },
  'circle-card-04.jpg': { id: '1580489944761-15a19d654956', w: 900, h: 1200 },

  'rolling-circle-01.jpg': { id: '1517486808906-6ca8b3f04846', w: 960, h: 640 }, // diverse students
  'rolling-circle-02.jpg': { id: '1542744173-8e7e53415bb0', w: 960, h: 640 }, // diverse meeting table
  'rolling-circle-03.jpg': { id: '1521737711867-e3b97375f902', w: 960, h: 640 }, // diverse workplace
  'rolling-circle-04.jpg': { id: '1556157382-97eda2d62296', w: 960, h: 640 }, // East Asian man warm

  // Blog
  'blog-featured-growth.jpg': { id: '1506126613408-eca07ce68773', w: 1200, h: 800 }, // person yoga/morning calm diverse
  'blog-post-hero.jpg': { id: '1506126613408-eca07ce68773', w: 1200, h: 800 },
  'blog-post-01.jpg': { id: '1522202176988-66273c2fd55f', w: 800, h: 600 },
  'blog-post-02.jpg': { id: '1544005313-94ddf0286df2', w: 800, h: 600 },
  'blog-post-03.jpg': { id: '1573164713714-d95e436ab8d6', w: 800, h: 600 },
  'blog-post-04.jpg': { id: '1519085360753-af0119f7cbe7', w: 800, h: 600 },
  'blog-post-05.jpg': { id: '1611432579699-484f7990b127', w: 800, h: 600 },
  'blog-post-06.jpg': { id: '1560250097-0b93528c311a', w: 800, h: 600 },
  'blog-preview-1.jpg': { id: '1544005313-94ddf0286df2', w: 600, h: 600 },
  'blog-preview-2.jpg': { id: '1475724017902-8abac65154ab', w: 600, h: 600 },
  'blog-preview-3.jpg': { id: '1531123897727-8f129e1688ce', w: 600, h: 600 },
  'blog-related-01.jpg': { id: '1506126613408-eca07ce68773', w: 600, h: 400 },
  'blog-related-02.jpg': { id: '1573497019940-1c28c88b4f3e', w: 600, h: 400 },
  'blog-related-03.jpg': { id: '1543269865-cbf427effbad', w: 600, h: 400 },
};

function urlFor({ id, w, h }) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(
      url,
      {
        headers: {
          'User-Agent': 'NotOnlyHereWebsite/1.0 (local content refresh)',
          Accept: 'image/*',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        const tmp = `${dest}.part`;
        const file = fs.createWriteStream(tmp);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            fs.renameSync(tmp, dest);
            resolve();
          });
        });
        file.on('error', reject);
      },
    );
    req.on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const entries = Object.entries(PHOTOS);
  let ok = 0;
  let fail = 0;
  for (const [name, meta] of entries) {
    const dest = path.join(OUT, name);
    const url = urlFor(meta);
    process.stdout.write(`→ ${name} ... `);
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      if (size < 2000) throw new Error(`too small (${size}b)`);
      console.log(`ok (${size} bytes)`);
      ok++;
    } catch (err) {
      console.log(`FAIL ${err.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed, ${entries.length} total`);
  if (fail) process.exitCode = 1;
}

main();
