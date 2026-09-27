/**
 * @mooncellwiki/akds-vue —— AKDS 的 Vue 3 实现（≈ primer/react 之于 primer/css）。
 * 组件只负责输出约定好的 .ak-* 结构 + 状态 / 可访问性；样式全部来自 CSS 实现（packages/css，MW 上由皮肤加载；不发 npm），这里不打包 CSS。
 * 在 prts-widgets 里：页面已有皮肤样式，直接 import 组件即可。
 */
export { icons, type IconName } from "./icons";
export { default as AkIcon } from "./components/Icon/AkIcon.vue";
export { default as AkButton } from "./components/Button/AkButton.vue";
export { default as AkButtonGroup } from "./components/Button/AkButtonGroup.vue";
export type { ButtonSize, ButtonVariant } from "./components/Button/context";
export { default as AkTag } from "./components/Tag/AkTag.vue";
export { default as AkCbox } from "./components/Cbox/AkCbox.vue";
export { default as AkTabs } from "./components/Tabs/AkTabs.vue";
export { default as AkTabPane } from "./components/Tabs/AkTabPane.vue";
export { default as AkTab } from "./components/Tabs/AkTab.vue";
export { default as AkItem } from "./components/Item/AkItem.vue";
export { default as AkItemList } from "./components/Item/AkItemList.vue";
export type { ItemSize } from "./components/Item/context";

// ── 通用 · 展示 ──
export { default as AkChip } from "./components/Chip/AkChip.vue";
export { default as AkBadge } from "./components/Badge/AkBadge.vue";
export { default as AkCard } from "./components/Card/AkCard.vue";
export { default as AkCardGrid } from "./components/Card/AkCardGrid.vue";
export { default as AkPanel } from "./components/Panel/AkPanel.vue";
export { default as AkHeading } from "./components/Heading/AkHeading.vue";
export { default as AkDivider } from "./components/Divider/AkDivider.vue";
export { default as AkAvatar } from "./components/Avatar/AkAvatar.vue";
export { default as AkAvatarGroup } from "./components/Avatar/AkAvatarGroup.vue";
export type { AvatarSize } from "./components/Avatar/context";
export type { AvatarOption } from "./components/Avatar/AkAvatarGroup.vue";
export { default as AkEmpty } from "./components/Empty/AkEmpty.vue";
export { default as AkSkeleton } from "./components/Skeleton/AkSkeleton.vue";
export { default as AkSpinner } from "./components/Spinner/AkSpinner.vue";

// ── 通用 · 反馈与浮层 ──
export { default as AkMessage } from "./components/Message/AkMessage.vue";
export type { MessageVariant } from "./components/Message/AkMessage.vue";
export { default as AkTooltip } from "./components/Tooltip/AkTooltip.vue";
export { default as AkPopover } from "./components/Tooltip/AkPopover.vue";
export type { PopoverPlacement, PopoverTrigger } from "./components/Tooltip/usePopover";
export { default as AkDropdown } from "./components/Dropdown/AkDropdown.vue";
export type { DropdownKey, DropdownOption, DropdownDividerOption, DropdownGroupOption, DropdownMixedOption } from "./components/Dropdown/types";
export { default as AkDialog } from "./components/Dialog/AkDialog.vue";
export { default as AkToastProvider } from "./components/Toast/AkToastProvider.vue";
export { useToast, type ToastApi, type ToastContent, type ToastHandle, type ToastOptions, type ToastVariant } from "./components/Toast/useToast";
export { default as AkProgress } from "./components/Progress/AkProgress.vue";
export { default as AkStat } from "./components/Stat/AkStat.vue";
export { default as AkStatRow } from "./components/Stat/AkStatRow.vue";

// ── 通用 · 导航与数据 ──
export { default as AkBreadcrumb } from "./components/Breadcrumb/AkBreadcrumb.vue";
export { default as AkBreadcrumbItem } from "./components/Breadcrumb/AkBreadcrumbItem.vue";
export { default as AkPagination } from "./components/Pagination/AkPagination.vue";
export { default as AkTimeline } from "./components/Timeline/AkTimeline.vue";
export { default as AkTimelineItem } from "./components/Timeline/AkTimelineItem.vue";
export { default as AkSteps } from "./components/Stepper/AkSteps.vue";
export { default as AkStep } from "./components/Stepper/AkStep.vue";
export { default as AkCollapse } from "./components/Accordion/AkCollapse.vue";
export { default as AkCollapseItem } from "./components/Accordion/AkCollapseItem.vue";
export type { CollapseName } from "./components/Accordion/context";
export { default as AkDataTable } from "./components/Table/AkDataTable.vue";
export type { DataTableColumn, DataTableSort } from "./components/Table/types";
export { default as AkBackTop } from "./components/Fab/AkBackTop.vue";

// ── 通用 · 表单 ──
export { default as AkField } from "./components/Field/AkField.vue";
export type { ValidationStatus } from "./components/Field/context";
export { default as AkInput } from "./components/Input/AkInput.vue";
export { default as AkInputGroup } from "./components/Input/AkInputGroup.vue";
export type { InputSize } from "./components/Input/context";
export { default as AkInputNumber } from "./components/InputNumber/AkInputNumber.vue";
export { default as AkSelect, type SelectOption, type SelectGroupOption, type SelectValue } from "./components/Select/AkSelect.vue";
export { default as AkCheckbox } from "./components/Checkbox/AkCheckbox.vue";
export { default as AkCheckboxGroup } from "./components/Checkbox/AkCheckboxGroup.vue";
export { default as AkRadio } from "./components/Radio/AkRadio.vue";
export { default as AkRadioGroup } from "./components/Radio/AkRadioGroup.vue";
export { default as AkRadioButton } from "./components/Radio/AkRadioButton.vue";
export { default as AkSwitch } from "./components/Switch/AkSwitch.vue";
export { default as AkSlider } from "./components/Slider/AkSlider.vue";
export { default as AkSearch } from "./components/Search/AkSearch.vue";
export { default as AkKbd } from "./components/Kbd/AkKbd.vue";

