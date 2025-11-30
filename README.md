# YouTube Note Maker

A Next.js web application that generates instant summaries and notes from YouTube videos using AI.

## Features

- 📝 Generate AI-powered summaries from YouTube videos
- 🎯 Choose summary length (50, 150, 300, or 500 words)
- 📌 Get key bullet points and takeaways
- ✅ Extract action items and important questions
- 🎨 Beautiful, responsive UI with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How to Use

1. Paste a YouTube video URL into the input field
2. Select your desired summary length
3. Choose whether to include detailed bullet notes
4. Click "Generate Notes"
5. View your AI-generated summary and notes!

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI GPT-3.5-turbo
- **Transcript:** youtube-transcript package

## API Usage

The app uses OpenAI's GPT-3.5-turbo model, which is cost-effective for summarization tasks. Each request typically uses a few hundred tokens depending on the video length.

## Troubleshooting

- **"Could not fetch transcript"**: The video may not have captions/subtitles enabled
- **"OpenAI API key is not configured"**: Make sure you've created `.env.local` with your API key
- **API errors**: Check your OpenAI account has sufficient credits

## License

MIT
# yt-note-taker
