import { AlertCircle, Home, RefreshCw, Server, ShieldAlert, WifiOff } from 'lucide-react';
import React, { useState } from 'react';
import './ErrorState.css';

const ErrorState = ({ 
  type = 'error',
  onRetry = null,
  onGoHome = null
}) => {
  
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const getIcon = () => {
    const iconProps = { size: 64, strokeWidth: 1.5 };
    
    switch(type) {
      case 'network': return <WifiOff {...iconProps} />;
      case 'server': return <Server {...iconProps} />;
      case 'forbidden': return <ShieldAlert {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  const getMessage = () => {
    switch(type) {
      case 'network': return 'لا يوجد اتصال بالإنترنت';
      case 'server': return 'حدث خطأ في الخادم';
      case 'forbidden': return 'ليس لديك صلاحية الوصول';
      default: return 'حدث خطأ غير متوقع';
    }
  };

  return (
    <div className="error-state-root">
      <div className="error-state-inner">
        <div className="error-state-icon">
          {getIcon()}
        </div>
        <p className="error-state-text">{getMessage()}</p>
        <div className="error-state-actions">
          {onRetry && (
            <button 
              className="error-state-btn-retry"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              <RefreshCw size={16} className={isRetrying ? 'error-state-spin' : ''} />
              <span>{isRetrying ? 'جاري المحاولة...' : 'محاولة مرة أخرى'}</span>
            </button>
          )}
          <button 
            className="error-state-btn-home"
            onClick={() => onGoHome ? onGoHome() : window.location.href = '/'}
          >
            <Home size={16} />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;