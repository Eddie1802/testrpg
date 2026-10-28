export type StatName = "Strength" | "Agility" | "Wisdom" | "Magic";

export type ItemType = "weapon" | "armor";

export type InventoryItem = {
  name: string;
  label: string;
  type: ItemType;
};

export type Build = {
  label: string;
  level: number;
  stats: Record<StatName, number>;
  // Mirrors src/data/character-builds.ts. The bag order is weapon, upgraded weapon, armor, upgraded armor.
  items: InventoryItem[];
};

export type BuildName = "thief" | "knight" | "mage" | "brigadier";

export const builds: Record<BuildName, Build> = {
  thief: {
    label: "Thief",
    level: 1,
    stats: { Strength: 1, Agility: 6, Wisdom: 2, Magic: 1 },
    items: [
      { name: "knife", label: "Knife", type: "weapon" },
      { name: "katana", label: "Katana", type: "weapon" },
      { name: "leather_armor", label: "Leather Armor", type: "armor" },
      { name: "silver_armor", label: "Silver Armor", type: "armor" },
    ],
  },
  knight: {
    label: "Knight",
    level: 1,
    stats: { Strength: 6, Agility: 2, Wisdom: 1, Magic: 1 },
    items: [
      { name: "knife", label: "Knife", type: "weapon" },
      { name: "longsword", label: "Longsword", type: "weapon" },
      { name: "partial_plate", label: "Partial Plate", type: "armor" },
      { name: "full_plate", label: "Full Plate", type: "armor" },
    ],
  },
  mage: {
    label: "Mage",
    level: 1,
    stats: { Strength: 0, Agility: 1, Wisdom: 3, Magic: 6 },
    items: [
      { name: "staff", label: "Staff", type: "weapon" },
      { name: "staff", label: "Staff", type: "weapon" },
      { name: "cloak", label: "Cloak", type: "armor" },
      { name: "silver_armor", label: "Silver Armor", type: "armor" },
    ],
  },
  brigadier: {
    label: "Brigadier",
    level: 1,
    stats: { Strength: 3, Agility: 1, Wisdom: 6, Magic: 1 },
    items: [
      { name: "bronze_mace", label: "Bronze Mace", type: "weapon" },
      { name: "hammer", label: "Hammer", type: "weapon" },
      { name: "brigadier_armor", label: "Brigadier Armor", type: "armor" },
      { name: "silver_armor", label: "Silver Armor", type: "armor" },
    ],
  },
};
