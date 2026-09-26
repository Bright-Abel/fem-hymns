import { Text, View } from 'react-native';

interface HymnMetadataProps {
  hymn: HymnDetail;
}

export function HymnMetadata({ hymn }: HymnMetadataProps) {
  return (
    <View className='mb-6 items-center'>
      <Text className='text-2xl font-rubik-bold text-slate-900 dark:text-white text-center leading-8'>
        {hymn.title}
      </Text>

      {hymn.category && (
        <Text className='text-xs uppercase font-rubik-bold tracking-widest text-brand-red mt-2'>
          {hymn.category}
        </Text>
      )}

      <View className='flex-row items-center space-x-3 mt-1.5'>
        {hymn.meter && (
          <Text className='text-xs font-rubik text-slate-400 dark:text-slate-500'>
            Meter: {hymn.meter}
          </Text>
        )}
        {hymn.key_signature && (
          <Text className='text-xs font-rubik text-slate-400 dark:text-slate-500'>
            Key: {hymn.key_signature}
          </Text>
        )}
      </View>

      {hymn.author && (
        <Text className='text-xs font-rubik text-slate-400 dark:text-slate-500 mt-1'>
          Author: {hymn.author}
        </Text>
      )}
    </View>
  );
}
