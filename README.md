# Green Flag — Netlify-ready 💚

The original romantic rating page is retained, with an owner-only review inbox added.

## Deploy on Netlify
1. Extract this ZIP and put the project in a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project** and connect the repository.
3. Netlify reads `netlify.toml`: publish directory `public`, functions directory `netlify/functions`.
4. In your Netlify site dashboard, open **Site configuration → Environment variables** and add:
   - Key: `GREEN_FLAG_ADMIN_KEY`
   - Value: choose a long, private password/key that you do not share with anyone.
5. Trigger a new deploy after adding the environment variable.
6. Test the rating page, then share your public HTTPS site URL with your girlfriend.

## View her rating
Open `https://YOUR-SITE.netlify.app/admin.html` and enter the private `GREEN_FLAG_ADMIN_KEY` you configured. You can see all reviews, scores, selected green-flag traits, written notes, dates, and the average score. The dashboard endpoint rejects requests without the admin key.

Keep the admin key private. Do not put it in the public HTML or share the `/admin.html` page together with the key.

## Local development
Requires Node.js 18 or newer:
```bash
npm install
npm run netlify:dev
```
Open the local URL printed by Netlify CLI. Set `GREEN_FLAG_ADMIN_KEY` in your local environment if you want to test the private inbox.

The original Express server is retained for local frontend/API preview:
```bash
npm start
```

## Storage
Submissions are stored in Netlify Blobs under `green-flag-ratings`. Keep using the same Netlify site to access the same stored submissions. Netlify Blobs is persistent storage, unlike writing to a temporary function filesystem.

## What's included
- Same premium dark-emerald romantic design and mobile layout.
- 1–10 rating, trait checklist, optional name, written review, validation and confirmation.
- Netlify Function for submissions.
- Private owner-only inbox at `/admin.html`.
- Netlify Blobs storage.
