Steps to deploy this backend to Render and connect Vercel frontend

1. Push this repo to GitHub
   - git init
   - git add .
   - git commit -m "Initial backend"
   - Create a new GitHub repo and push: git remote add origin <URL>; git push -u origin main

2. On Render (https://dashboard.render.com):
   - New -> Web Service -> Connect GitHub and select the repo
   - Render will detect Node and use the `render.yaml` manifest. If not, set:
     - Build Command: `npm install`
     - Start Command: `npm start`
   - In Render Dashboard, set the following environment variables (Settings -> Environment):
     - `MONGODB_URI` (your connection string)
     - `JWT_SECRET` (your JWT secret)
     - `FRONTEND_URL` (your Vercel frontend URL, e.g. https://your-site.vercel.app)

3. CORS & Socket.IO
   - `server.js` reads `FRONTEND_URL` to restrict CORS for Express and Socket.IO.
   - Ensure your frontend uses the deployed Render URL for API calls and socket connections.

4. Point Vercel frontend to backend
   - In your Vercel frontend repo, set an environment variable `REACT_APP_API_URL` (or your frontend's expected var) to the Render service URL (exposed on the Render dashboard).
   - Redeploy the frontend.

5. Verify
   - Open the frontend URL and test API actions (signup/login/messages).
   - Check Render service logs for errors.

If you want, I can:
- Create a GitHub repo and push this backend (you'll need to provide a remote URL or grant access), or
- Guide you step-by-step while you connect the repo and set env vars.
