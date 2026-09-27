import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Send, 
  Save, 
  Image as ImageIcon, 
  Smartphone, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Share2, 
  Coffee, 
  Terminal, 
  Flame, 
  X,
  Upload,
  RefreshCw,
  Plus,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_PHOTOS = [
  { label: '雅思真经笔记实拍', url: '/sample-images/ielts_notes.jpg' },
  { label: '工作台/MacBook实拍', url: '/sample-images/ai_desk.jpg' }
];

export default function StageTwoDiaryStudio({ 
  diaries, 
  snippets, 
  onSaveDiary, 
  onPublishDiary,
  onShowToast,
  onGoToPublish
}) {
  const [activeDiaryId, setActiveDiaryId] = useState(diaries[0]?.id || 'new');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selectedSnippetIds, setSelectedSnippetIds] = useState([]);
  const [styleMode, setStyleMode] = useState('dongdong');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  useEffect(() => {
    const current = diaries.find(d => d.id === activeDiaryId);
    if (current) {
      setTitle(current.title || '');
      setContent(current.content || '');
      setTags(current.tags || []);
      setPhotos(current.photos || []);
      setSelectedSnippetIds(current.snippetIds || []);
      setStyleMode(current.style || 'dongdong');
    } else {
      setTitle('');
      setContent('');
      setTags(['日常打卡', '小红书手感']);
      setPhotos(['/sample-images/ai_desk.jpg']);
      setSelectedSnippetIds([]);
      setStyleMode('dongdong');
    }
  }, [activeDiaryId, diaries]);

  const referencedSnippets = snippets.filter(s => selectedSnippetIds.includes(s.id));
  const availableSnippets = snippets.filter(s => !selectedSnippetIds.includes(s.id));

  const handleAITransform = (mode) => {
    setIsGenerating(true);
    setStyleMode(mode);

    setTimeout(() => {
      let transformed = '';
      if (mode === 'dongdong') {
        transformed = `事情是这样的。最近我把那几千个雅思词又翻了一遍，一页大概15个，我只认识两三个。剩下的不能说眼熟，只能说见过也跟没见过一样。。。当时就一个反应：完了，这还怎么考6.5？

其实能试的办法我都试过了。抄写太慢，百词斩容易忘，最后我把Anki、AI生成场景图和词根联想拼在了一起。碰到死活记不住的词，4个一组丢给AI生成场景图。

今天翻到之前卡住的那几页，retain、retrieve这种词基本都能对上号了。这套方法我还在继续跑，但至少现在不是刷完就忘了。大家平时背词最容易卡在哪？`;
        if (!title) setTitle('分享一个不那么费劲的AI背单词方法');
      } else if (mode === 'yimi') {
        transformed = `干货型按16步流程磨了25小时，一篇文章没发出来，太累了。

今天想明白了：干货型要求“反复做过验证过才敢出”，冷启动根本耗不起。不如日记型插队先跑，一张现成实拍桌子图配3句话，像跟朋友随口聊天。

发得快、发得多，测测大家到底喜欢看什么，顺带把拍照手感练熟。两条线并行，不内耗了。`;
        if (!title) setTitle('干货写不动了，我决定先发日记练手感');
      } else if (mode === 'xiaohongshu') {
        transformed = `翻开真经单词书第一页我就懵了，15个单词只认识3个，当时真想把书直接合上！

后来我彻底放弃死记硬背，改成“AI场景图+Anki记忆曲线”法，专治retain、retrieve这种抽象难词。

今天同一批词全刷完，只有2个不熟！背单词真没必要死磕，方法对了手感完全不一样。评论区留个爪，分享你的背词神仙方法👇`;
        if (!title) setTitle('救命！原来雅思难词用AI配图这么好记？！');
      } else if (mode === 'colloquial') {
        transformed = `今天下午我坐在桌前突然想通了一件事。
之前总觉得自己写不出干货是因为知识储备不够，后来才发现，其实就是把事情想得太重了。
别整那些大词，就像平时跟朋友聊微信一样，把今天碰到的这个卡点老老实实写出来，反而有人看。
放平心态，先把今天这份日记发出去再说。`;
        if (!title) setTitle('今天突然想通了一件事，放平心态了');
      }

      setContent(transformed);
      setIsGenerating(false);
      onShowToast(`已转换为【${mode === 'dongdong' ? '懂懂拉家常' : mode === 'yimi' ? '薏米工头风' : mode === 'xiaohongshu' ? '小红书痛点反转' : '口语化大白话'}】`);
    }, 400);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    const diaryObj = {
      id: activeDiaryId === 'new' ? `diary-${Date.now()}` : activeDiaryId,
      title: title || '未命名日记',
      content,
      tags,
      photos,
      snippetIds: selectedSnippetIds,
      style: styleMode,
      publishStatus: 'ready',
      publishPlatform: ['小红书'],
      publishedAt: null,
      feedbackNote: ''
    };

    onSaveDiary(diaryObj);
    setActiveDiaryId(diaryObj.id);
    onShowToast('日记草稿已保存');
  };

  const handlePublishNow = () => {
    handleSave();
    onPublishDiary(activeDiaryId === 'new' ? `diary-${Date.now()}` : activeDiaryId);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.7 }
    });
    onShowToast('🎉 已推送至【后阶段发布与复盘】');
    setTimeout(() => {
      onGoToPublish();
    }, 500);
  };

  const handleCopyForRedbook = () => {
    const textToCopy = `${title}\n\n${content}\n\n${tags.map(t => `#${t}`).join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    onShowToast('📋 小红书图文文案已复制到剪贴板！');
  };

  const handleAttachSnippet = (snippetId) => {
    if (!selectedSnippetIds.includes(snippetId)) {
      setSelectedSnippetIds([...selectedSnippetIds, snippetId]);
      const snip = snippets.find(s => s.id === snippetId);
      if (snip && !content.includes(snip.content)) {
        setContent(prev => prev ? `${prev}\n\n${snip.content}` : snip.content);
        if (snip.photo && !photos.includes(snip.photo)) {
          setPhotos([...photos, snip.photo]);
        }
      }
    }
  };

  const handleRemoveSnippetRef = (snippetId) => {
    setSelectedSnippetIds(selectedSnippetIds.filter(id => id !== snippetId));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos([event.target.result, ...photos]);
      };
      reader.readAsDataURL(file);
    }
  };

  const sentenceCount = content.split(/[。！？\n]/).filter(s => s.trim().length > 0).length;

  return (
    <div className="stage-page-layout animate-fade-in">
      {/* Editorial Header Note */}
      <div className="stage-editorial-header">
        <div className="header-meta-lead">
          <span className="step-badge orange-badge">Stage 02</span>
          <span className="step-title-hint">固定时间整理 · 成型工坊</span>
        </div>
        <div className="header-split-row">
          <div>
            <h1 className="editorial-main-title">拉家常成型 · 练小红书手感</h1>
            <p className="editorial-sub-text">
              每天固定时段回看素材池，挑出 1~2 条。用<strong>懂懂日记“拉家常”语气扩展成 3-5 句话</strong>，
              像跟老朋友随口唠嗑，对齐<strong>薏米风格（一张现成实拍图配字）</strong>。
            </p>
          </div>

          {/* Draft Tabs */}
          <div className="draft-capsule-switcher">
            {diaries.map(d => (
              <button
                key={d.id}
                className={`draft-capsule ${activeDiaryId === d.id ? 'active' : ''}`}
                onClick={() => setActiveDiaryId(d.id)}
              >
                <span className="draft-capsule-dot"></span>
                <span>{d.title?.slice(0, 10) || '无标题日记'}...</span>
              </button>
            ))}
            <button 
              className={`draft-capsule new-btn ${activeDiaryId === 'new' ? 'active' : ''}`}
              onClick={() => setActiveDiaryId('new')}
            >
              <Plus size={13} />
              <span>新建日记</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Writer's Studio */}
      <div className="studio-dual-canvas">
        {/* Left Column: Focused Editor */}
        <div className="editor-canvas-card">
          {/* Reference Snippets Bar */}
          <div className="snippets-shelf">
            <div className="shelf-header">
              <span className="shelf-title">
                <Layers size={13} />
                <span>引用素材池碎片 ({referencedSnippets.length})</span>
              </span>
              <span className="shelf-hint">点击可快捷引申</span>
            </div>

            <div className="shelf-chips">
              {referencedSnippets.map(snip => (
                <div key={snip.id} className="shelf-chip">
                  <span className="chip-tag-name">{snip.tag}</span>
                  <span className="chip-excerpt">{snip.content}</span>
                  <button 
                    className="chip-del"
                    onClick={() => handleRemoveSnippetRef(snip.id)}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}

              {availableSnippets.slice(0, 3).map(snip => (
                <button
                  key={snip.id}
                  className="shelf-add-chip"
                  onClick={() => handleAttachSnippet(snip.id)}
                >
                  <Plus size={11} />
                  <span>+{snip.tag}: {snip.content.slice(0, 8)}...</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tone Switcher Tabs */}
          <div className="tone-control-strip">
            <span className="tone-strip-label">
              <Sparkles size={14} className="sparkle-accent" />
              <span>语气体感：</span>
            </span>
            <div className="tone-pill-options">
              <button 
                className={`tone-pill ${styleMode === 'dongdong' ? 'active' : ''}`}
                onClick={() => handleAITransform('dongdong')}
              >
                <Coffee size={13} />
                <span>懂懂拉家常 (推荐)</span>
              </button>
              <button 
                className={`tone-pill ${styleMode === 'yimi' ? 'active' : ''}`}
                onClick={() => handleAITransform('yimi')}
              >
                <Terminal size={13} />
                <span>薏米赛博工头</span>
              </button>
              <button 
                className={`tone-pill ${styleMode === 'xiaohongshu' ? 'active' : ''}`}
                onClick={() => handleAITransform('xiaohongshu')}
              >
                <Flame size={13} />
                <span>小红书痛点</span>
              </button>
              <button 
                className={`tone-pill ${styleMode === 'colloquial' ? 'active' : ''}`}
                onClick={() => handleAITransform('colloquial')}
              >
                <RefreshCw size={13} />
                <span>大白话提纯</span>
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div className="canvas-field">
            <input 
              type="text" 
              className="canvas-title-input"
              placeholder="日记标题（例如：单词总记不住？我换了个方法...）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content Field */}
          <div className="canvas-field">
            <textarea
              className="canvas-body-input"
              rows={9}
              placeholder="在这里拉家常：3~5句话随口说，像跟老朋友随口唠嗑，不要写大文章..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="canvas-sub-status">
              <div className="text-metrics">
                <span className={`metric-tag ${sentenceCount >= 3 && sentenceCount <= 6 ? 'ideal' : ''}`}>
                  {sentenceCount} 句话（建议 3-5 句）
                </span>
                <span className="metric-tag">{content.length} 字</span>
              </div>
              <button 
                className="btn-quick-clip"
                onClick={handleCopyForRedbook}
              >
                <Copy size={12} />
                <span>复制小红书排版</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="canvas-tags-row">
            <span className="tags-label">话题标签：</span>
            <div className="tags-pill-box">
              {tags.map((t, idx) => (
                <span key={idx} className="tag-capsule">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="tag-add-inline"
                placeholder="+ 敲回车添加标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>

          {/* Photo Showcase */}
          <div className="canvas-photos-row">
            <div className="photos-label-wrap">
              <span className="photos-title">实拍展示（练实拍展示手感，一张现成图）：</span>
              <button 
                type="button" 
                className="btn-switch-photo-shelf"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
              >
                <ImageIcon size={13} />
                <span>选用预置实拍照</span>
              </button>
            </div>

            <div className="photo-previews-tray">
              {photos.map((p, idx) => (
                <div key={idx} className="tray-photo-item">
                  <img src={p} alt="实拍展示" />
                  <button 
                    type="button" 
                    className="tray-photo-remove"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}

              <label className="tray-photo-upload">
                <Upload size={14} />
                <span>上传照片</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            {showPhotoPicker && (
              <div className="preset-photo-popover animate-fade-in">
                <div className="popover-title">精选实拍预置（模拟日常学习书桌与工作台）：</div>
                <div className="popover-grid">
                  {PRESET_PHOTOS.map((p, idx) => (
                    <div 
                      key={idx}
                      className="popover-card"
                      onClick={() => {
                        setPhotos([p.url]);
                        setShowPhotoPicker(false);
                      }}
                    >
                      <img src={p.url} alt={p.label} />
                      <span>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="canvas-footer-actions">
            <button className="btn-canvas-save" onClick={handleSave}>
              <Save size={14} />
              <span>保存草稿</span>
            </button>
            <button className="btn-canvas-publish" onClick={handlePublishNow}>
              <Send size={14} />
              <span>推送到发布与复盘 ➔</span>
            </button>
          </div>
        </div>

        {/* Right Column: Ultra-Sleek iPhone 16 Pro Style Preview */}
        <div className="retina-device-wrapper">
          <div className="device-meta-bar">
            <span className="device-label">
              <Smartphone size={14} />
              <span>小红书真机手感仿真</span>
            </span>
            <span className="device-live-dot">LIVE</span>
          </div>

          {/* Modern iPhone Mockup */}
          <div className="modern-iphone-frame">
            {/* Status Bar */}
            <div className="iphone-status-header">
              <span className="iphone-clock">19:42</span>
              <div className="dynamic-island-pill"></div>
              <div className="iphone-signals">5G 100%</div>
            </div>

            {/* Xiaohongshu Navigation */}
            <div className="xhs-screen-nav">
              <span>关注</span>
              <span className="active-tab">发现</span>
              <span>附近</span>
            </div>

            {/* Scrollable Screen Content */}
            <div className="xhs-screen-content">
              {/* Cover Photo */}
              <div className="xhs-post-media">
                {photos.length > 0 ? (
                  <img src={photos[0]} alt="Post visual" className="post-cover-img" />
                ) : (
                  <div className="post-empty-visual">
                    <ImageIcon size={28} />
                    <span>暂无实拍配图</span>
                  </div>
                )}
                <span className="post-counter-tag">1/1</span>
              </div>

              {/* Author Row */}
              <div className="xhs-post-author-bar">
                <div className="author-id-box">
                  <div className="author-avatar-circle">C</div>
                  <div className="author-text">
                    <span className="author-nickname">Curry · 日记实操</span>
                    <span className="author-note">记录低门槛手感</span>
                  </div>
                </div>
                <button className="author-follow-pill">+ 关注</button>
              </div>

              {/* Post Typography */}
              <div className="xhs-article-body">
                <h3 className="post-headline">{title || '（请输入标题）'}</h3>
                <div className="post-paragraphs">
                  {content.split('\n').map((line, i) => (
                    <p key={i}>{line || '\u00A0'}</p>
                  ))}
                </div>
                <div className="post-hashtags-cloud">
                  {tags.map((t, i) => (
                    <span key={i} className="hashtag-link">#{t}</span>
                  ))}
                </div>
                <div className="post-timestamp-row">
                  <span>刚刚 · 发布于 上海</span>
                </div>
              </div>
            </div>

            {/* Bottom Dock */}
            <div className="xhs-screen-dock">
              <div className="dock-comment-input">
                <span>说点什么...</span>
              </div>
              <div className="dock-actions-row">
                <button 
                  className={`dock-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => {
                    setIsLiked(!isLiked);
                    if (!isLiked) confetti({ particleCount: 30, spread: 40 });
                  }}
                >
                  <Heart size={18} fill={isLiked ? '#ff2442' : 'none'} color={isLiked ? '#ff2442' : 'currentColor'} />
                  <span>{isLiked ? 143 : 142}</span>
                </button>
                <button 
                  className={`dock-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark size={18} fill={isBookmarked ? '#e5a93c' : 'none'} color={isBookmarked ? '#e5a93c' : 'currentColor'} />
                  <span>{isBookmarked ? 90 : 89}</span>
                </button>
                <div className="dock-btn">
                  <MessageCircle size={18} />
                  <span>23</span>
                </div>
                <div className="dock-btn">
                  <Share2 size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
