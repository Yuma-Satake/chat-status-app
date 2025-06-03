import { StatusEnum, StatusEnumType } from "./statusEnu";

type Props = {
	status: StatusEnumType;
	htmlContent: string;
};

export default function Content({ status, htmlContent }: Props) {
	const label =
		status === StatusEnum.ONLINE
			? "お仕事中だよ"
			: status === StatusEnum.OFFLINE
				? "お仕事中じゃないよ"
				: "エラーが発生しました";

	return (
		<div>
			<h1>✨お仕事状況✨</h1>
			<p>{label}</p>
			<p>{htmlContent}</p>
		</div>
	);
}
