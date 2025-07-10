import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    message,
    title = 'Are you sure?',
}) => {
    React.useEffect(() => {
        if (isOpen) {
            MySwal.fire({
                title: title,
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'btn btn-success', // You might need to adjust classes based on your CSS framework
                    cancelButton: 'btn btn-danger', // Example: Bootstrap danger button style
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    onConfirm();
                }
                onClose();
            });
        }
    }, [isOpen, onClose, onConfirm, message, title]);

    return null; // SweetAlert2 handles the rendering, so this component doesn't render anything itself
};

export default ConfirmModal;
