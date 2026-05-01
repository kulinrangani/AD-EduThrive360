// Icon set — stroke-based, single style. Keep simple.
const mkIcon = (paths, opts={}) => ({ size=20, className="", stroke=1.6, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    className={className} {...rest}>
    {paths}
  </svg>
);

const IconHome = mkIcon(<><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></>);
const IconSchool = mkIcon(<><path d="M3 10l9-5 9 5-9 5-9-5z"/><path d="M7 12v5c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5v-5"/><path d="M21 10v6"/></>);
const IconUsers = mkIcon(<><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c.5-3.5 3.3-5.5 6.5-5.5s6 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c.3-2.7 2-4.5 4.3-4.5"/></>);
const IconBell = mkIcon(<><path d="M6 16V11a6 6 0 1112 0v5l1.5 2.5H4.5L6 16z"/><path d="M10 20a2 2 0 004 0"/></>);
const IconGear = mkIcon(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>);
const IconChart = mkIcon(<><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>);
const IconHeart = mkIcon(<><path d="M12 20s-7-4.5-9-9.5C1.3 6.5 4.5 3 8 4.5c1.6.7 2.8 2 4 3.5 1.2-1.5 2.4-2.8 4-3.5 3.5-1.5 6.7 2 5 6-2 5-9 9.5-9 9.5z"/></>);
const IconSearch = mkIcon(<><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>);
const IconPlus = mkIcon(<><path d="M12 5v14"/><path d="M5 12h14"/></>);
const IconEdit = mkIcon(<><path d="M14 4l6 6-10 10H4v-6z"/><path d="M13 5l6 6"/></>);
const IconTrash = mkIcon(<><path d="M4 7h16"/><path d="M10 7V4h4v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></>);
const IconChevron = mkIcon(<><path d="M9 6l6 6-6 6"/></>);
const IconChevronDown = mkIcon(<><path d="M6 9l6 6 6-6"/></>);
const IconMenu = mkIcon(<><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>);
const IconX = mkIcon(<><path d="M6 6l12 12"/><path d="M18 6L6 18"/></>);
const IconMail = mkIcon(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>);
const IconLock = mkIcon(<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></>);
const IconEye = mkIcon(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>);
const IconArrowRight = mkIcon(<><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>);
const IconArrowLeft = mkIcon(<><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></>);
const IconFilter = mkIcon(<><path d="M4 5h16l-6 8v5l-4 2v-7z"/></>);
const IconDownload = mkIcon(<><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></>);
const IconLogout = mkIcon(<><path d="M10 4H5a1 1 0 00-1 1v14a1 1 0 001 1h5"/><path d="M15 8l4 4-4 4"/><path d="M19 12H9"/></>);
const IconCheck = mkIcon(<><path d="M4 12l5 5L20 6"/></>);
const IconSpark = mkIcon(<><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.8 2.8"/><path d="M15.6 15.6l2.8 2.8"/><path d="M5.6 18.4l2.8-2.8"/><path d="M15.6 8.4l2.8-2.8"/></>);
const IconFlag = mkIcon(<><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></>);
const IconCalendar = mkIcon(<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></>);
const IconDots = mkIcon(<><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>);
const IconBook = mkIcon(<><path d="M4 4h10a4 4 0 014 4v12H8a4 4 0 01-4-4V4z"/><path d="M4 4v12"/></>);
const IconShield = mkIcon(<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></>);

Object.assign(window, {
  IconHome, IconSchool, IconUsers, IconBell, IconGear, IconChart, IconHeart,
  IconSearch, IconPlus, IconEdit, IconTrash, IconChevron, IconChevronDown,
  IconMenu, IconX, IconMail, IconLock, IconEye, IconArrowRight, IconArrowLeft,
  IconFilter, IconDownload, IconLogout, IconCheck, IconSpark, IconFlag,
  IconCalendar, IconDots, IconBook, IconShield,
});

export {
  IconHome,
  IconSchool,
  IconUsers,
  IconBell,
  IconGear,
  IconChart,
  IconHeart,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconChevron,
  IconChevronDown,
  IconMenu,
  IconX,
  IconMail,
  IconLock,
  IconEye,
  IconArrowRight,
  IconArrowLeft,
  IconFilter,
  IconDownload,
  IconLogout,
  IconCheck,
  IconSpark,
  IconFlag,
  IconCalendar,
  IconDots,
  IconBook,
  IconShield,
};
