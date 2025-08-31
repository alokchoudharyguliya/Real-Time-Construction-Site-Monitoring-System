// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { 
//   LayoutDashboard, 
//   FileText, 
//   Box, 
//   MapPin,
//   ChevronLeft,
//   Building2,
//   Users
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useLanguage } from '@/hooks/use-language';
// import { useAuth } from '@/hooks/use-auth';
// import { Button } from '../ui/button';
// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function Sidebar({ isOpen, onClose }: SidebarProps) {
//   const pathname = usePathname();
//   const { t } = useLanguage();
//   const { user } = useAuth();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const navigation = [
//     {
//       name: t('dashboard'),
//       href: '/dashboard',
//       icon: LayoutDashboard,
//       roles: ['contractor', 'government']
//     },
//     {
//       name: t('reports'),
//       href: '/reports',
//       icon: FileText,
//       roles: ['contractor', 'government']
//     },
//     {
//       name: t('3d_view'),
//       href: '/3d-view',
//       icon: Box,
//       roles: ['contractor', 'government']
//     },
//     {
//       name: 'Site Map',
//       href: '/map',
//       icon: MapPin,
//       roles: ['contractor', 'government']
//     },
//     {
//       name: 'Projects',
//       href: '/projects',
//       icon: Building2,
//       roles: ['government']
//     },
//     {
//       name: 'Contractors',
//       href: '/contractors',
//       icon: Users,
//       roles: ['government']
//     }
//   ];

//   const filteredNavigation = navigation.filter(item => 
//     item.roles.includes(user?.role || 'contractor')
//   );

//   return (
//     <>
//       {/* Mobile backdrop */}
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/20 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <motion.aside
//         initial={false}
//         animate={{
//           // x: isOpen ? '0%' : '0%',
//           width: isCollapsed ? '72px' : '256px'
//         }}
//         transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//         className={cn(
//           `fixed left-0 top-0 z-50 h-full bg-gray-900 border-r border-gray-800 lg:relative lg:translate-x-100`,
//           "flex flex-col"
//         )}
//       >
//         {/* Header */}
//         <div className="p-4 border-b border-gray-800">
//           <div className="flex items-center justify-between">
//             {!isCollapsed && (
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-sm">CS</span>
//                 </div>
//                 <span className="text-white font-semibold">ConstructSight</span>
//               </div>
//             )}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="text-gray-400 hover:text-white hidden lg:flex"
//             >
//               <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
//             </Button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6 space-y-2">
//           {filteredNavigation.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 onClick={() => {
//                   if (window.innerWidth < 1024) {
//                     onClose();
//                   }
//                 }}
//                 className={cn(
//                   "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-300 hover:text-white hover:bg-gray-800"
//                 )}
//               >
//                 <item.icon className="h-5 w-5 flex-shrink-0" />
//                 {!isCollapsed && (
//                   <span className="ml-3 truncate">{item.name}</span>
//                 )}
//                 {isActive && (
//                   <motion.div
//                     layoutId="activeTab"
//                     className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
//                   />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User Info */}
//         {!isCollapsed && (
//           <div className="p-4 border-t border-gray-800">
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">
//                   {user?.role === 'contractor' ? 'C' : 'G'}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                   {user?.name}
//                 </p>
//                 <p className="text-xs text-gray-400 capitalize">
//                   {user?.role}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </motion.aside>
//     </>
//   );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Box, 
  MapPin,
  ChevronLeft,
  X,
  Building2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navigation = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['contractor', 'government']
    },
    {
      name: t('reports'),
      href: '/reports',
      icon: FileText,
      roles: ['contractor', 'government']
    },
    {
      name: t('3d_view'),
      href: '/3d-view',
      icon: Box,
      roles: ['contractor', 'government']
    },
    {
      name: 'Site Map',
      href: '/map',
      icon: MapPin,
      roles: ['contractor', 'government']
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Building2,
      roles: ['government']
    },
    {
      name: 'Contractors',
      href: '/contractors',
      icon: Users,
      roles: ['government']
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'contractor')
  );

  // Close sidebar on mobile if clicked outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
                initial={false}
        animate={{
          // x: isOpen ? '0%' : '0%',
          width: isCollapsed ? '72px' : '256px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        // transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          `fixed left-0 top-0 z-50 h-full bg-gray-900 border-r border-gray-800 lg:relative lg:translate-x-0`,
          "flex flex-col duration-10",
          isOpen ? "block" : "hidden lg:flex"
        )}
        style={{ width: isCollapsed ? 72 : 256 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="text-white font-semibold">ConstructSight</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {/* Collapse/Expand Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-400 hover:text-white hidden lg:flex"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
              </Button>
              {/* Close Button (visible on mobile when open) */}
              {isOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white flex lg:hidden"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group relative",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.role === 'contractor' ? 'C' : 'G'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}