import type { InjectionKey } from "vue";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

/** AkAvatarGroup 给组内 AkAvatar 的默认尺寸（同 Naive 的 NAvatarGroup size） */
export const avatarGroupKey: InjectionKey<{ size?: AvatarSize }> = Symbol("AkAvatarGroup");
