import { getStatus } from "./actions";
import Content from "./content";

export default async function Home() {
	const status = await getStatus();
	console.log(status);
	return <Content status={status} />;
}
