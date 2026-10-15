import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { useKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import { useSettings } from '@/context/SettingsContext';
import {
  getHymnByNumber,
  isHymnBookmarked,
  isHymnFavorite,
  toggleHymnBookmark,
  toggleHymnFavorite,
} from '@/services/hymnService';
import { HymnAudioPlayer } from './HymnAudioPlayer';
import { HymnHeader } from './HymnHeader';
import { HymnLyrics } from './HymnLyrics';
import { HymnMetadata } from './HymnMetadata';

const HymnReaderScreen = () => {
  useKeepAwake();

  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const { theme, fontSize, repeatAudioByStanza, autoPlayAudio } = useSettings();
  const isDark = theme === 'dark';
  const hymnId = Array.isArray(id) ? id[0] : id;
  const hymnNumber = Number.parseInt(hymnId ?? '', 10);

  const [hymn, setHymn] = useState<HymnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioErrors, setAudioErrors] = useState<Record<string, string>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const audioError = useMemo(() => {
    if (!hymn?.audio_url) return null;
    if (/\.midi?$/i.test(hymn.audio_url)) {
      return 'MIDI files cannot be played here. Use MP3 or WAV audio.';
    }
    return audioErrors[hymn.audio_url] ?? null;
  }, [audioErrors, hymn?.audio_url]);
  const playerRef = useRef<AudioPlayer | null>(null);
  const currentRepeatCountRef = useRef(0);

  useEffect(() => {
    async function loadHymnAndStates() {
      setLoading(true);
      try {
        const data = await getHymnByNumber(db, hymnNumber);
        setHymn(data);

        if (data) {
          const [favStatus, bookmarkStatus] = await Promise.all([
            isHymnFavorite(db, data.id),
            isHymnBookmarked(db, data.id),
          ]);
          setIsFavorite(favStatus);
          setIsBookmarked(bookmarkStatus);
        }
      } catch (e) {
        console.error('Failed to load hymn details:', e);
      } finally {
        setLoading(false);
      }
    }

    loadHymnAndStates();
  }, [hymnNumber, db]);

  const handleToggleFavorite = async () => {
    if (!hymn) return;
    try {
      const nextState = await toggleHymnFavorite(db, hymn.id);
      setIsFavorite(nextState);
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  };

  // 3. Toggle Bookmark Handler
  const handleToggleBookmark = async () => {
    if (!hymn) return;
    try {
      const nextState = await toggleHymnBookmark(db, hymn.id);
      setIsBookmarked(nextState);
    } catch (e) {
      console.error('Failed to toggle bookmark:', e);
    }
  };

  const totalVerses = useMemo(
    () => hymn?.stanzas.filter((stanza) => stanza.is_chorus === 0).length ?? 0,
    [hymn],
  );

  useEffect(() => {
    currentRepeatCountRef.current = 0;
    if (!hymn?.audio_url) return;

    const audioUrl = hymn.audio_url;

    let player: AudioPlayer;
    try {
      player = createAudioPlayer(audioUrl);
    } catch (error) {
      setAudioErrors((errors) => ({
        ...errors,
        [audioUrl]:
          error instanceof Error ? error.message : 'Unable to load audio.',
      }));
      return;
    }

    playerRef.current = player;
    const subscription = player.addListener(
      'playbackStatusUpdate',
      (status) => {
        if (status.error) {
          setAudioErrors((errors) => ({
            ...errors,
            [audioUrl]: status.error!,
          }));
          setIsPlaying(false);
          return;
        }

        setIsPlaying(status.playing);

        if (status.didJustFinish) {
          if (
            repeatAudioByStanza &&
            currentRepeatCountRef.current < totalVerses - 1
          ) {
            currentRepeatCountRef.current += 1;
            setRepeatCount(currentRepeatCountRef.current);
            player.seekTo(0);
            player.play();
          } else {
            currentRepeatCountRef.current = 0;
            setRepeatCount(0);
            setIsPlaying(false);
          }
        }
      },
    );

    if (autoPlayAudio) player.play();

    return () => {
      subscription.remove();
      player.release();
      playerRef.current = null;
      setIsPlaying(false);
      currentRepeatCountRef.current = 0;
    };
  }, [hymn?.audio_url, autoPlayAudio, repeatAudioByStanza, totalVerses]);

  const togglePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) player.pause();
    else player.play();
  };

  const handleRestart = () => {
    const player = playerRef.current;
    if (!player) return;
    currentRepeatCountRef.current = 0;
    setRepeatCount(0);
    player.seekTo(0);
    player.play();
  };

  const navigateToHymn = (nextNumber: number) => {
    if (nextNumber >= 1 && nextNumber <= 300) {
      router.replace(`/hynm/${nextNumber}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaViewLayout>
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#005697' />
        </View>
      </SafeAreaViewLayout>
    );
  }

  if (!hymn) {
    return (
      <SafeAreaViewLayout>
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-lg font-rubik-bold text-slate-800 dark:text-white mb-4'>
            Hymn #{hymnNumber} Not Found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className='bg-brand-blue px-5 py-2.5 rounded-full'
          >
            <Text className='text-white font-rubik-bold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaViewLayout>
    );
  }

  return (
    <SafeAreaViewLayout>
      <HymnHeader
        hymnNumber={hymnNumber}
        isDark={isDark}
        onBack={() => router.back()}
        onPrevious={() => navigateToHymn(hymnNumber - 1)}
        onNext={() => navigateToHymn(hymnNumber + 1)}
        handleToggleBookmark={handleToggleBookmark}
        handleToggleFavorite={handleToggleFavorite}
        isBookmarked={isBookmarked}
        isFavorite={isFavorite}
      />

      <ScrollView
        className='flex-1 px-6'
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <HymnMetadata hymn={hymn} />
        <HymnLyrics stanzas={hymn.stanzas} fontSize={fontSize} />
      </ScrollView>

      {hymn.audio_url && (
        <HymnAudioPlayer
          hymnNumber={hymn.hymn_number}
          isDark={isDark}
          isPlaying={isPlaying}
          audioError={audioError}
          repeatAudioByStanza={repeatAudioByStanza}
          repeatCount={repeatCount}
          totalVerses={totalVerses}
          onRestart={handleRestart}
          onToggle={togglePlayPause}
        />
      )}
    </SafeAreaViewLayout>
  );
};

export default HymnReaderScreen;
