import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobUrl = searchParams.get('url');

  if (!jobUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(jobUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch LinkedIn page' }, { status: 502 });
    }

    const html = await response.text();

    // 1. Try to extract from <title> tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    let titleText = titleMatch ? titleMatch[1].trim() : '';

    let parsedTitle = '';
    let parsedCompany = '';
    let parsedLocation = '';

    if (titleText) {
      // Clean up title text HTML entities
      titleText = titleText
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      // Match format: "[Company Name] hiring [Job Title] in [Location] | LinkedIn"
      const hiringMatch = titleText.match(/^(.+?)\s+hiring\s+(.+?)\s+in\s+(.+?)\s*\|\s*LinkedIn/i);
      if (hiringMatch) {
        parsedCompany = hiringMatch[1].trim();
        parsedTitle = hiringMatch[2].trim();
        parsedLocation = hiringMatch[3].trim();
      }

      // Match format: "[Job Title] at [Company Name] (in [Location])? | LinkedIn"
      if (!parsedTitle) {
        const atMatch = titleText.match(/^(.+?)\s+at\s+(.+?)(?:\s+in\s+(.+?))?\s*\|\s*LinkedIn/i);
        if (atMatch) {
          parsedTitle = atMatch[1].trim();
          parsedCompany = atMatch[2].trim();
          if (atMatch[3]) parsedLocation = atMatch[3].trim();
        }
      }
    }

    // 2. Fallback to <meta> tags if matching failed
    if (!parsedTitle) {
      const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
      if (ogTitleMatch) {
        const ogTitle = ogTitleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'");
        const atMatch = ogTitle.match(/^(.+?)\s+at\s+(.+)$/i);
        if (atMatch) {
          parsedTitle = atMatch[1].trim();
          parsedCompany = atMatch[2].trim();
        } else {
          parsedTitle = ogTitle;
        }
      }
    }

    // 3. Fallback to Meta description for location
    if (!parsedLocation) {
      const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                          html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i);
      if (ogDescMatch) {
        const ogDesc = ogDescMatch[1];
        // Look for location patterns in description, e.g. "in Istanbul" or "Apply today in Dublin"
        const locMatch = ogDesc.match(/in\s+([A-Z][a-zA-Z\s,]+?)\.\s/);
        if (locMatch) {
          parsedLocation = locMatch[1].trim();
        }
      }
    }

    // Clean up title | LinkedIn if it leaked
    if (parsedTitle) {
      parsedTitle = parsedTitle.replace(/\s*\|\s*LinkedIn/gi, '').trim();
    }

    return NextResponse.json({
      title: parsedTitle || null,
      companyName: parsedCompany || null,
      location: parsedLocation || null
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error during scraping' }, { status: 500 });
  }
}
