import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'lg', text = 'در حال بارگذاری...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Spinner animation="border" size={size} className="text-primary mb-3" />
      <p className="text-muted">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
