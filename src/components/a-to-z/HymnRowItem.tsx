import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ITEM_HEIGHT = 58;

const HymnRowItem = React.memo(function HymnRowItem({
  item,
  onPress,
}: {
  item: HymnSummary;
  onPress: (num: number) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item.hymn_number)}
      style={{ height: ITEM_HEIGHT }}
      className='flex-row items-center border-b border-slate-100 dark:border-brand-dark-border/60'
    >
      <View className='w-9 h-9 rounded-full bg-brand-blue-surface dark:bg-brand-blue/20 border border-brand-blue/20 items-center justify-center mr-3'>
        <Text className='text-xs font-rubik-bold text-brand-blue dark:text-white'>
          {item.hymn_number}
        </Text>
      </View>

      <Text
        numberOfLines={1}
        className='text-base font-rubik-medium text-slate-900 dark:text-white flex-1 tracking-tight'
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
});

export default HymnRowItem;
