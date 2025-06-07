import React, { useState, useEffect } from "react";
import "@styles/components/ReservationAcceptation.css";

interface ReservationModalProps {
    reservation_id: number | null;
    onClose: () => void;
    onConfirm: (accepted: boolean) => void;
    initialAction?: 'accept' | 'reject' | null;
}

const ReservationAcceptation: React.FC<ReservationModalProps> = ({ 
    reservation_id, 
    onClose,
    onConfirm,
    initialAction = null
}) => {
    const [showConfirmation, setShowConfirmation] = useState(initialAction !== null);
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(initialAction);

    useEffect(() => {
        if (initialAction) {
            setActionType(initialAction);
            setShowConfirmation(true);
        }
    }, [initialAction]);

    const handleFinalConfirm = () => {
        if (actionType) {
            onConfirm(actionType === 'accept');
        }
    };

    if (!reservation_id) return null;

    return (
        <div className="reservation-acceptation-modal">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                {!showConfirmation ? (
                    <>
                        <h2 className="modal-title">Rezerwacja #{reservation_id}</h2>
                        <p className="modal-message">Wybierz co chcesz zrobić:</p>
                        
                        <div className="button-group">
                            <button
                                onClick={() => {
                                    setActionType('accept');
                                    setShowConfirmation(true);
                                }}
                                className="modal-button accept-button"
                            >
                               Zaakceptować
                            </button>
                            <button
                                onClick={() => {
                                    setActionType('reject');
                                    setShowConfirmation(true);
                                }}
                                className="modal-button reject-button"
                            >
                                Odrzucić
                            </button>
                            <button
                                onClick={onClose}
                                className="modal-button cancel-button"
                            >
                                Wyjdź
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="modal-title">
                            {actionType === 'accept' 
                                ? 'Potwierdź akceptacje' 
                                : 'Potwiedź odrzucenie'}
                        </h2>
                        <p className="modal-message">
                            {actionType === 'accept'
                                ? 'Czy napewno chcesz potwierdzić rezerwacje?'
                                : 'Czy napewno chcesz potwierdzić odrzucenie?'}
                        </p>
                        
                        <div className="button-group">
                            <button
                                onClick={handleFinalConfirm}
                                className="modal-button confirm-button"
                            >
                               Tak
                            </button>
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="modal-button cancel-button"
                            >
                                Nie
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReservationAcceptation;