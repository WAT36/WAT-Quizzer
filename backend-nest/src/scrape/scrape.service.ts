import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ScrapeService {
  async getBestEvent() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(process.env.SCRAPE_TO_URL);

      const titles = await page.$$eval('p.event_title', (list) =>
        list.map((e) => ({
          name: e.textContent.replace(/\n/g, '').trim(),
          link:
            e.getElementsByTagName('a').length > 0
              ? e.getElementsByTagName('a')[0].href
              : '',
        })),
      );
      return titles;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
