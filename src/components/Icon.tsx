interface IconProps {
  name: 'shuffle' | 'spark' | 'clock' | 'flame' | 'protein' | 'arrow' | 'close' | 'heart' | 'book' | 'play' | 'info' | 'check'
  size?: number
}

const paths: Record<IconProps['name'], string> = {
  shuffle: 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  spark: 'm12 3-1.6 4.4L6 9l4.4 1.6L12 15l1.6-4.4L18 9l-4.4-1.6L12 3ZM5 15l-.8 2.2L2 18l2.2.8L5 21l.8-2.2L8 18l-2.2-.8L5 15Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
  flame: 'M12 22c4 0 7-2.8 7-7 0-3.1-1.8-5.6-4.4-8.7.1 2.3-1 4-2.3 4.7.5-3.6-1.4-6.2-4.1-9 0 4-3.2 6.8-3.2 12.7C5 19 8.1 22 12 22Z',
  protein: 'M7 8c-2.2 0-4-1.1-4-2.5S4.8 3 7 3s4 1.1 4 2.5S9.2 8 7 8Zm10 13c-2.2 0-4-1.1-4-2.5s1.8-2.5 4-2.5 4 1.1 4 2.5-1.8 2.5-4 2.5ZM8.5 7l7 10',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  close: 'M6 6l12 12M18 6 6 18',
  heart: 'M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z',
  book: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H11v17H6.5A2.5 2.5 0 0 0 4 21.5v-17ZM20 4.5A2.5 2.5 0 0 0 17.5 2H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5v-17Z',
  play: 'M8 5v14l11-7L8 5Z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v6m0-10h.01',
  check: 'm5 12 4 4L19 6',
}

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
