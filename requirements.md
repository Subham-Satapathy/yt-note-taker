You are GitHub Copilot helping me build a full-stack **YouTube Note Maker** web app in **Next.js 14 (App Router) with TypeScript and Tailwind CSS**.

I already have a Next.js project set up. Implement the following:

## High-level goal

Build a simple web app where a user can:
- Paste a YouTube video URL
- Choose a target summary length (e.g. 50, 150, 300, 500 words)
- Click a button to generate:
  - A concise summary of the video
  - Bullet-point notes / key takeaways
  - Optional extra sections like "Action items" or "Important concepts"

The app should call a backend API route that:
- Fetches (or assumes) the video transcript
- Sends the transcript + user options to a cheap LLM (e.g. OpenAI gpt-3.5-turbo or similar)
- Returns structured JSON with the summary and notes

## Tech stack and structure

- Use **Next.js App Router** (`app/` directory)
- Use **TypeScript**
- Use **Tailwind CSS** for styling
- Use **server actions or route handlers** for the summarization API

### Frontend requirements (app/page.tsx)

Create a responsive page with:

1. **Main layout**
   - Centered content, max-width ~800px, nice padding and spacing
   - A simple header: title "YouTube Note Maker" + a short subtitle like “Paste a YouTube link and get instant notes”

2. **Input form**
   - Text input for `YouTube URL`
   - A dropdown or radio buttons for **summary length**, with options:
     - 50 words (very short)
     - 150 words (short)
     - 300 words (medium)
     - 500 words (detailed)
   - A toggle or checkbox for “Include detailed bullet notes”
   - A `Generate Notes` button

3. **State handling**
   - Use React state (or a simple client component) to track:
     - `youtubeUrl` (string)
     - `wordCount` (number)
     - `includeNotes` (boolean)
     - `isLoading` (boolean)
     - `error` (string | null)
     - `result` (object | null) with fields:
       - `title` (string | null)
       - `summary` (string)
       - `bulletPoints` (string[])
       - `actionItems` (string[] | optional)
   - When the button is clicked:
     - Validate the URL is non-empty and looks like a YouTube URL
     - Call `/api/summarize` via `fetch` with a POST request
     - Show a loading state (button disabled + “Generating…” text or spinner)
     - On success, display the result sections
     - On error, show a simple error message

4. **Result display**
   When a result is available, render:

   - Video title (if provided by backend)
   - Section: **Summary** (normal paragraphs)
   - Section: **Key Notes** (unordered list of bullet points)
   - Section: **Action Items / Important Questions** (if provided)
   - A small label indicating what target word count was requested

   Use Tailwind classes for:
   - Clean cards with rounded corners and shadows
   - Good typography (`text-lg` for summary, `text-sm` for labels, etc.)
   - `bg-gray-100` / `bg-slate-900` style neutral colors

5. **UX polish**
   - Show placeholder text in the URL input: “Paste a YouTube URL, e.g. https://www.youtube.com/watch?v=...”
   - Show basic validation error (e.g. “Please enter a valid YouTube URL”) if the input is empty or invalid
   - Make everything mobile-friendly