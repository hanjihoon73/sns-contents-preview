/**
 * 아이콘 모음 (인스타그램·유튜브 앱 아이콘 모양 + 앱 UI 아이콘)
 */
const svgProps = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
});

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* ----- 인스타그램 ----- */
export const IconHeart = ({ size = 24 }) => (
  <svg {...svgProps(size)} {...strokeProps}>
    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z" />
  </svg>
);

export const IconComment = ({ size = 24 }) => (
  <svg {...svgProps(size)} {...strokeProps}>
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" />
  </svg>
);

export const IconSend = ({ size = 24 }) => (
  <svg {...svgProps(size)} {...strokeProps}>
    <line x1="22" y1="3" x2="9.218" y2="10.083" />
    <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" />
  </svg>
);

export const IconBookmark = ({ size = 24 }) => (
  <svg {...svgProps(size)} {...strokeProps}>
    <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" />
  </svg>
);

export const IconMoreHorizontal = ({ size = 24 }) => (
  <svg {...svgProps(size)} fill="currentColor">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

/* ----- 유튜브 ----- */
export const IconThumbUp = ({ size = 20, down = false }) => (
  <svg {...svgProps(size)} fill="currentColor" style={down ? { transform: 'rotate(180deg)' } : undefined}>
    <path d="M13.12 2.06 7.58 7.6c-.37.37-.58.88-.58 1.41V19c0 1.1.9 2 2 2h9c.8 0 1.52-.48 1.84-1.21l3.26-7.61C23.94 10.2 22.49 8 20.34 8h-5.65l.95-4.58c.1-.5-.05-1.01-.41-1.37-.59-.58-1.53-.58-2.11.01ZM3 21c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2s-2 .9-2 2v8c0 1.1.9 2 2 2Z" />
  </svg>
);

export const IconYtComment = ({ size = 20 }) => (
  <svg {...svgProps(size)} fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H6l-2 2V4h16v12Z" />
  </svg>
);

export const IconShare = ({ size = 20 }) => (
  <svg {...svgProps(size)} fill="currentColor">
    <path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9Z" />
  </svg>
);

export const IconMoreVertical = ({ size = 20 }) => (
  <svg {...svgProps(size)} fill="currentColor">
    <circle cx="12" cy="5" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="12" cy="19" r="1.7" />
  </svg>
);

/* ----- 앱 UI ----- */
export const IconSun = ({ size = 18 }) => (
  <svg {...svgProps(size)} {...strokeProps}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const IconMoon = ({ size = 18 }) => (
  <svg {...svgProps(size)} {...strokeProps}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

export const IconLogo = ({ size = 20 }) => (
  <svg {...svgProps(size)} {...strokeProps} strokeWidth={2.2}>
    <rect x="5" y="3" width="14" height="18" rx="3" />
    <path d="M10 9v6l5-3z" fill="currentColor" stroke="none" />
  </svg>
);
