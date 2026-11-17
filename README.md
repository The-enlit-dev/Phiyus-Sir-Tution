# Piyush: Private Tutor website

A fast, responsive, single-page website for Piyush, a private tutor in Thane, Maharashtra. He teaches Mathematics, Science and Computer Science / ICT to students up to Class 10 who follow the IB, IGCSE, Cambridge, CBSE or ICSE curricula, online and in person.

The site is plain HTML, CSS and JavaScript. It has no build step and no dependencies, so it can be hosted anywhere.

```
index.html        Page content and structure
styles.css        Design system and all styling
script.js         Navigation, animations, worksheet preview, FAQ, enquiry form
config.js         ← Contact details & settings (edit this)
404.html          Not-found page
assets/           Favicon and social-sharing image
robots.txt        Search engine rules
sitemap.xml       Sitemap
```

## 1. Add contact details

Open **`config.js`** and fill in what's available:

```js
window.SITE_CONFIG = {
  tutorName: 'Piyush',
  phone: '+91 98765 43210',            // shown on the site, tap-to-call
  whatsapp: '919876543210',            // digits only, with country code
  email: 'hello@yourdomain.com',
  formEndpoint: '',                    // see section 2
  location: 'Thane, Maharashtra',
  photo: 'assets/piyush.jpg',          // see section 3
  hours: 'Mon–Sat, 4 pm – 8 pm',       // optional
  showPlaceholders: false,             // set to false before going live
};
```

- Any value left as `''` appears as a dashed placeholder (for example "Add phone number") while `showPlaceholders` is `true`. That makes it easy to see what still needs filling in.
- Set **`showPlaceholders: false`** before launch. Missing details are then hidden instead of shown as placeholders.
- Every WhatsApp button uses the `whatsapp` number automatically. Until a number is added, those buttons take visitors to the enquiry form.

## 2. Receive enquiries from the form

The form checks every field before it sends anything. It then delivers the enquiry through the first option that's configured:

| Priority | Setting        | What happens                                                                                  |
|---------:|----------------|-----------------------------------------------------------------------------------------------|
| 1        | `formEndpoint` | The enquiry is sent in the background to a form service, which emails it to you.               |
| 2        | `whatsapp`     | WhatsApp opens with the full enquiry already written out. The parent just presses send.       |
| 3        | `email`        | The parent's email app opens with the enquiry already written out.                            |

**Recommended:** set up a free form service so enquiries reach you even when a parent doesn't press send.

1. Create a form at a service such as [Formspree](https://formspree.io), [Getform](https://getform.io) or [Basin](https://usebasin.com).
2. Copy the form's endpoint URL, for example `https://formspree.io/f/abcdwxyz`.
3. Paste it into `formEndpoint` in `config.js`.

Each submission includes the name, contact number, class, board, subjects, preferred mode and message. A hidden spam trap is built in.

## 3. Add a profile photo

1. Save a photo in the `assets/` folder, for example `assets/piyush.jpg`. A portrait-style crop works best (about 4:5, at least 800 px wide).
2. Set `photo: 'assets/piyush.jpg'` in `config.js`.

The photo then replaces the "P" monogram in the hero and in the About section.

## 4. Before going live

- Replace `https://www.example.com` with the real domain in `index.html` (canonical link), `robots.txt` and `sitemap.xml`.
- Set `showPlaceholders: false` in `config.js`.
- Optionally give `og:image` in `index.html` an absolute URL, for example `https://yourdomain.com/assets/og-image.png`. Some social apps need this to show the preview image.

## 5. Hosting

Upload the whole folder to any static host:

- **Netlify** or **Cloudflare Pages:** drag and drop the folder, or connect this repository. No build command is needed, and the publish directory is the root.
- **GitHub Pages:** go to Settings → Pages → Deploy from branch → root.

To preview locally, run this from the project folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Content notes

All copy sticks to the facts that were provided: teaching since 2019, B.E. Computer Science (2023), up to Class 10, five curricula, three subjects, and online and in-person classes in Thane. The site has no testimonials, results, statistics, prices or service areas, because none were provided. Add any of these only once they're real.
