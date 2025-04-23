/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMLParser } from 'fast-xml-parser';

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  author?: string;
  categories?: string[];
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}

export class RSSService {
  private async fetchRSS(url: string): Promise<string> {
    try {
      const corsProxyUrl = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(`${corsProxyUrl}${encodeURIComponent(url)}`, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      throw error;
    }
  }

  private parseXML(xml: string): unknown {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      parseAttributeValue: true,
      trimValues: true,
    });
    return parser.parse(xml);
  }

  public async getFeed(url: string): Promise<RSSFeed> {
    try {
      const xml = await this.fetchRSS(url);
      const parsed = this.parseXML(xml) as any;

      // Handle different RSS feed structures
      let channel;
      if (parsed.rss?.channel) {
        channel = parsed.rss.channel;
      } else if (parsed.feed) {
        // Handle Atom feeds
        channel = {
          title: parsed.feed.title,
          description: parsed.feed.subtitle || '',
          link: parsed.feed.link?.href || parsed.feed.link || '',
          item: parsed.feed.entry
        };
      } else if (parsed.channel) {
        channel = parsed.channel;
      } else {
        throw new Error('Unsupported feed format');
      }

      if (!channel) {
        throw new Error('Could not find channel information in feed');
      }

      return {
        title: channel.title || 'Untitled Feed',
        description: channel.description || channel.subtitle || '',
        link: channel.link?.href || channel.link || '',
        items: (Array.isArray(channel.item) ? channel.item : [channel.item]).filter(Boolean).map((item: any) => ({
          title: item.title || '',
          description: item.description || item.summary || item.content || '',
          link: item.link?.href || item.link || '',
          pubDate: item.pubDate || item.published || item.updated || '',
          guid: item.guid || item.id || item.link || '',
          author: item.author?.name || item.author || undefined,
          categories: Array.isArray(item.category) 
            ? item.category 
            : item.category 
              ? [item.category] 
              : [],
        })),
      };
    } catch (error) {
      console.error('Error processing RSS feed:', error);
      throw error;
    }
  }
}


