"use server";

import { StatusEnum, StatusEnumType } from "./statusEnu";
import puppeteer, { Browser } from "puppeteer";

export async function getStatus(): Promise<StatusEnumType> {
	const envUrl = process.env.SITE_URL;
	if (!envUrl) throw new Error("SITE_URL is not set");

	let browser: Browser | undefined;
	try {
		// ヘッドレスブラウザを起動
		browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page = await browser.newPage();

		// ページにアクセス
		await page.goto(envUrl, {
			waitUntil: "networkidle2",
			timeout: 30000,
		});

		// 「はい」ボタンを探してクリック
		try {
			// 「はい」ボタンを探してクリック
			const buttonClicked = await page.evaluate(() => {
				const buttons = Array.from(
					document.querySelectorAll(
						'button, input[type="button"], input[type="submit"], a',
					),
				);
				const yesBtn = buttons.find(
					(btn) =>
						btn.textContent?.includes("はい") ||
						btn.getAttribute("value")?.includes("はい") ||
						btn.getAttribute("title")?.includes("はい"),
				);

				if (yesBtn) {
					(yesBtn as HTMLElement).click();
					return true;
				}
				return false;
			});

			if (buttonClicked) {
				// ページの遷移を待機
				await page.waitForNavigation({
					waitUntil: "networkidle2",
					timeout: 15000,
				});
			} else {
				throw new Error("はいボタンが見つかりません");
			}
		} catch (buttonError) {
			console.log("初回のボタンクリック試行が失敗、代替方法を試行中...");

			// より汎用的なセレクターでボタンを探す
			const buttons = await page.$$eval(
				'button, input[type="button"], input[type="submit"], a',
				(elements) =>
					elements.map((el) => ({
						text: el.textContent?.trim() || el.getAttribute("value") || "",
						outerHTML: el.outerHTML,
					})),
			);

			// 「はい」を含むボタンを探す
			const yesButton = buttons.find((btn) => btn.text.includes("はい"));
			if (yesButton) {
				await page.evaluate(() => {
					const buttons = Array.from(
						document.querySelectorAll(
							'button, input[type="button"], input[type="submit"], a',
						),
					);
					const yesBtn = buttons.find(
						(btn) =>
							btn.textContent?.includes("はい") ||
							btn.getAttribute("value")?.includes("はい"),
					);
					if (yesBtn) {
						(yesBtn as HTMLElement).click();
					}
				});

				// ページの遷移を待機
				await new Promise((resolve) => setTimeout(resolve, 3000));
			}
		}

		// 最終的なページ内容を取得
		const htmlContent = await page.content();
		console.log(htmlContent);
		const isOffline = htmlContent.includes("オフライン");

		return isOffline ? StatusEnum.OFFLINE : StatusEnum.ONLINE;
	} catch (error) {
		console.error("Error fetching status with headless browser:", error);
		return StatusEnum.ERROR;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
