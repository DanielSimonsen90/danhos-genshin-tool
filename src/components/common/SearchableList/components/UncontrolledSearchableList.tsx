import { useRef } from "react";
import { classNames, pascalCaseFromCamelCase } from "@/common/functions/strings";
import useKeybind from "@/hooks/useKeybind";
import { ControlledProps, OptionalProps } from "../Props";
import Filter from "../../Filter";
import { FilterObject } from "../../Filter/Filter";

export default function UncontrolledSearchableList<TItem, FilterKeys extends string>(props: ControlledProps<TItem, FilterKeys> & OptionalProps<TItem, FilterKeys>) {
  const { search, setSearch, defaultSearch, placeholder } = props;
  const { children, onShowMore } = props;
  const { className, ulClassName, liClassName } = props;
  const { filterChecks, filters, setFilters, filterPlaceholder, onFilterChange } = props;
  const filterProps = { filterChecks, filters, setFilters, filterPlaceholder, onChange: onFilterChange };

  const inputRef = useRef<HTMLInputElement>(null);
  const sortedChildren = props.sort ? children.sort(([_, a], [__, b]) => props.sort(a, b)) : children;

  useKeybind('f', { ctrlKey: true }, () => {
    if (inputRef.current) inputRef.current.focus();
  });

  return (
    <div className={classNames("searchable-list", className)}>
      <div className="input-group">
        <input type="search" ref={inputRef}
          placeholder={placeholder ?? "Search..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="searchable-list__search"
          defaultValue={defaultSearch}
        />
        {filterChecks && <Filter {...filterProps} />}
      </div>
      {Object.values(filters).some(Boolean) && (
        <ul className="filter-tags">
          {Object.entries(filters).map(([filterOrGroup, value], index) => (
            typeof value === 'object'
              ? Object.entries(value).filter(([key, value]) => value !== undefined).map(([filter]) => (
                <li key={filter} className="filter-tag" onClick={() => {
                  const {
                    [filter as keyof FilterObject<FilterKeys, TItem>[FilterKeys]]: _,
                    ...newValue
                  } = filters[filterOrGroup as FilterKeys] as Record<FilterKeys, boolean>;
                  return setFilters(filters => ({ ...filters, [filterOrGroup]: newValue }));
                }}>
                  {pascalCaseFromCamelCase(filter)}
                </li>
              ))
              : value && (
                <li key={`${filterOrGroup}-${index}`} className="filter-tag" onClick={() => setFilters({ ...filters, [filterOrGroup]: false })}>
                  {pascalCaseFromCamelCase(filterOrGroup)}
                </li>
              )
          ))}
        </ul>
      )}
      {children.length > 0 && (
        <ul className={classNames("searchable-list__list", "hoverable", ulClassName)}>
          {sortedChildren.map(([child, item], key) => (
            !child ? null : <li key={key} className={classNames(
              "searchable-list__list-item",
              typeof liClassName === 'function' ? liClassName(item) : liClassName
            )}>
              {child}
            </li>
          ))}
        </ul>
      )}
      <p className="searchable-list__list-item searchable-list__list-item--end">
        <span>
          There are no more results to show.
        </span>
        {onShowMore && (
          <button onClick={onShowMore} className="button link">
            Show more
          </button>
        )}
      </p>
    </div>
  );
}