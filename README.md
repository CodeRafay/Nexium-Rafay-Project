# Recipe Generator

A modern recipe generator app built with Next.js, Tailwind CSS, shadcn/ui, Supabase, and MongoDB.

## Stack
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui (Radix UI, Lucide Icons)
- Supabase (auth)
- MongoDB (recipes)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Configure Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Enable Email Auth in Authentication > Settings
   - Add your site URL to the redirect URLs in Authentication > URL Configuration
   - Copy your project URL and anon key to `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Visit [http://localhost:3000](http://localhost:3000)

## Authentication Flow

The app uses Supabase's email-based magic link authentication:

1. User enters email on `/login`
2. Magic link is sent to their email
3. Clicking the link redirects to `/callback`
4. User is authenticated and redirected to `/recipes/generate`

## Routes

- `/` - Home page
- `/login` - Authentication page
- `/callback` - Magic link callback handler
- `/recipes/generate` - Generate new recipes (protected)
- `/recipes/saved` - View saved recipes (protected)

## Folder Structure

- `app/` - Next.js app directory (routes, pages, API)
- `components/` - UI components
- `lib/` - Utility libraries (Supabase, MongoDB, types, auth context)
- `services/` - Business logic (auth, recipes)
- `styles/` - Global and custom styles

---

Built with ❤️ using Next.js, Tailwind, and shadcn/ui.
