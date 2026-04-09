import { FolderOpen, Inbox, Plus, Search } from 'lucide-react';
import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  type = 'default',
  onAction = null,
  actionText = 'إضافة جديد'
}) => {
  
  const getIcon = () => {
    const iconProps = { size: 64, strokeWidth: 1.5 };
    
    switch(type) {
      case 'search': return <Search {...iconProps} />;
      case 'inbox': return <Inbox {...iconProps} />;
      default: return <FolderOpen {...iconProps} />;
    }
  };

  const getMessage = () => {
    switch(type) {
      case 'search': return 'لا توجد نتائج';
      case 'inbox': return 'صندوق الوارد فارغ';
      default: return 'لا توجد بيانات';
    }
  };

  return (
    <div className="empty-state-root">
      <div className="empty-state-inner">
        <div className="empty-state-icon">
          {getIcon()}
        </div>
        <p className="empty-state-text">{getMessage()}</p>
        {onAction && (
          <button className="empty-state-btn" onClick={onAction}>
            <Plus size={16} />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;