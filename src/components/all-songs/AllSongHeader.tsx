import { Link, router } from 'expo-router';
import { ChevronLeft, Settings } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const AllSongHeader = ({ isDark, text }: { isDark: boolean; text: string }) => {
  return (
    <View className='flex-row items-center justify-between pt-2 pb-3 border-b border-slate-200 dark:border-brand-dark-border'>
      <View className='w-full flex-row items-center justify-between'>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className='p-1 -ml-1 rounded-full'
        >
          <ChevronLeft size={28} color={isDark ? '#FFFFFF' : '#005697'} />
        </TouchableOpacity>

        <Text className='text-2xl font-rubik-bold text-brand-blue dark:text-white'>
          {text}
        </Text>

        <Link href={'/(tab)/settings'} asChild>
          <Settings size={24} color={isDark ? '#FFFFFF' : '#005697'} />
        </Link>
      </View>

      <View className='w-8' />
    </View>
  );
};

export default AllSongHeader;
