"use server";

import { StatusEnum, StatusEnumType } from "./statusEnu";

export async function getStatus(): Promise<StatusEnumType> {
	const envUrl = process.env.SITE_URL;
	if (!envUrl) throw new Error("SITE_URL is not set");

	const url = new URL(envUrl);

	try {
		const res = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "text/html",
			},
		});

		if (!res.ok) return StatusEnum.ERROR;

		const htmlContent = await res.text();
		const isOffline = htmlContent.includes("オフライン");

		return isOffline ? StatusEnum.OFFLINE : StatusEnum.ONLINE;
	} catch (error) {
		console.error("Error fetching status:", error);
		return StatusEnum.ERROR;
	}
}
