import React from 'react';
import { 
  BookOpen, 
  Feather, 
  Send, 
  Layers, 
  Sparkles, 
  Plus, 
  Sun, 
  Moon, 
  Download, 
  RotateCcw,
  Zap,
  ArrowUpRight
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  theme, 
  setTheme, 
  onOpenQuickCapture,
  counts,
  onResetData,
  onExportData
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Left: Brand & Quiet Strategy Status */}
        <div className="header-left">
          <div className="brand-group" onClick={() => setActiveTab('capture')}>
            <div className="brand-logo-icon">
              <BookOpen size={18} />
            </div>
            <div className="brand-titles">
              <span className="brand-main">LightDiary</span>
              <span className="brand-sub-badge">日记型内容系统</span>
            </div>
          </div>

          {/* Minimalist Dual-Track Pill */}
          <div className="status-pill-discreet" title="日记型低门槛练手感，16步干货型后台持续验证">
            <span className="status-dot-active"></span>
            <span className="pill-text-primary">日记型先跑 · 练小红书手感</span>
            <span className="pill-divider">/</span>
            <span className="pill-text-secondary">后台干货并行</span>
          </div>
        </div>

        {/* Center: Segmented Stage Navigation */}
        <nav className="stage-segment-nav">
          <button 
            id="tab-stage-1"
            className={`nav-segment-item ${activeTab === 'capture' ? 'active' : ''}`}
            onClick={() => setActiveTab('capture')}
          >
            <Layers size={15} />
            <span>素材池</span>
            {counts.snippets > 0 && <span className="nav-badge">{counts.snippets}</span>}
          </button>

          <button 
            id="tab-stage-2"
            className={`nav-segment-item ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <Feather size={15} />
            <span>成型工坊</span>
            {counts.drafts > 0 && <span className="nav-badge highlight">{counts.drafts}</span>}
          </button>

          <button 
            id="tab-stage-3"
            className={`nav-segment-item ${activeTab === 'publish' ? 'active' : ''}`}
            onClick={() => setActiveTab('publish')}
          >
            <Send size={15} />
            <span>发布与复盘</span>
            {counts.published > 0 && <span className="nav-badge green">{counts.published}</span>}
          </button>

          <button 
            id="tab-stage-doc"
            className={`nav-segment-item ${activeTab === 'doc' ? 'active' : ''}`}
            onClick={() => setActiveTab('doc')}
          >
            <Sparkles size={15} />
            <span>初衷与架构</span>
          </button>
        </nav>

        {/* Right: Quick Capture & Subtle Controls */}
        <div className="header-right">
          <button 
            id="btn-quick-capture"
            className="btn-quick-capture-refined"
            onClick={onOpenQuickCapture}
            title="快捷键 Cmd+K"
          >
            <Plus size={15} />
            <span>闪念记一笔</span>
            <kbd className="cmd-kbd">⌘K</kbd>
          </button>

          <div className="subtle-actions">
            <button 
              className="subtle-icon-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? '切换为亮色' : '切换为暗色'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              className="subtle-icon-btn"
              onClick={onExportData}
              title="导出备份数据"
            >
              <Download size={16} />
            </button>
            <button 
              className="subtle-icon-btn"
              onClick={onResetData}
              title="恢复默认示例"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
