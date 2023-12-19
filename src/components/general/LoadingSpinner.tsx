import React from 'react';
import './LoadingSpinner.css'

const LoadingSpinner = ({ customStyle }) => {
    return (
        <div className="superpowered-spinner-container">
            <div className="superpowered-loading-spinner" style={customStyle}>
            </div>
        </div>
    );
}

export default LoadingSpinner;