export type TabType = 'favorites' | 'bookmarks';

export type SavedTabProps = {
  activeTab: TabType;
  isDark: boolean;
  onChange: (tab: TabType) => void;
};

export type SavedRowProps = {
  item: SavedHymnItem;
  isDark: boolean;
  onPress: (hymnNumber: number) => void;
  onRemove: (item: SavedHymnItem) => void;
};
