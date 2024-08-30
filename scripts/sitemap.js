const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

// Define the URLs for your site
const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  // Add more URLs here
];

// Create a write stream to a file (optional)
const writeStream = fs.createWriteStream("public/sitemap.xml");

// Create a SitemapStream to build the sitemap
const sitemapStream = new SitemapStream({
  hostname: "https://www.telehub.bot",
});

// Pipe the sitemap into the write stream
sitemapStream.pipe(createGzip()).pipe(writeStream);

// Add links to the sitemap
links.forEach((link) => sitemapStream.write(link));

// End the sitemap stream
sitemapStream.end();
