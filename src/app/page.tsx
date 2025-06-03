import { getStatus } from "./actions";
import Content from "./content";

export default async function Home() {
	const { status, htmlContent } = await getStatus();

	return <Content status={status} htmlContent={htmlContent} />;
}