// ── 方舟 · 干员身份 ──
export { default as AkRarity } from "./components/Rarity/AkRarity.vue";
export type { Rarity } from "./components/Rarity/AkRarity.vue";
export { default as AkProfession } from "./components/Profession/AkProfession.vue";
export { default as AkProfessionLabel } from "./components/Profession/AkProfessionLabel.vue";
export { default as AkElite } from "./components/Elite/AkElite.vue";
export { default as AkPotential } from "./components/Potential/AkPotential.vue";
export { default as AkSpecialization } from "./components/Potential/AkSpecialization.vue";
export { default as AkLevel } from "./components/Level/AkLevel.vue";
export { default as AkPhaseTabs } from "./components/PhaseTabs/AkPhaseTabs.vue";
export { default as AkTrust } from "./components/Trust/AkTrust.vue";
export { default as AkPotList } from "./components/PotList/AkPotList.vue";
export { default as AkPot } from "./components/PotList/AkPot.vue";
export { default as AkOpCard } from "./components/OpCard/AkOpCard.vue";
export { default as AkOpGrid } from "./components/OpCard/AkOpGrid.vue";
export { default as AkOpRow } from "./components/OpRow/AkOpRow.vue";

// ── 方舟 · 养成与技能 ──
export { default as AkRichText, type RichTextVariant } from "./components/RichText/AkRichText.vue";
export { default as AkSp } from "./components/Sp/AkSp.vue";
export { default as AkSpTrigger } from "./components/Sp/AkSpTrigger.vue";
export { default as AkSpValue } from "./components/Sp/AkSpValue.vue";
export type { SpType, SpValueKind } from "./components/Sp/sp";
export { default as AkSkill } from "./components/Skill/AkSkill.vue";
export { default as AkSkillLevels } from "./components/SkillLevels/AkSkillLevels.vue";
export { default as AkSkillSheet, type SkillSheetLevel } from "./components/SkillSheet/AkSkillSheet.vue";
export { default as AkSkillMatrix, type SkillMatrixRow } from "./components/SkillMatrix/AkSkillMatrix.vue";
export { default as AkTalentTable, type TalentRow } from "./components/TalentTable/AkTalentTable.vue";
export { default as AkCalc, type CalcKind } from "./components/TalentTable/AkCalc.vue";
export { default as AkTalent, type TalentRequirement } from "./components/Talent/AkTalent.vue";
export { default as AkMaterials } from "./components/Materials/AkMaterials.vue";
export { default as AkMaterialsRow } from "./components/Materials/AkMaterialsRow.vue";
export { default as AkMaterialsDivider } from "./components/Materials/AkMaterialsDivider.vue";

// ── 方舟 · 属性与档案 ──
export { default as AkAttrs } from "./components/Attrs/AkAttrs.vue";
export { default as AkAttr } from "./components/Attrs/AkAttr.vue";
export { default as AkKv } from "./components/Kv/AkKv.vue";
export { default as AkKvItem } from "./components/Kv/AkKvItem.vue";
export { default as AkRange, type RangeGrid } from "./components/Range/AkRange.vue";
export { default as AkModule, type ModuleColor } from "./components/Module/AkModule.vue";
export { default as AkModuleStage } from "./components/Module/AkModuleStage.vue";
export { default as AkModuleUnlock } from "./components/Module/AkModuleUnlock.vue";
export { default as AkVoiceList } from "./components/Voice/AkVoiceList.vue";
export { default as AkVoice } from "./components/Voice/AkVoice.vue";
export type { VoiceLanguage } from "./components/Voice/context";
export { default as AkDossier } from "./components/Dossier/AkDossier.vue";
export { default as AkRedacted } from "./components/Dossier/AkRedacted.vue";
export { default as AkArchive } from "./components/Archive/AkArchive.vue";
export { default as AkArchivePlay } from "./components/Archive/AkArchivePlay.vue";
export { default as AkDialogue } from "./components/Dialogue/AkDialogue.vue";
export { default as AkDialogueLine } from "./components/Dialogue/AkDialogueLine.vue";

// ── 方舟 · 关卡与世界观 ──
export { default as AkStage } from "./components/Stage/AkStage.vue";
export { default as AkStageCode } from "./components/Stage/AkStageCode.vue";
export { default as AkSanity } from "./components/Stage/AkSanity.vue";
export { default as AkEnemy } from "./components/Enemy/AkEnemy.vue";
export type { EnemyRank } from "./components/Enemy/AkEnemy.vue";
export { default as AkCamp } from "./components/Camp/AkCamp.vue";
export { default as AkEvent } from "./components/Event/AkEvent.vue";
export { default as AkCountdown } from "./components/Event/AkCountdown.vue";
export { default as AkNews } from "./components/News/AkNews.vue";
export { default as AkHero } from "./components/Hero/AkHero.vue";
