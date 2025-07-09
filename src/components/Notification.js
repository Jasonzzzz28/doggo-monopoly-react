import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
    const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 border ${borderColor}`}>
            {message}
        </div>
    );
};

export default Notification; 