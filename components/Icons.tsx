import React from 'react';

// Standardized className logic
const defaultClass = "w-6 h-6";

// LOGO : 3 Pics Solides (Le design validé)
export const IconMountain = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15 5.25l-4.5 6-3-3-6.75 11.25h22.5L15 5.25z" />
  </svg>
);

export const IconDashboard = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
  </svg>
);

// GÉNÉRATEUR : Ampoule (Version Simple & Massive)
export const IconBulb = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 3.82 2.66 5.86 3.78 7.36.52.7.97 1.46.97 2.39H14.75c0-.93.45-1.69.97-2.39C16.84 15.36 19.5 13.32 19.5 9.5 19.5 5.36 16.14 2 12 2zM14.75 21.25h-5.5v-1h5.5v1zM13.5 23h-3v-1h3v1z" />
  </svg>
);

// VALIDATEUR : Bar Chart (3 Barres Distinctes)
export const IconChart = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.375 2.25c.621 0 1.125.504 1.125 1.125v17.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125h2.25zM10.5 7.5a1.125 1.125 0 011.125 1.125v12c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-12a1.125 1.125 0 011.125-1.125h2.25zM2.625 12.75a1.125 1.125 0 011.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75a1.125 1.125 0 011.125-1.125h2.25z" />
  </svg>
);

// BLUEPRINT : Plan/Carte (Document technique déplié)
export const IconBlueprint = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
  </svg>
);

// CHANTIER : Mur de Briques (Construction)
export const IconConstruction = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h18a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V4.5zm0 6A.75.75 0 013 9.75h9a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75v-2.25zm11.25 0a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-2.25zm-11.25 6a.75.75 0 01.75-.75h18a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75v-2.25z" clipRule="evenodd" />
  </svg>
);

// Used for "Tech Stack" tools
export const IconTools = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.005 2.255a6.003 6.003 0 013.36 10.975l6.332 7.599a1.5 1.5 0 01-2.304 1.92l-6.332-7.6a6.002 6.002 0 11-1.056-12.894zm2.025 4.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" clipRule="evenodd" />
  </svg>
);

export const IconNewspaper = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.84 16.411 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
    <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
  </svg>
);

export const IconSparkles = ({ className = defaultClass }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    {/* Étoile principale */}
    <path
      d="M12 3.5L14.3 9.7L20.5 12L14.3 14.3L12 20.5L9.7 14.3L3.5 12L9.7 9.7L12 3.5Z"
      fillOpacity="0.95"
    />
    {/* Étincelle haut-gauche */}
    <path
      d="M6.2 4.2L7.1 6.5L9.4 7.4L7.1 8.3L6.2 10.6L5.3 8.3L3 7.4L5.3 6.5L6.2 4.2Z"
      fillOpacity="0.7"
    />
    {/* Étincelle bas-droite */}
    <path
      d="M17.8 13.4L18.6 15.3L20.5 16.1L18.6 17L17.8 18.9L16.9 17L15 16.1L16.9 15.3L17.8 13.4Z"
      fillOpacity="0.7"
    />
  </svg>
);

export const IconUser = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

export const IconSave = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
  </svg>
);

export const IconTrash = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
  </svg>
);

// Clean check mark icon (professional, simple stroke)
export const IconCheck = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconMagic = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
  </svg>
);

// Rocket: Vertical, Outline (Clean & Readable)
export const IconRocket = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2.25c-1.5 0-4 3-4 9 0 2.5 1.5 5 4 5s4-2.5 4-5c0-6-2.5-9-4-9z" />
    <path d="M8 16.25L3.75 20.25V21.75H7.25L10 19" />
    <path d="M16 16.25L20.25 20.25V21.75H16.75L14 19" />
    <path d="M12 17v4.75" />
    <circle cx="12" cy="10" r="2" />
  </svg>
);

export const IconTrendingUp = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 01.968-.432l5.942 2.28a.75.75 0 01.431.97l-2.28 5.941a.75.75 0 11-1.4-.537l1.63-4.251-1.086.483a11.2 11.2 0 00-5.45 5.174.75.75 0 01-1.199.19L9 12.31l-6.22 6.22a.75.75 0 11-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l3.606 3.605a12.694 12.694 0 015.68-4.973l1.086-.484-4.251-1.631a.75.75 0 01-.432-.97z" clipRule="evenodd" />
  </svg>
);

export const IconArrowRight = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const IconTrophy = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.348zm13.668 8.04c-.445-3.383-3.316-6.002-6.834-6.002-3.518 0-6.39 2.619-6.834 6.003a2.25 2.25 0 012.204 2.25h9.26a2.25 2.25 0 012.204-2.25z" clipRule="evenodd" />
  </svg>
);

export const IconClock = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);

export const IconLayer = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l9 9a.75.75 0 01-1.06 1.06l-8.47-8.47-8.47 8.47a.75.75 0 01-1.06-1.06l9-9z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12 5.77l8.47 8.47a.75.75 0 11-1.06 1.06l-7.41-7.42-7.42 7.42a.75.75 0 01-1.06-1.06L12 5.77z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12 12.53l8.47 8.47a.75.75 0 11-1.06 1.06l-7.41-7.42-7.42 7.42a.75.75 0 01-1.06-1.06L12 12.53z" clipRule="evenodd" />
  </svg>
);

export const IconList = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

export const IconCode = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 01-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
  </svg>
);

export const IconDownload = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const IconFile = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
  </svg>
);

// SHERPA : Silhouette User (Simple & Solide)
export const IconSherpa = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

export const IconX = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const IconLock = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

export const IconMail = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

export const IconGoogle = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
  </svg>
);

