import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ArrowRight, 
  Star, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Zap,
  Tag as TagIcon
} from 'lucide-react';

const QUICK_TAGS = ['真实卡点', '灵感小发现', '认知转折', '真实金句', '读者测选题'];

export default function StageOneMaterialPool({ 
  snippets, 
  categories, 
  onSaveSnippet, 
  onUpdateSnippet, 
  onDeleteSnippet, 
  onSelectForStudio,
  onGoToStudio
}) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inlineContent, setInlineContent] = useState('');
  const [inlineCat, setInlineCat] = useState(categories[0]?.id || 'ielts');
  const [inlineTag, setInlineTag] = useState('真实卡点');

  // Filter snippets
  const filteredSnippets = snippets.filter((item) => {
    if (selectedCat !== 'all' && item.categoryId !== selectedCat) return false;
    if (statusFilter === 'inbox' && item.status !== 'inbox') return false;
    if (statusFilter === 'selected' && item.status !== 'selected') return false;
    if (statusFilter === 'drafted' && item.status !== 'drafted') return false;
    if (statusFilter === 'starred' && !item.starred) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.content.toLowerCase().includes(q) || item.tag?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    if (!inlineContent.trim()) return;

    onSaveSnippet({
      content: inlineContent.trim(),
      categoryId: inlineCat,
      tag: inlineTag,
      photo: null,
      status: 'inbox',
      starred: false,
      createdAt: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    setInlineContent('');
  };

  const inboxCount = snippets.filter(s => s.status === 'inbox').length;
  const selectedCount = snippets.filter(s => s.status === 'selected').length;
  const draftedCount = snippets.filter(s => s.status === 'drafted').length;

  return (
    <div className="stage-page-layout animate-fade-in">
      {/* Editorial Header Note */}
      <div className="stage-editorial-header">
        <div className="header-meta-lead">
          <span className="step-badge">Stage 01</span>
          <span className="step-title-hint">按板块随时记录 · 素材池</span>
        </div>
        <h1 className="editorial-main-title">抓住转瞬即逝的卡点与灵感</h1>
        <p className="editorial-sub-text">
          在做正事时，冒出一句话、一个卡点、一个小发现，<strong>当场记下一句即可，不用完整、不用有逻辑</strong>。
          记录动作绝不打断正事，成本极低。
        </p>
      </div>

      {/* Modern Fluid Quick Capture Box */}
      <div className="capture-box-card">
        <form onSubmit={handleInlineSubmit} className="capture-form">
          <div className="capture-pill-selectors">
            {/* Category selection chips */}
            <div className="selector-group">
              <span className="selector-label">板块：</span>
              <div className="pill-scroll-list">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`selector-pill ${inlineCat === c.id ? 'active' : ''}`}
                    onClick={() => setInlineCat(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag chips */}
            <div className="selector-group">
              <span className="selector-label">属性：</span>
              <div className="pill-scroll-list">
                {QUICK_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`selector-pill tag-pill ${inlineTag === t ? 'active' : ''}`}
                    onClick={() => setInlineTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="capture-input-container">
            <textarea
              className="fluid-capture-input"
              rows={2}
              placeholder="今天备考或写代码卡在哪了？冒出了什么念头？敲下一句话，回车秒存..."
              value={inlineContent}
              onChange={(e) => setInlineContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleInlineSubmit(e);
                }
              }}
            />
            <div className="capture-action-row">
              <span className="keyboard-hint">按 Enter 键即存 · 仅需几秒钟</span>
              <button 
                type="submit" 
                className="btn-capture-submit"
                disabled={!inlineContent.trim()}
              >
                <Plus size={15} />
                <span>存入池子</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Minimalist Filter Bar */}
      <div className="minimal-filter-bar">
        {/* Board Pills */}
        <div className="board-pill-group">
          <button 
            className={`board-btn ${selectedCat === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCat('all')}
          >
            全部 ({snippets.length})
          </button>
          {categories.map((cat) => {
            const count = snippets.filter(s => s.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`board-btn ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                <span>{cat.name}</span>
                <span className="count-sub">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Status & Search */}
        <div className="status-and-search">
          <div className="sub-status-toggle">
            <button 
              className={`status-link ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              全部
            </button>
            <button 
              className={`status-link ${statusFilter === 'inbox' ? 'active' : ''}`}
              onClick={() => setStatusFilter('inbox')}
            >
              待整理 ({inboxCount})
            </button>
            <button 
              className={`status-link ${statusFilter === 'selected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('selected')}
            >
              已选入 ({selectedCount})
            </button>
            <button 
              className={`status-link ${statusFilter === 'drafted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('drafted')}
            >
              已成篇 ({draftedCount})
            </button>
            <button 
              className={`status-link ${statusFilter === 'starred' ? 'active' : ''}`}
              onClick={() => setStatusFilter('starred')}
            >
              ⭐
            </button>
          </div>

          <div className="refined-search-box">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="搜索碎片..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Snippet Index Cards Grid */}
      <div className="snippets-editorial-grid">
        {filteredSnippets.length === 0 ? (
          <div className="empty-editorial-card">
            <Sparkles size={28} className="empty-sparkle" />
            <p className="empty-title">素材池空空如也</p>
            <p className="empty-desc">在上方输入一句话，记录今天的真实瞬间。</p>
          </div>
        ) : (
          filteredSnippets.map((snippet) => {
            const cat = categories.find(c => c.id === snippet.categoryId) || { name: '其他', color: '#888' };
            const isSelected = snippet.status === 'selected';
            const isDrafted = snippet.status === 'drafted';

            return (
              <div 
                key={snippet.id}
                className={`editorial-snippet-card ${isSelected ? 'selected-border' : ''} ${isDrafted ? 'drafted-border' : ''}`}
              >
                {/* Header row */}
                <div className="card-top-row">
                  <div className="cat-and-tag">
                    <span className="card-cat-tag">{cat.name}</span>
                    <span className="card-property-tag">{snippet.tag}</span>
                  </div>
                  <div className="card-tools">
                    <button 
                      className={`star-action ${snippet.starred ? 'active' : ''}`}
                      onClick={() => onUpdateSnippet(snippet.id, { starred: !snippet.starred })}
                    >
                      <Star size={14} fill={snippet.starred ? '#e5a93c' : 'none'} color={snippet.starred ? '#e5a93c' : 'currentColor'} />
                    </button>
                    <button 
                      className="trash-action"
                      onClick={() => onDeleteSnippet(snippet.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Photo thumbnail */}
                {snippet.photo && (
                  <div className="card-photo-wrapper">
                    <img src={snippet.photo} alt="实拍素材" />
                    <span className="photo-badge">📸 实拍</span>
                  </div>
                )}

                {/* Text Content */}
                <div className="card-body-content">
                  <p className="card-text">{snippet.content}</p>
                </div>

                {/* Footer */}
                <div className="card-footer-row">
                  <span className="card-time">
                    <Clock size={11} />
                    {snippet.createdAt}
                  </span>

                  <div className="card-flow-actions">
                    {isDrafted ? (
                      <span className="status-finished">
                        <CheckCircle size={12} />
                        <span>已成篇</span>
                      </span>
                    ) : isSelected ? (
                      <button 
                        className="btn-processing"
                        onClick={onGoToStudio}
                      >
                        <span>工坊加工中</span>
                        <ArrowRight size={12} />
                      </button>
                    ) : (
                      <button 
                        className="btn-promote-to-studio"
                        onClick={() => onSelectForStudio(snippet)}
                      >
                        <span>选入工坊成型</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
