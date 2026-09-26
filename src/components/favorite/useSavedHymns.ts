import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import {
  getBookmarkedHymns,
  getFavoriteHymns,
  toggleHymnBookmark,
  toggleHymnFavorite,
} from '@/services/hymnService';
import type { TabType } from './favoriteTypes';

export function useSavedHymns() {
  const router = useRouter();
  const db = useSQLiteContext();

  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<SavedHymnItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedData = useCallback(async () => {
    setLoading(true);

    try {
      const data =
        activeTab === 'favorites'
          ? await getFavoriteHymns(db, search)
          : await getBookmarkedHymns(db, search);
      setItems(data);
    } catch (error) {
      console.error('Failed to load saved hymns:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, db, search]);

  useFocusEffect(
    useCallback(() => {
      loadSavedData();
    }, [loadSavedData]),
  );

  const handleRemove = useCallback(
    (item: SavedHymnItem) => {
      const isFav = activeTab === 'favorites';

      Alert.alert(
        isFav ? 'Remove Favorite' : 'Remove Bookmark',
        `Remove "${item.title}" from your ${isFav ? 'favorites' : 'bookmarks'}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                if (isFav) {
                  await toggleHymnFavorite(db, item.id);
                } else {
                  await toggleHymnBookmark(db, item.id);
                }
                setItems((prev) =>
                  prev.filter((entry) => entry.id !== item.id),
                );
              } catch (error) {
                console.error('Failed to remove item:', error);
              }
            },
          },
        ],
      );
    },
    [activeTab, db],
  );

  const handleOpenHymn = useCallback(
    (hymnNumber: number) => {
      router.push(`/hynm/${hymnNumber}`);
    },
    [router],
  );

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    items,
    loading,
    handleOpenHymn,
    handleRemove,
  };
}
