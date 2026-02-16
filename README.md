# HASHCS

HASHCS is a modern, high-performance blogging platform focused on **Cybersecurity, Cloud Computing, AI/ML, Networking, Data Science, and Software Engineering**.

It is built using **Next.js (App Router)** and **Hygraph (GraphCMS)** as a headless CMS, following a **clean black-theme UI**, scalable architecture, and production-ready best practices.

---

## 🚀 Features

### Core
- Next.js 16 App Router
- TypeScript
- Tailwind CSS (black theme)
- Hygraph (GraphCMS) with GraphQL
- ISR (Incremental Static Regeneration)
- SEO-friendly dynamic routing

### Blog System
- Featured blog post
- Latest blog posts
- Individual blog pages
- Rich HTML content rendering
- Cover images (Hygraph assets)
- Newest articles sidebar
- Relevant articles by topic

### Topics / Categories
- Topic-based filtering
- Dynamic topic pages  
  `/topics/[slug]`
- Header topic navigation
- Hygraph relational filtering (`categories_some`)

### UI Components
- Reusable Header & Footer
- Search bar (ready for real-time search)
- Subscribe modal (email capture)
- Responsive layout
- Google Poppins font

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-----------|
| Framework | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CMS | Hygraph (GraphCMS) |
| API | GraphQL |
| Images | next/image + GraphAssets CDN |
| Fonts | Poppins |
| Hosting | Vercel (recommended) |

---

## 📁 Project Structure

app/
├── page.tsx # Home page
├── blog/
│ └── [slug]/
│ └── page.tsx # Blog post page
├── topics/
│ └── [slug]/
│ └── page.tsx # Topic-based articles
├── layout.tsx # Global layout
├── globals.css # Global styles
components/
├── Header.tsx # Header with search, topics, subscribe
├── Footer.tsx # Footer with socials
├── SubscribeModal.tsx # Email subscription popup
lib/
├── hygraph.ts # Hygraph GraphQL client
├── queries.ts # GraphQL queries


---

## 🧠 Hygraph Content Models

### Post Model
- `title` (String)
- `slug` (Slug)
- `excerpt` (String)
- `content` (Rich Text)
- `coverImage` (Asset)
- `publishedAt` (DateTime)
- `categories` (Relation → Category, many-to-many)

### Category Model
- `name` (String)
- `slug` (Slug)
- `posts` (Relation → Post)

⚠️ **Important:**  
The relation between **Post ↔ Category** must be **many-to-many** for topic filtering to work.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
HYGRAPH_ENDPOINT=https://ap-south-1.cdn.hygraph.com/content/PROJECT_ID/master
HYGRAPH_TOKEN=YOUR_READ_ONLY_API_TOKEN
▶️ Getting Started
Install dependencies
npm install


or

pnpm install

Run development server
npm run dev


Open:

http://localhost:3000
