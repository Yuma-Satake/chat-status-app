export const StatusEnum = {
	ONLINE: "online",
	OFFLINE: "offline",
	ERROR: "error",
} as const;

export type StatusEnumType = (typeof StatusEnum)[keyof typeof StatusEnum];
