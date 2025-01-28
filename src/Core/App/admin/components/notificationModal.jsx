import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCheckmarkCircle, IoWarning, IoInformation } from "react-icons/io5";
import { getMensajesporCorreo } from '../../../utils/services/get';
import { toast } from 'sonner';

const NotificationsModal = ({ isOpen, onClose, userEmail }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const data = await getMensajesporCorreo(userEmail);

                setNotifications(data);
            } catch (err) {
                setError('Error al cargar las notificaciones');
                toast.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && userEmail) {
            fetchNotifications();
        }
    }, [isOpen, userEmail]);

    const getNotificationIcon = (tipo) => {
        switch (tipo?.toLowerCase()) {
            case 'success':
                return <IoCheckmarkCircle className="size-6 text-green-500" />;
            case 'warning':
                return <IoWarning className="size-6 text-yellow-500" />;
            default:
                return <IoInformation className="size-6 text-blue-500" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed right-4 top-20 z-50 w-full max-w-md bg-white rounded-xl shadow-xl"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <IoClose className="size-5" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center items-center p-8">
                                    <div className="loading loading-spinner loading-md"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500 p-4">
                                    {error}
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center text-gray-500 p-8">
                                    No hay notificaciones
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-4 hover:bg-gray-50 transition-colors flex gap-3 items-start"
                                        >
                                            <div className="flex-shrink-0">
                                                {getNotificationIcon(notification.tipo)}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm text-gray-800 font-medium">
                                                    {notification.titulo}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.mensaje}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {formatDate(notification.fecha)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationsModal;