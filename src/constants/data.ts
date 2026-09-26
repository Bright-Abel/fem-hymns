export const tabs: AppTab[] = [
  {
    name: 'index',
    title: 'Home',
  },
  {
    name: 'favorite',
    title: 'Favorite',
  },
  {
    name: 'settings',
    title: 'Settings',
  },
];

export const churchAnthem = {
  hymn: {
    id: 1, // or Anthem index 0
    hymn_number: 1,
    title: 'We Are Faith Evangelical Mission',
    category: 'Anthem',
    author: 'Faith Evangelical Mission',
    meter: 'Irregular',
    key_signature: 'G Major',
    audio_url: null,
  },
  stanzas: [
    {
      id: 1,
      hymn_id: 1,
      stanza_number: 1,
      is_chorus: 0,
      text: 'We are Faith Evangelical Mission\nBy faith, we have anointing\nTo reach the nations for God\nBy faith, we bring good tidings\nTo the meek, by faith\nThe broken hearted and the captives\nLiberty receive.',
    },
    {
      id: 2,
      hymn_id: 1,
      stanza_number: null,
      is_chorus: 1,
      text: 'Oh faith, faith evangelical mission \nComforts all that mourn\nOh faith, faith evangelical mission\nBeauty for ashes\nOh faith, faith evangelical mission\nClothed with praise\nOh faith, faith evangelical mission\nThe Church with a difference.',
    },
    {
      id: 3,
      hymn_id: 1,
      stanza_number: 2,
      is_chorus: 0,
      text: 'We are priest of the Lord\nMinisters of our God\nBy faith, opening the prisons to them\nThat are bound from sins and slavery\nReceiving double for our shame\nEverlasting joy unto us.',
    },
    {
      id: 4,
      hymn_id: 1,
      stanza_number: 3,
      is_chorus: 0,
      text: 'To advance the knowledge of God’s people\nTo make known christian views\nTo give support and love to all\nWe people seeking God\nThe kingdom Church,\nWith the passion for souls.',
    },
    {
      id: 5,
      hymn_id: 1,
      stanza_number: 4,
      is_chorus: 0,
      text: 'We are one body, one people\nUnited, we stand\nThe glory of the Lord\nHas risen upon you\nTo destroy the works of darkness\nAnd bring glory to His name.',
    },
  ],
};
