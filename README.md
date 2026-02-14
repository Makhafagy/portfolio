# Wild Portfolio (Netlify Ready)

This is your standalone static portfolio site.

## Personalized data already wired

- Name, summary, and project copy pulled from your resume.
- GitHub: `https://github.com/Makhafagy`
- LinkedIn: `https://www.linkedin.com/in/mahmoud-khafagy-mo/`
- Resume file included at `assets/Mahmoud_Khafagy_resume.pdf`

## Quick edits (optional)

- Update copy in `index.html`
- Update interactions/content in `script.js`
- Keep styles in `styles.css`

## Run locally

```bash
cd /Users/mahmoud/Desktop/TrueReminder/wild-portfolio
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to Netlify

### Option 1: Drag and drop

1. Go to Netlify dashboard.
2. Open **Sites**.
3. Drag the `wild-portfolio` folder contents into Netlify deploy area.

### Option 2: Connect this repo

1. In Netlify, choose **Add new site** -> **Import an existing project**.
2. Set **Base directory** to `wild-portfolio`.
3. Leave **Build command** empty.
4. Set **Publish directory** to `.`.

Netlify will use `wild-portfolio/netlify.toml`.