export const IconCopy = ({ className = defaultClass }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M15.75 2.25h-9A2.25 2.25 0 004.5 4.5v9A2.25 2.25 0 006.75 15h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0015.75 2.25z" />
    <path d="M18.75 6.75h-1.5v7.5a3 3 0 01-3 3h-7.5v1.5a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25z" />
  </svg>
);

export const IconCodeBlockCopy = ({ className = defaultClass }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className={className}
  >
    {/* Fenêtre de code */}
    <rect x="4" y="5" width="12" height="12" rx="2" ry="2" fill="currentColor" opacity="0.08" />
    <rect x="4" y="5" width="12" height="12" rx="2" ry="2" />

    {/* Chevrons < > */}
    <path d="M8.5 10.5L7 12l1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 10.5L13 12l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Petit bouton "copier" */}
    <rect x="13.5" y="13.5" width="6" height="6" rx="1.5" ry="1.5" fill="currentColor" opacity="0.12" />
    <rect x="13.5" y="13.5" width="6" height="6" rx="1.5" ry="1.5" />
    <path d="M15.25 16.5h2.5" strokeLinecap="round" />
  </svg>
);

export const IconDiamond = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
    <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
  </svg>
);

export const IconCreditCard = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm18 3H3.75v8.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V9zm-3 5.25a.75.75 0 010 1.5h-4.5a.75.75 0 010-1.5h4.5z" clipRule="evenodd" />
  </svg>
);

export const IconInfinity = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08c-2.657 0-5.016.98-6.838 2.63a.75.75 0 00.476 1.322c.232 0 .458-.084.634-.239a9.707 9.707 0 006.578-2.213 9.71 9.71 0 001.032 0 9.707 9.707 0 006.578 2.213c.176.155.402.239.634.239a.75.75 0 00.476-1.322 11.209 11.209 0 01-6.838-2.63zM12.516 21.83a.75.75 0 01-1.032 0 11.209 11.209 0 00-7.877-3.08 11.209 11.209 0 00-6.838-2.63.75.75 0 01.476-1.322c.232 0 .458.084.634.239a9.707 9.707 0 016.578 2.213 9.71 9.71 0 011.032 0 9.707 9.707 0 016.578-2.213c.176-.155.402-.239.634-.239a.75.75 0 01.476 1.322 11.209 11.209 0 00-6.838 2.63z" clipRule="evenodd" />
    <path d="M2.25 12a9.75 9.75 0 0119.5 0 9.75 9.75 0 01-19.5 0zM12 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12.75a.75.75 0 01-.75-.75V12z" />
  </svg>
);

export const IconPlus = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const IconSettings = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
  </svg>
);

export const IconLogout = ({ className = defaultClass }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const IconLockOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path
      d="M7 11V7a5 5 0 0 1 9.9-1"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x={3}
      y={11}
      width={18}
      height={10}
      rx={2}
      ry={2}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Professional flat design icons (replacing emojis)
// Lightbulb icon (idea)
export const IconIdea = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M9 21h6M10 18h4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Rocket icon
export const IconRocketFlat = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L4 8v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V8l-8-6z" fill="#818CF8" stroke="#6366F1" strokeWidth="1.5"/>
    <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Target icon
export const IconTarget = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill="#EF4444"/>
  </svg>
);

// Chart/Analytics icon
export const IconAnalytics = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 3v16c0 1.1.9 2 2 2h16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 16v-5M12 16V8M17 16v-8" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="7" cy="11" r="2" fill="#3B82F6"/>
    <circle cx="12" cy="8" r="2" fill="#3B82F6"/>
    <circle cx="17" cy="8" r="2" fill="#3B82F6"/>
  </svg>
);

// Code/Terminal icon
export const IconTerminal = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="1.5"/>
    <path d="M6 9l3 3-3 3M11 15h6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="7" r="0.5" fill="#EF4444"/>
    <circle cx="8" cy="7" r="0.5" fill="#F59E0B"/>
    <circle cx="10" cy="7" r="0.5" fill="#10B981"/>
  </svg>
);

// Checkmark in circle icon
export const IconCheckCircle = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#10B981" stroke="#059669" strokeWidth="1.5"/>
    <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Warning/Alert icon
export const IconWarning = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 20h20L12 2z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 9v5M12 17h.01" stroke="#92400E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Lightning/Speed icon
export const IconLightning = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Money/Dollar icon
export const IconMoney = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#34D399" stroke="#059669" strokeWidth="1.5"/>
    <path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9M9 15h4.5a1.5 1.5 0 000-3H9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Tools/Settings icon
export const IconWrench = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
  </svg>
);

// Shield/Security icon
export const IconShield = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Package/Box icon
export const IconPackage = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#F472B6" stroke="#EC4899" strokeWidth="1.5"/>
    <path d="M12 12L2 7M12 12l10-5M12 12v10" stroke="#BE185D" strokeWidth="1.5"/>
  </svg>
);

// Question mark icon
export const IconQuestion = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Building/Company icon
export const IconBuilding = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="1" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
    <path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2M10 22v-4h4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Kanban/Board icon
export const IconKanban = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="6" height="18" rx="1" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
    <rect x="11" y="3" width="6" height="12" rx="1" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
    <rect x="19" y="3" width="2" height="8" rx="1" fill="#86EFAC" stroke="#10B981" strokeWidth="1.5"/>
  </svg>
);

// Sparkle/Magic icon
export const IconSparkle = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M6 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM18 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#FCD34D"/>
  </svg>
);

// No/Cross icon
export const IconCross = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5"/>
    <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Person/User icon
export const IconPerson = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
    <path d="M6 21v-2a5 5 0 0110 0v2" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
