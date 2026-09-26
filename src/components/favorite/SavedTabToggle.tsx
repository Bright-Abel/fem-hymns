import { Bookmark, Heart } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import type { SavedTabProps } from './favoriteTypes';

export function SavedTabToggle({ activeTab, isDark, onChange }: SavedTabProps) {
  return (
    <View className='px-5 pb-3 pt-2'>
      <View className='flex-row rounded-2xl border border-slate-300/40 bg-slate-200/70 p-1 dark:border-brand-dark-border dark:bg-brand-dark-surface'>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChange('favorites')}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor:
              activeTab === 'favorites' ? '#005697' : 'transparent',
          }}
        >
          <Heart
            size={16}
            color={
              activeTab === 'favorites'
                ? '#FFFFFF'
                : isDark
                  ? '#94A3B8'
                  : '#64748B'
            }
            fill={activeTab === 'favorites' ? '#FFFFFF' : 'none'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              marginLeft: 6,
              color:
                activeTab === 'favorites'
                  ? '#FFFFFF'
                  : isDark
                    ? '#94A3B8'
                    : '#475569',
            }}
          >
            Favorites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChange('bookmarks')}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor:
              activeTab === 'bookmarks' ? '#005697' : 'transparent',
          }}
        >
          <Bookmark
            size={16}
            color={
              activeTab === 'bookmarks'
                ? '#FFFFFF'
                : isDark
                  ? '#94A3B8'
                  : '#64748B'
            }
            fill={activeTab === 'bookmarks' ? '#FFFFFF' : 'none'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              marginLeft: 6,
              color:
                activeTab === 'bookmarks'
                  ? '#FFFFFF'
                  : isDark
                    ? '#94A3B8'
                    : '#475569',
            }}
          >
            Bookmarks
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
