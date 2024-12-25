import ComboBox from '@/components/common/combo-box';

import { useI18n } from '@/i18n/client';
import SortTag, { sortTagGroup } from '@/types/response/SortTag';

type SortDropdownProps = {
  sortBy: string;
  handleSortChange: (value?: string) => void;
};

export function SortDropdown({ sortBy, handleSortChange }: SortDropdownProps) {
  const { t } = useI18n();

  return (
    <ComboBox
      className="h-full"
      value={{
        label: t(sortBy.toLowerCase().replaceAll('_', '-')),
        value: sortBy,
      }}
      values={sortTagGroup.values.map((value) => ({
        label: t(value.toLowerCase().replaceAll('_', '-')),
        value: value as SortTag,
      }))}
      onChange={handleSortChange}
      searchBar={false}
    />
  );
}
