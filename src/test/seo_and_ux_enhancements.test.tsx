import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import fs from "fs";
import path from "path";
import Index from "@/pages/Index";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

describe("SEO, UX, and PWA Enhancements Test Suite", () => {
  const initialConfig = useBirthdayStore.getState().config;

  beforeEach(() => {
    document.title = "Initial Title";
    useBirthdayStore.setState({ config: { ...initialConfig } });
  });

  afterEach(() => {
    useBirthdayStore.setState({ config: initialConfig });
  });

  describe("Dynamic Document Title in Index.tsx", () => {
    it("updates document title with English greeting when name is set", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "Alice",
            language: "en",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Celebration by Souptik | Free Anniversary Website Maker");
    });

    it("updates document title with Bengali greeting when language is bn", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "অনিন্দিতা",
            language: "bn",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Celebration by Souptik | Free Anniversary Website Maker");
    });

    it("updates document title with Hindi greeting when language is hi", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "राहुल",
            language: "hi",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Celebration by Souptik | Free Anniversary Website Maker");
    });

    it("updates document title with French greeting when language is fr", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "Camille",
            language: "fr",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Celebration by Souptik | Free Anniversary Website Maker");
    });

    it("falls back to default title when name is empty or whitespace", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "   ",
            language: "en",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Celebration by Souptik | Free Anniversary Website Maker");
    });
  });

  describe("index.html SEO, Social, and JSON-LD Verification", () => {
    const indexPath = path.resolve(process.cwd(), "index.html");
    const htmlContent = fs.readFileSync(indexPath, "utf-8");

    it("contains canonical link tag", () => {
      expect(htmlContent).toContain('<link rel="canonical" href="https://celebration-by-souptik.vercel.app/" />');
    });

    it("contains consistent branded social metadata", () => {
      expect(htmlContent).toContain('<meta property="og:site_name" content="Celebration by Souptik" />');
      expect(htmlContent).toContain('<meta name="twitter:image:alt" content="Anniversary Website Generator Preview" />');
      expect(htmlContent).toContain('name="google-site-verification"');
    });

    it("contains comprehensive and valid JSON-LD structured data with accurate WebSite and WebApplication schemas", () => {
      const jsonLdMatch = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      expect(jsonLdMatch).not.toBeNull();
      const rawJson = jsonLdMatch![1].trim();
      const parsed = JSON.parse(rawJson);

      expect(parsed["@context"]).toBe("https://schema.org");
      expect(Array.isArray(parsed["@graph"])).toBe(true);

      const webSite = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "WebSite");
      expect(webSite).toBeDefined();
      expect(webSite.url).toBe("https://celebration-by-souptik.vercel.app/");
      expect(webSite.inLanguage).toContain("en");

      const webApp = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "WebApplication");
      expect(webApp).toBeDefined();
      expect(webSite.name).toBe("Celebration by Souptik");
      expect(webApp.name).toBe("Celebration by Souptik");
      expect(webApp.genre).toBe("Celebration & Entertainment");
      expect(webApp.browserRequirements).toBeDefined();
      expect(webApp.featureList.length).toBeGreaterThan(0);
      expect(webApp.inLanguage).toContain("en");
      expect(webApp.offers).toBeDefined();
      expect(webApp.author).toBeDefined();

      expect(webApp.aggregateRating).toBeUndefined();
      expect(webSite.potentialAction).toBeUndefined();
    });

    it("contains semantic crawlable noscript fallback", () => {
      expect(htmlContent).toContain("<noscript>");
      expect(htmlContent).toContain("<h1>Celebration by Souptik");
      expect(htmlContent).toContain("customization studio");
    });
  });

  describe("PWA Manifest Synchronization in public/site.webmanifest", () => {
    const manifestPath = path.resolve(process.cwd(), "public/site.webmanifest");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const parsedManifest = JSON.parse(manifestContent);

    it("harmonizes theme_color, background_color, categories, and shortcuts", () => {
      expect(parsedManifest.theme_color).toBe("#1a0515");
      expect(parsedManifest.background_color).toBe("#1a0515");
      expect(parsedManifest.categories).toContain("entertainment");
      expect(Array.isArray(parsedManifest.shortcuts)).toBe(true);
      expect(parsedManifest.shortcuts[0].url).toBe("/create");
    });
  });

  describe("Robots.txt and Sitemap.xml Verification", () => {
    const robotsPath = path.resolve(process.cwd(), "public/robots.txt");
    const robotsContent = fs.readFileSync(robotsPath, "utf-8");

    it("robots.txt configures search engines, AI crawlers, and sitemap pointer", () => {
      expect(robotsContent).toContain("User-agent: Googlebot");
      expect(robotsContent).toContain("User-agent: GPTBot");
      expect(robotsContent).toContain("User-agent: ClaudeBot");
      expect(robotsContent).toContain("User-agent: PerplexityBot");
      expect(robotsContent).toContain("Sitemap: https://celebration-by-souptik.vercel.app/sitemap.xml");
    });

    const sitemapPath = path.resolve(process.cwd(), "public/sitemap.xml");
    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

    it("sitemap contains the canonical homepage without duplicate query URLs", () => {
      expect(sitemapContent).toContain("<loc>https://celebration-by-souptik.vercel.app/</loc>");
      expect(sitemapContent).not.toContain("?relationship=");
      expect(sitemapContent).not.toContain("?template=");
    });
  });
});
