import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuickCaptureModal from './components/QuickCaptureModal';
import StageOneMaterialPool from './components/StageOneMaterialPool';
import StageTwoDiaryStudio from './components/StageTwoDiaryStudio';
import StageThreePublishTracker from './components/StageThreePublishTracker';
import StageArchitectureDoc from './components/StageArchitectureDoc';
import { 
  initialCategories, 
  initialSnippets, 
  initialDiaries, 
  initialChangelog 
} from './initialData';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './App.css';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('diary_theme') || 'dark';
  });

  // Navigation tab: 'capture' | 'studio' | 'publish' | 'doc'
  const [activeTab, setActiveTab] = useState('capture');

  // Quick Capture Modal
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // App Data with LocalStorage Persistence
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('diary_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [snippets, setSnippets] = useState(() => {
    const saved = localStorage.getItem('diary_snippets');
    return saved ? JSON.parse(saved) : initialSnippets;
  });

  const [diaries, setDiaries] = useState(() => {
    const saved = localStorage.getItem('diary_diaries');
    return saved ? JSON.parse(saved) : initialDiaries;
  });

  const [changelog, setChangelog] = useState(() => {
    const saved = localStorage.getItem('diary_changelog');
    return saved ? JSON.parse(saved) : initialChangelog;
  });

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diary_theme', theme);
  }, [theme]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('diary_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('diary_snippets', JSON.stringify(snippets));
  }, [snippets]);

  useEffect(() => {
    localStorage.setItem('diary_diaries', JSON.stringify(diaries));
  }, [diaries]);

  useEffect(() => {
    localStorage.setItem('diary_changelog', JSON.stringify(changelog));
  }, [changelog]);

  // Global Keyboard Shortcuts (Cmd+K for quick capture, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Stage 1 Handlers
  const handleSaveSnippet = (newSnippet) => {
    const snippetObj = {
      ...newSnippet,
      id: `snip-${Date.now()}`
    };
    setSnippets([snippetObj, ...snippets]);
    showToast('✨ 灵感碎片已成功存入素材池！');
  };

  const handleUpdateSnippet = (id, updates) => {
    setSnippets(snippets.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteSnippet = (id) => {
    setSnippets(snippets.filter(s => s.id !== id));
    showToast('已删除该素材碎片');
  };

  const handleSelectForStudio = (snippet) => {
    handleUpdateSnippet(snippet.id, { status: 'selected' });
    setActiveTab('studio');
    showToast(`📌 已将《${snippet.tag}》选入成型工坊！`);
  };

  // Stage 2 Handlers
  const handleSaveDiary = (diaryObj) => {
    const exists = diaries.some(d => d.id === diaryObj.id);
    if (exists) {
      setDiaries(diaries.map(d => d.id === diaryObj.id ? diaryObj : d));
    } else {
      setDiaries([diaryObj, ...diaries]);
    }
  };

  const handlePublishDiary = (diaryId) => {
    setDiaries(diaries.map(d => {
      if (d.id === diaryId) {
        return {
          ...d,
          publishStatus: 'published',
          publishedAt: new Date().toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return d;
    }));
  };

  // Stage 4 Handlers
  const handleAddChangelog = (newLog) => {
    setChangelog([newLog, ...changelog]);
  };

  // Reset & Export
  const handleResetData = () => {
    if (window.confirm('确定要重置为初始演示数据吗？你记录的新内容将被重置。')) {
      setCategories(initialCategories);
      setSnippets(initialSnippets);
      setDiaries(initialDiaries);
      setChangelog(initialChangelog);
      showToast('🔄 已恢复为初始示范数据');
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      categories,
      snippets,
      diaries,
      changelog,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diary_content_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📦 数据备份文件已成功导出！');
  };

  const counts = {
    snippets: snippets.filter(s => s.status === 'inbox').length,
    drafts: diaries.filter(d => d.publishStatus === 'ready').length,
    published: diaries.filter(d => d.publishStatus === 'published').length
  };

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        counts={counts}
        onResetData={handleResetData}
        onExportData={handleExportData}
      />

      {/* Main Content View Container */}
      <main className="main-content-container container">
        {activeTab === 'capture' && (
          <StageOneMaterialPool
            snippets={snippets}
            categories={categories}
            onSaveSnippet={handleSaveSnippet}
            onUpdateSnippet={handleUpdateSnippet}
            onDeleteSnippet={handleDeleteSnippet}
            onSelectForStudio={handleSelectForStudio}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'studio' && (
          <StageTwoDiaryStudio
            diaries={diaries}
            snippets={snippets}
            onSaveDiary={handleSaveDiary}
            onPublishDiary={handlePublishDiary}
            onShowToast={showToast}
            onGoToPublish={() => setActiveTab('publish')}
          />
        )}

        {activeTab === 'publish' && (
          <StageThreePublishTracker
            diaries={diaries}
            onUpdateDiary={(id, updates) => {
              setDiaries(diaries.map(d => d.id === id ? { ...d, ...updates } : d));
            }}
            onShowToast={showToast}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'doc' && (
          <StageArchitectureDoc
            changelog={changelog}
            onAddChangelog={handleAddChangelog}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Quick Capture Floating Modal (Cmd+K) */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        categories={categories}
        onSaveSnippet={handleSaveSnippet}
      />

      {/* Toast Alert Notice */}
      {toast && (
        <div className="toast-notice">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
