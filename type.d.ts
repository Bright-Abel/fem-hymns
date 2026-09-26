import { SafeAreaViewProps } from 'react-native-safe-area-context';

declare global {
  interface SafeAreaViewLayoutProps extends SafeAreaViewProps {
    children?: React.ReactNode;
    className?: string;
    statusBG?: string;
    barStyle?: 'dark-content' | 'light-content';
    background?: string;
  }
  interface AppTab {
    name: string;
    title: string;
  }
  interface HymnNavCardProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    badgeText?: string;
    accent?: 'blue' | 'red';
    layout?: 'row' | 'grid';
    onPress: () => void;
  }
  export interface HymnSummary {
    id: number;
    hymn_number: number;
    title: string;
    category: string | null;
    author: string | null;
  }

  export interface StanzaItem {
    id: number;
    stanza_number: number;
    is_chorus: number; // 0 or 1
    sequence: number;
    text: string;
  }

  export interface HymnDetail {
    id: number;
    hymn_number: number;
    title: string;
    category?: string;
    author?: string;
    meter?: string;
    key_signature?: string;
    audio_url?: string;
    stanzas: StanzaItem[];
  }

  export interface SavedHymnItem {
    id: number;
    hymn_number: number;
    title: string;
    category?: string;
    author?: string;
    saved_at: string;
    notes?: string;
  }
  interface HymnHeaderProps {
    hymnNumber: number;
    isDark: boolean;
    onBack: () => void;
    onPrevious: () => void;
    onNext: () => void;
    handleToggleBookmark: () => Promise<void>;
    handleToggleFavorite: () => Promise<void>;
    isFavorite: boolean;
    isBookmarked: boolean;
  }
}
