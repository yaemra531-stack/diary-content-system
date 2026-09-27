import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Zap, Sparkles, Tag, Check, Upload } from 'lucide-react';

const PRESET_PHOTOS = [
  { label: '雅思真经笔记实拍', url: '/sample-images/ielts_notes.jpg' },
  { label: '工作台/MacBook实拍', url: '/sample-images/ai_desk.jpg' }
];

const QUICK_TAGS = ['真实卡点', '灵感小发现', '认知转折', '真实金句', '读者测选题', '实拍备忘'];

export default function QuickCaptureModal({ 
  isOpen, 
  onClose, 
  categories, 
  onSaveSnippet 
}) {
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'ielts');
  const [tag, setTag] = useState('真实卡点');
  const [photo, setPhoto] = useState(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } else {
      setContent('');
      setPhoto(null);
      setShowPhotoPicker(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    onSaveSnippet({
      content: content.trim(),
      categoryId,
      tag,
      photo,
      status: 'inbox',
      starred: false,
      createdAt: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    onClose();
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container quick-capture-card animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="flash-icon-box">
              <Zap size={18} />
            </span>
            <div>
              <h3 className="modal-title">随时记录 · 闪念卡片</h3>
              <p className="modal-subtitle">关键约束：记录动作绝不打断正事，成本极低（一句话、几秒钟）</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Category Selector */}
          <div className="category-chips-row">
            <span className="field-label">所属板块：</span>
            <div className="chips-scroll">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-chip ${categoryId === cat.id ? 'selected' : ''}`}
                  style={{
                    borderColor: categoryId === cat.id ? cat.color : undefined,
                    backgroundColor: categoryId === cat.id ? `${cat.color}20` : undefined,
                    color: categoryId === cat.id ? cat.color : undefined
                  }}
                  onClick={() => setCategoryId(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tags */}
          <div className="tags-row">
            <span className="field-label">属性：</span>
            <div className="tag-badges-wrap">
              {QUICK_TAGS.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`tag-toggle-btn ${tag === t ? 'active' : ''}`}
                  onClick={() => setTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="input-box-wrapper">
            <textarea
              ref={textareaRef}
              className="quick-textarea"
              placeholder="冒出一句真实的话、一个卡点、一个发现，当场记下一句即可，不用完整、不用有逻辑..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="input-box-bottom">
              <span className="char-count">{content.length} 字</span>
              <span className="shortcut-tip">按 ⌘ + Enter 瞬时保存</span>
            </div>
          </div>

          {/* Attached Photo Preview */}
          {photo && (
            <div className="photo-preview-bar">
              <img src={photo} alt="Attached snippet" className="preview-img" />
              <div className="photo-meta">
                <span className="photo-label">已附实拍图（用于练拍照展示能力）</span>
                <button 
                  type="button" 
                  className="remove-photo-btn"
                  onClick={() => setPhoto(null)}
                >
                  移除图片
                </button>
              </div>
            </div>
          )}

          {/* Photo Picker Drawer */}
          {showPhotoPicker && !photo && (
            <div className="photo-picker-drawer animate-fade-in">
              <div className="picker-section-title">选择实拍样本或上传本地实拍：</div>
              <div className="preset-photos-grid">
                {PRESET_PHOTOS.map((p, idx) => (
                  <div 
                    key={idx} 
                    className="preset-photo-card"
                    onClick={() => {
                      setPhoto(p.url);
                      setShowPhotoPicker(false);
                    }}
                  >
                    <img src={p.url} alt={p.label} />
                    <span>{p.label}</span>
                  </div>
                ))}
                <label className="upload-photo-card">
                  <Upload size={20} />
                  <span>上传本地照片</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-actions-footer">
            <div className="left-tools">
              <button 
                type="button" 
                className={`tool-btn ${photo ? 'has-active' : ''}`}
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
              >
                <ImageIcon size={16} />
                <span>{photo ? '更换配图' : '附带实拍图'}</span>
              </button>
            </div>

            <div className="right-tools">
              <button type="button" className="btn-secondary" onClick={onClose}>
                取消
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={!content.trim()}
              >
                <Check size={16} />
                <span>存入素材池 (⌘ Enter)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
