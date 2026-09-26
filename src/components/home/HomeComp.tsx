import { useSettings } from '@/context/SettingsContext';
import { router } from 'expo-router';
import {
  Contact,
  FileText,
  Grid2X2,
  Info,
  List,
  Music2,
} from 'lucide-react-native';
import { Text as NativeText, ScrollView, View } from 'react-native';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import SafeAreaViewLayout from '../SafeAreaViewLayout';
import HomeHeader from './HomeHeader';
import { HymnNavCard } from './HymnNavCard';

const HomeComp = () => {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const blueIconColor = isDark ? '#38BDF8' : '#005697';
  const redIconColor = isDark ? '#F87171' : '#E31D2B';

  return (
    <SafeAreaViewLayout>
      <View className='flex-1 gap-8'>
        <HomeHeader />

        <View className='gap-2 pb-24'>
          <NativeText className='text-slate-700 dark:text-white text-base font-rubik-medium'>
            What do you want to do today
          </NativeText>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // className='flex-1'
            // contentContainerClassName='flex-row flex-wrap justify-between pb-24'
          >
            <HymnNavCard
              title='All Songs'
              subtitle='Explore all hymns in numerical sequence (1 – 300)'
              icon={<List size={24} color={blueIconColor} strokeWidth={2.25} />}
              badgeText='1 - 300'
              accent='blue'
              layout='grid'
              onPress={() => router.push('/all-songs')}
            />

            {/* 3. A - Z Index Card */}
            <HymnNavCard
              title='A - Z Index'
              subtitle='Alphabetical list sorted from A to Z'
              icon={
                <FileText size={24} color={blueIconColor} strokeWidth={2.25} />
              }
              badgeText='Index'
              accent='blue'
              layout='grid'
              onPress={() => router.push('/a-to-z')}
            />
            <HymnNavCard
              title='Numbers Screen'
              subtitle='Browse all 300 hymns via numeric grid'
              icon={
                <Grid2X2 size={24} color={blueIconColor} strokeWidth={2.25} />
              }
              badgeText='Grid'
              accent='blue'
              layout='grid'
              onPress={() => router.push('/numberspage')}
            />

            {/* 4. Church Anthem Card (Accent Red Highlight) */}
            <HymnNavCard
              title='Church Anthem'
              subtitle='Official anthem and declaration song'
              icon={
                <Music2 size={24} color={redIconColor} strokeWidth={2.25} />
              }
              badgeText='Anthem'
              accent='red'
              layout='grid'
              onPress={() => router.push('/churchAnthem')}
            />
            <HymnNavCard
              title='About'
              subtitle='Browse all 300 hymns via numeric grid'
              icon={<Info size={24} color={blueIconColor} strokeWidth={2.25} />}
              badgeText='Info'
              accent='blue'
              layout='grid'
              onPress={() => router.push('/about')}
            />
            <HymnNavCard
              title='Contact us'
              subtitle='Get in touch with the church team'
              icon={
                <Contact size={24} color={blueIconColor} strokeWidth={2.25} />
              }
              badgeText='Contact'
              accent='blue'
              layout='grid'
              onPress={() => router.push('/contact-us')}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaViewLayout>
  );
};

export default HomeComp;
