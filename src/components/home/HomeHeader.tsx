import images from '@/constants/images';
import { Image, Text, View } from 'react-native';

const HomeHeader = () => {
  return (
    <View className='w-full items-center'>
      <View className='flex-row gap-3 items-center '>
        <Image
          source={images.femLogo}

          resizeMode='contain'

          className='size-10'
        />

        <Text className='font-rubik-extrabold text-2xl text-slate-900 dark:text-white'>
          FEM Hynms
        </Text>
      </View>
    </View>
  );
};

export default HomeHeader;
