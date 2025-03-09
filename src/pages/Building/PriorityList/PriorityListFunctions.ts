import { Tier } from "@/components/common/Tierlist/TierlistTypes";
import { DataStore } from "@/stores";
import { Region, RegionContextType, RegionData, RegionStore } from "@/stores/RegionStore";
import { PriorityLists } from "./PriorityListTypes";
import { getDefaultTiers } from "@/components/common/Tierlist/TierlistFunctions";
import { ModelKeys } from "@/common/models";

export const onUnsortedSearch = (search: string, name: string) => name.toLowerCase().includes(search.toLowerCase());
export const onStorageLoaded = (tierlistTitle: string, DataStore: DataStore, region: Region) => (data: RegionContextType) => {
  const priorityList = data[region].priorityLists ?? getDefaultPriorityLists(DataStore);
  if (tierlistTitle in priorityList) return priorityList[tierlistTitle];

  const key = Object.keys(priorityList).find(Boolean);
  return priorityList[key];
}
export const onStorageSave = (tierlistTitle: string, model: ModelKeys, RegionStore: RegionStore, region: Region) => (tiers: Array<Tier<string>>) => ({
  ...RegionStore.regions,
  [region]: {
    ...RegionStore.regions[region],
    priorityLists: {
      ...(RegionStore.regions[region].priorityLists ?? {}),
      [tierlistTitle]: {
        tiers,
        model
      } as PriorityLists[string]
    } as PriorityLists
  } as RegionData
} as RegionContextType);

export const getDefaultPriorityLists = (DataStore: DataStore): PriorityLists => ({
  "General Priority": {
    model: 'Character',
    tiers: getDefaultTiers(DataStore.CharacterNames)()
  },
})