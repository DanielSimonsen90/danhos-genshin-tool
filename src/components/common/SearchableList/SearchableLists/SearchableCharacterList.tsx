import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Character } from "@/common/models";
import { CharacterCard } from "@/components/domain/Character";
import { Props as CharacterCardProps } from "@/components/domain/Character/CharacterCard/CharacterCard";

import { useFavoriteStore } from "@/stores";
import { useContextMenu } from "@/providers/ContextMenuProvider";

import { OptionalProps, UncrontrolledProps } from "../Props";
import SearchableList from "../SearchableList";
import Star from "../../icons/Star";

type Props<TFilterKeys extends string> = (
  & Partial<UncrontrolledProps<Character, TFilterKeys>>
  & OptionalProps<Character, TFilterKeys>
  & {
    noBaseSearch?: boolean;
    noBaseFilterChecks?: boolean;
    cardProps?: Partial<Omit<CharacterCardProps, 'character'>>;
  }
);
export default function SearchableCharacterList<TFilterKeys extends string>({
  items, filterChecks = {} as any, onSearch,
  noBaseFilterChecks, noBaseSearch, cardProps,
  ...props
}: Props<TFilterKeys>) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(new Array<Character>());
  const { add, remove, isFavorite } = useFavoriteStore('characters');

  return <SearchableList items={items}
    sort={(a, b) => isFavorite(a) === isFavorite(b) ? 0 : isFavorite(a) ? -1 : 1}
    onSearchOrFilterChange={() => setHidden([])}
    renderItem={character => {
      const open = useContextMenu(item => [
        item('View', () => navigate(`/characters/${character.name}`), '👁️'),
        item(isFavorite(character) ? 'Unfavorite' : 'Favorite', () => isFavorite(character) ? remove(character) : add(character), '⭐'),
        item('Hide', () => setHidden([...hidden, character]), '🙈'),
      ]);

      return hidden.includes(character) ? null : (
        <div className="context-menu-item-container" onContextMenu={open}>
          {isFavorite(character) && <Star className="favorite-star" onClick={() => remove(character)} />}
          <CharacterCard character={character} {...cardProps} />
        </div>
      );
    }}
    onSearch={noBaseSearch ? onSearch : (query, item) => item.name.toLowerCase().includes(query.toLowerCase()) && (onSearch?.(query, item) ?? true)}
    filterChecks={noBaseFilterChecks ? filterChecks : {
      element: {
        anemo: character => character.element === "Anemo",
        cryo: character => character.element === "Cryo",
        dendro: character => character.element === "Dendro",
        electro: character => character.element === "Electro",
        geo: character => character.element === "Geo",
        hydro: character => character.element === "Hydro",
        pyro: character => character.element === "Pyro",
      },
      weapon: {
        sword: character => character.weapon === "Sword",
        claymore: character => character.weapon === "Claymore",
        polearm: character => character.weapon === "Polearm",
        bow: character => character.weapon === "Bow",
        catalyst: character => character.weapon === "Catalyst",
      },
      needs: {
        hp: character => character.needsHP(),
        atk: character => character.needsATK(),
        def: character => character.needsDEF(),
        energyRecharge: character => character.needsER(),
        elementalMastery: character => character.needsEM(),
      },
      bonusAbility: {
        // Bonus Ability
        none: character => character.bonusAbilities.length === 0,

        bondOfLife: character => character.bonusAbilities.includes('Bond of Life'),
        buffAtk: character => character.bonusAbilities.includes('Buff ATK'),
        heal: character => character.bonusAbilities.includes('Heal'),
        nightsoulsBlessing: character => character.bonusAbilities.includes('Nightsouls Blessing'),
        offFieldDamage: character => character.bonusAbilities.includes('Off-field Damage'),
        selfHeal: character => character.bonusAbilities.includes('Self-heal'),
        shield: character => character.bonusAbilities.includes('Shield'),
      },
      region: {
        mondstadt: character => character.region === "Mondstadt",
        liyue: character => character.region === "Liyue",
        inazuma: character => character.region === "Inazuma",
        sumeru: character => character.region === "Sumeru",
        fontaine: character => character.region === "Fontaine",
        natlan: character => character.region === "Natlan",
        snezhnaya: character => character.region === "Snezhnaya",
        unknown: character => character.region === "Unknown",
      },
      ...filterChecks
    }}
    {...props}
  />;
}