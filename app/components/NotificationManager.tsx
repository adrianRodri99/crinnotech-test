"use client";
import { useEffect, useState } from 'react';
import { useNotifications } from '../hooks/redux';
import { X, CheckCircle, XCircle, AlertTriangle, Info, Pin } from 'lucide-react';

export default function NotificationManager() {
  const { notifications, hideNotification } = useNotifications();
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(null);

  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.persistent && notification.duration) {
        const timer = setTimeout(() => {
          hideNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, hideNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-orange-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getColorClasses = (type: string, isPersistent: boolean) => {
    const baseClasses = isPersistent 
      ? 'border-l-4 '
      : '';
    
    switch (type) {
      case 'success':
        return baseClasses + 'bg-green-50 border-green-200 text-green-800' + (isPersistent ? ' border-l-green-500' : '');
      case 'error':
        return baseClasses + 'bg-red-50 border-red-200 text-red-800' + (isPersistent ? ' border-l-red-500' : '');
      case 'warning':
        return baseClasses + 'bg-orange-50 border-orange-200 text-orange-800' + (isPersistent ? ' border-l-orange-500' : '');
      case 'info':
        return baseClasses + 'bg-blue-50 border-blue-200 text-blue-800' + (isPersistent ? ' border-l-blue-500' : '');
      default:
        return baseClasses + 'bg-gray-50 border-gray-200 text-gray-800' + (isPersistent ? ' border-l-gray-500' : '');
    }
  };

  const truncateTitle = (title: string, maxLength: number = 7) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const getSimplifiedAction = (title: string) => {
    if (title.toLowerCase().includes('creat') || title.toLowerCase().includes('cread')) {
      return 'Post creado';
    }
    if (title.toLowerCase().includes('actualizad') || title.toLowerCase().includes('editad')) {
      return 'Post editado';
    }
    if (title.toLowerCase().includes('eliminad') || title.toLowerCase().includes('borrad')) {
      return 'Post eliminado';
    }
    return 'Acción realizada';
  };

  const extractPostTitle = (message: string) => {
    const match = message.match(/"([^"]+)"/);
    return match ? match[1] : '';
  };

  if (notifications.length === 0) return null;

  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-3 max-w-sm">
      {sortedNotifications.map((notification) => {
        const isHovered = hoveredNotification === notification.id;
        const isPersistent = notification.persistent || false;
        const postTitle = extractPostTitle(notification.message);
        
        return (
          <div
            key={notification.id}
            className={`
              rounded-xl border shadow-lg backdrop-blur-sm overflow-hidden
              transform transition-all duration-500 ease-out cursor-pointer
              ${getColorClasses(notification.type, isPersistent)}
              ${isHovered ? 'scale-105 shadow-2xl -translate-y-1' : 'hover:scale-[1.02] hover:shadow-xl'}
              ${isPersistent && !isHovered ? 'h-auto' : ''}
            `}
            style={{
              // Transición 
              padding: isPersistent && !isHovered ? '12px' : '16px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-out, box-shadow 0.3s ease-out',
            }}
            onMouseEnter={() => setHoveredNotification(notification.id)}
            onMouseLeave={() => setHoveredNotification(null)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className={`
                  flex items-center transition-all duration-300 ease-out
                  ${isHovered ? 'scale-110' : ''}
                `}>
                  {getIcon(notification.type)}
                  {isPersistent && (
                    <Pin 
                      size={12} 
                      className={`
                        ml-1 text-gray-500 transition-all duration-300 ease-out
                        ${isHovered ? 'rotate-12 text-gray-700' : ''}
                      `} 
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className={`
                    transition-all duration-400 ease-out
                    ${isPersistent && !isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}
                  `}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate">
                          {getSimplifiedAction(notification.title)}
                        </h4>
                        <span className={`
                          px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-md
                          transition-all duration-300 ease-out
                          ${isHovered ? 'bg-gray-300 scale-105' : ''}
                        `}>
                          {truncateTitle(postTitle)}
                        </span>
                      </div>
                      <p className={`
                        text-xs text-gray-500 transition-all duration-300 ease-out
                        ${isHovered ? 'text-gray-600' : ''}
                      `}>
                        Hover para ver detalles
                      </p>
                    </div>
                  </div>

                  <div className={`
                    transition-all duration-500 ease-out
                    ${isPersistent && !isHovered ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-96'}
                  `}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`
                          font-semibold text-sm transition-all duration-300 ease-out
                          ${isHovered ? 'text-gray-900' : 'text-gray-800'}
                        `}>
                          {notification.title}
                        </h4>
                        {isPersistent && (
                          <span className={`
                            px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-md
                            transition-all duration-300 ease-out
                            ${isHovered ? 'bg-blue-100 text-blue-800 scale-105' : ''}
                          `}>
                            Persistente
                          </span>
                        )}
                      </div>
                      
                      <p className={`
                        text-sm opacity-90 transition-all duration-300 ease-out
                        ${isHovered ? 'opacity-100' : ''}
                      `}>
                        {notification.message}
                      </p>
                      
                      <div className={`
                        transition-all duration-500 ease-out
                        ${isPersistent && isHovered ? 'opacity-100 max-h-32 mt-3' : 'opacity-0 max-h-0 overflow-hidden mt-0'}
                      `}>
                        <div className="pt-3 border-t border-gray-200/50 space-y-2">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Creado:</span> {new Date(notification.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Tipo:</span> {notification.type.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-400 italic">
                            Haz clic en X para eliminar permanentemente
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  hideNotification(notification.id);
                }}
                className={`
                  ml-3 rounded-full transition-all duration-300 ease-out
                  hover:bg-red-50 hover:scale-110 active:scale-95
                  ${isPersistent && !isHovered ? 'p-1' : 'p-1.5'}
                  ${isHovered ? 'hover:bg-red-100 hover:text-red-600' : 'hover:bg-gray-100'}
                `}
                title={isPersistent ? "Eliminar notificación persistente" : "Cerrar"}
              >
                <X 
                  size={isPersistent && !isHovered ? 14 : 16} 
                  className={`
                    transition-all duration-300 ease-out
                    ${isHovered ? 'rotate-90' : ''}
                  `}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}