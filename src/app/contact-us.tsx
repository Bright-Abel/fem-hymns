// app/contact.tsx
import { MessageCircle, Phone } from 'lucide-react-native';
import {
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AllSongHeader from '@/components/all-songs/AllSongHeader';
import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import images from '@/constants/images';
import { useSettings } from '@/context/SettingsContext';

const ContactUsScreen = () => {
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  const SUPPORT_EMAIL = 'oluwasegunbarnabas@gmail.com';
  const WHATSAPP_NUMBER = '+2349067059501'; // Formatted with country code
  const WHATSAPP_DEFAULT_MESSAGE = encodeURIComponent(
    'Hello, I have an inquiry/feedback regarding the Hymns app.',
  );

  const handleContactUs = async () => {
    const emailUrl = `mailto:${SUPPORT_EMAIL}?subject=App Support Inquiry`;
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Contact Support', `Please email us at ${SUPPORT_EMAIL}`);
      }
    } catch {
      Alert.alert(
        'Error',
        `Could not open mail app. Reach us at: ${SUPPORT_EMAIL}`,
      );
    }
  };

  const handleWhatsApp = async () => {
    const whatsappUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_DEFAULT_MESSAGE}`;
    const webFallbackUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MESSAGE}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webFallbackUrl);
      }
    } catch {
      Alert.alert('Error', 'Unable to open WhatsApp.');
    }
  };

  return (
    <SafeAreaViewLayout>
      {/* Top Header / Back Button */}
      <AllSongHeader isDark={isDark} text='Contact us' />

      {/* Content Container */}
      <View className='flex-1 items-center px-6 pt-10'>
        {/* App Icon Card Illustration */}
        <View className='w-36 h-36 rounded-3xl bg-[#001D4A] dark:bg-[#001433] items-center justify-center shadow-lg border border-slate-200/20 mb-8 relative'>
          {/* Inner Badge/Icon Preview */}
          <View className='w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 items-center justify-center mb-2'>
            <Image
              source={images.femLogo}
              resizeMode='contain'
              className='size-10'
            />
            {/* <BookOpen size={30} color='#FFFFFF' /> */}
          </View>
          <Text className='text-white text-xs font-rubik-bold tracking-wider'>
            FEM HYMNS
          </Text>
          {/* Decorative bottom bookmark ribbon notch */}
          <View className='absolute -bottom-2 w-8 h-3 bg-brand-blue rounded-b-md' />
        </View>

        {/* Heading */}
        <Text className='text-2xl font-rubik-bold text-slate-900 dark:text-white mb-3 text-center'>
          Need Help ?
        </Text>

        {/* Description */}
        <Text className='text-sm font-rubik text-slate-600 dark:text-slate-300 text-center leading-6 max-w-[280px] mb-8'>
          Our support team is always ready to answer any questions you might
          have. We look forward to hearing from you.
        </Text>

        {/* Action Buttons Row */}
        <View className='flex-row items-center gap-2 justify-center space-x-3 w-full px-2'>
          {/* Contact Us Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContactUs}
            className='flex-1 flex-row items-center justify-center py-3.5 px-4 rounded-xl bg-[#1A1A1A] dark:bg-slate-800 shadow-sm'
          >
            <Phone size={18} color='#FFFFFF' style={{ marginRight: 8 }} />
            <Text className='text-white font-rubik-medium text-sm'>
              Contact us
            </Text>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleWhatsApp}
            className='flex-1 flex-row items-center justify-center py-3.5 px-4 rounded-xl bg-[#4CAF50] shadow-sm'
          >
            <MessageCircle
              size={18}
              color='#FFFFFF'
              style={{ marginRight: 8 }}
            />
            <Text className='text-white font-rubik-medium text-sm'>
              Whatsapp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaViewLayout>
  );
};

export default ContactUsScreen;
