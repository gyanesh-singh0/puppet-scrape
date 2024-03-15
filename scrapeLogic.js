const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (req, res) => {
  const url = req.body.link;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  let mediaRequestUrl = null;
  try {
    page.on('request', request => {
      if (request.resourceType() === 'media' && !mediaRequestUrl) {
        mediaRequestUrl = request.url();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle0' });
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
  return res.status(200).json({ "link": mediaRequestUrl });
};

module.exports = { scrapeLogic };
