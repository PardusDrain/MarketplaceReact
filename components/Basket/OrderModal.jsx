import React, { useState, useEffect } from 'react';
import ModalWindow from '../Header/ModalWindow/ModalWindow';
import { useCart } from './CartContext';
import '../Header/ModalWindow/ModalWindow.css';

export default function OrderModal({ total, onClose }) {
  const { clearCart } = useCart();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  useEffect(() => {}, []);
  const [orderId, setOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cvc: '',
    expiryDate: '',
    city: '',
    address: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'Поле обязательно для заполнения';
      } else {
        if (
          key === 'cardNumber' &&
          !/^(\d{4}\s?){3}\d{4}$/.test(value.replace(/\s/g, ''))
        ) {
          newErrors[key] = 'Номер карты должен содержать 16 цифр';
        } else if (key === 'cvc' && !/^\d{3}$/.test(value)) {
          newErrors[key] = 'CVC должен содержать 3 цифры';
        } else if (key === 'expiryDate' && !/^\d{2}\/\d{2}$/.test(value)) {
          newErrors[key] = 'Неверный формат срока действия (MM/YY)';
        } else if (
          ['firstName', 'lastName', 'city'].includes(key) &&
          !/^[А-Яа-яёЁ.]+$/.test(value)
        ) {
          newErrors[key] = 'Допустимы только русские буквы и точки';
        } else if (key === 'address' && !/^[А-Яа-яёЁ.,\s]+$/.test(value)) {
          newErrors[key] =
            'Допустимы только русские буквы, точки, запятые и пробелы';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: formData.city,
          address: formData.address,
          firstName: formData.firstName,
          lastName: formData.lastName,
          total: total,
        }),
      });

      if (!response.ok) throw new Error('Ошибка оформления заказа');

      const { orderId } = await response.json();
      setOrderId(orderId);
      setShowSuccessModal(true);
      clearCart();
    } catch (error) {
      console.error('Ошибка оформления:', error);
      console.error('Order submission error:', error);
      setErrorMessage(
        error.message || 'Произошла ошибка при оформлении заказа',
      );
      setShowErrorModal(true);
      console.log('Error modal visibility:', showErrorModal);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'cardNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 16);
      // Add space every 4 digits
      processedValue = processedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'cvc') {
      processedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (['firstName', 'lastName', 'city'].includes(name)) {
      processedValue = value.replace(/[^А-Яа-яёЁ.]/g, '');
    } else if (name === 'address') {
      processedValue = value.replace(/[^А-Яа-яёЁ.,\s]/g, '');
    } else if (name === 'expiryDate') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 2) {
        processedValue =
          processedValue.slice(0, 2) + '/' + processedValue.slice(2, 4);
      }
      processedValue = processedValue.slice(0, 5);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <>
      {!showSuccessModal && !showErrorModal && (
        <ModalWindow title="Оформление заказа" onClose={onClose}>
          <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key]) => (
              <div
                key={key}
                className={`form-group ${errors[key] ? 'error' : ''}`}
              >
                <label>
                  {getFieldLabel(key)}*
                  <input
                    type={getInputType(key)}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    placeholder={getPlaceholder(key)}
                  />
                </label>
                {errors[key] && (
                  <span className="error-message">{errors[key]}</span>
                )}
              </div>
            ))}
            <button type="submit" disabled={isSubmitting}>
              Подтвердить оформление заказа
            </button>
          </form>
        </ModalWindow>
      )}

      {showSuccessModal && (
        <ModalWindow
          title="Успешное оформление"
          onClose={() => {
            setShowSuccessModal(false);
            onClose();
            window.location.href = '/';
          }}
        >
          <p>Заказ №{orderId} оформлен успешно!</p>
        </ModalWindow>
      )}

      {showErrorModal && (
        <ModalWindow
          title="Ошибка оформления"
          onClose={() => {
            setShowErrorModal(false);
            onClose();
            window.location.href = '/';
          }}
        >
          <p>{errorMessage}</p>
        </ModalWindow>
      )}
    </>
  );
}

function getFieldLabel(key) {
  const labels = {
    cardNumber: 'Номер карты',
    cvc: 'CVC-код',
    city: 'Город',
    address: 'Адрес доставки',
    firstName: 'Имя',
    lastName: 'Фамилия',
    expiryDate: 'Срок действия карты',
  };
  return labels[key];
}

function getInputType(key) {
  return key === 'cardNumber' ? 'text' : key === 'cvc' ? 'password' : 'text';
}

function getPlaceholder(key) {
  return key === 'cardNumber'
    ? '0000 0000 0000 0000'
    : key === 'expiryDate'
    ? 'MM/YY'
    : '';
}
