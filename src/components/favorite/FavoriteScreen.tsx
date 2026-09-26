import { Text, View } from 'react-native';

import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import { SearchInput } from '@/components/SearchInput';
import { EmptySavedState } from '@/components/favorite/EmptySavedState';
import { SavedHymnRow } from '@/components/favorite/SavedHymnRow';
import { SavedTabToggle } from '@/components/favorite/SavedTabToggle';
import { useSavedHymns } from '@/components/favorite/useSavedHymns';
import { useSettings } from '@/context/SettingsContext';

export function FavoriteScreen() {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    items,
    loading,
    handleOpenHymn,
    handleRemove,
  } = useSavedHymns();

  return (
    <SafeAreaViewLayout>
      <View className='px-5 pb-2 pt-3'>
        <Text className='text-2xl font-rubik-bold text-brand-blue dark:text-white'>
          Library & Saved
        </Text>
      </View>

      <SavedTabToggle
        activeTab={activeTab}
        isDark={isDark}
        onChange={setActiveTab}
      />

      <View className='px-5 pb-2'>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder={`Search ${activeTab}...`}
        />
      </View>

      {loading ? (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-sm font-rubik text-slate-500 dark:text-slate-400'>
            Loading...
          </Text>
        </View>
      ) : (
        <ListRenderer
          items={items}
          activeTab={activeTab}
          isDark={isDark}
          onOpenHymn={handleOpenHymn}
          onRemove={handleRemove}
        />
      )}
    </SafeAreaViewLayout>
  );
}

function ListRenderer({
  items,
  activeTab,
  isDark,
  onOpenHymn,
  onRemove,
}: {
  items: SavedHymnItem[];
  activeTab: 'favorites' | 'bookmarks';
  isDark: boolean;
  onOpenHymn: (hymnNumber: number) => void;
  onRemove: (item: SavedHymnItem) => void;
}) {
  return (
    <View className='flex-1'>
      {items.length === 0 ? (
        <EmptySavedState activeTab={activeTab} />
      ) : (
        <View className='flex-1 px-5'>
          {items.map((item) => (
            <SavedHymnRow
              key={`${activeTab}-${item.id}`}
              item={item}
              isDark={isDark}
              onPress={onOpenHymn}
              onRemove={onRemove}
            />
          ))}
        </View>
      )}
    </View>
  );
}
