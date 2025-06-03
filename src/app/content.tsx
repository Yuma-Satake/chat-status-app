import { StatusEnum, StatusEnumType } from "./statusEnu";

type Props = {
	status: StatusEnumType;
};

export default function Content({ status }: Props) {
	const label =
		status === StatusEnum.ONLINE
			? "お仕事中だよ"
			: status === StatusEnum.OFFLINE
				? "お仕事中じゃないよ"
				: "エラーが発生しました";

	return (
		<div>
			<p>{label}</p>
		</div>
	);
}
