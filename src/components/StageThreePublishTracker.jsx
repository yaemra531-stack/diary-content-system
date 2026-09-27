import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
  Copy, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Globe, 
  TrendingUp, 
  Lightbulb, 
  Plus,
  Save,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StageThreePublishTracker({ 
  diaries, 
  onUpdateDiary, 
  onShowToast, 
  onGoToStudio 
}) {
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState('');

  const publishedList = diaries.filter(d => d.publishStatus === 'published');
  const readyList = diaries.filter(d => d.publishStatus === 'ready');

  const handleCopyText = (diary) => {
    const text = `${diary.title}\n\n${diary.content}\n\n${diary.tags?.map(t => `#${t}`).join(' ') || ''}`;
    navigator.clipboard.writeText(text);
    onShowToast('📋 文案已复制！可直接粘贴至小红书或社交平台');
  };

  const handleTogglePublish = (diary) => {
    const newStatus = diary.publishStatus === 'published' ? 'ready' : 'published';
    onUpdateDiary(diary.id, {
      publishStatus: newStatus,
      publishedAt: newStatus === 'published' ? new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : null
    });

    if (newStatus === 'published') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      onShowToast(`🎉 《${diary.title}》已标记为已发布！`);
    }
  };

  const handleSaveFeedback = (diaryId) => {
    onUpdateDiary(diaryId, {
      feedbackNote: feedbackInput
    });
    setEditingFeedbackId(null);
    setFeedbackInput('');
    onShowToast('💡 读者反馈复盘已记录，已沉淀为选题参考！');
  };

  return (
    <section className="stage-section animate-fade-in">
      {/* Concept Banner */}
      <div className="stage-concept-card publish-banner">
        <div className="concept-info">
          <div className="concept-pill green">
            <span className="dot pulse"></span> 后阶段设计哲学 · 留白
          </div>
          <h2 className="concept-title">极简发布与读者反馈复盘</h2>
          <p className="concept-desc">
            <strong>保持留白，不提前过度设计</strong>。优先把前两个阶段做扎实。
            日记型发得快、发得多，等于用极低成本反复测试<strong>“读者对什么话题真正有反应”</strong>。
            用真实的读者反馈支撑后续后台的16步干货型选题，不再凭空猜测！
          </p>
        </div>

        <div className="concept-stats">
          <div className="stat-box green">
            <span className="stat-num">{publishedList.length}</span>
            <span className="stat-label">已正式发布</span>
          </div>
          <div className="stat-box highlight">
            <span className="stat-num">{readyList.length}</span>
            <span className="stat-label">待发日记</span>
          </div>
        </div>
      </div>

      {/* Main Content Columns */}
      <div className="publish-grid-layout">
        {/* Left Column: Publication List */}
        <div className="publish-list-column">
          <div className="section-sub-header">
            <h3>日记发布记录表</h3>
            <span className="count-tag">{diaries.length} 篇日记</span>
          </div>

          <div className="publish-cards-list">
            {diaries.map(diary => {
              const isPublished = diary.publishStatus === 'published';
              const isEditingThis = editingFeedbackId === diary.id;

              return (
                <div key={diary.id} className={`publish-diary-card glass-panel ${isPublished ? 'published-border' : ''}`}>
                  <div className="publish-card-top">
                    <div className="publish-title-wrap">
                      <span className={`status-pill ${isPublished ? 'published' : 'ready'}`}>
                        {isPublished ? '已发布' : '就绪待发'}
                      </span>
                      <h4 className="publish-diary-title">{diary.title}</h4>
                    </div>

                    <div className="publish-actions-right">
                      <button 
                        className="btn-quick-copy"
                        onClick={() => handleCopyText(diary)}
                        title="一键复制排版文案"
                      >
                        <Copy size={14} />
                        <span>复制</span>
                      </button>

                      <button 
                        className={`btn-toggle-publish ${isPublished ? 'is-pub' : ''}`}
                        onClick={() => handleTogglePublish(diary)}
                      >
                        <Check size={14} />
                        <span>{isPublished ? '取消发布' : '标记已发'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Diary Snippet & Cover */}
                  <div className="publish-card-content-preview">
                    {diary.photos?.[0] && (
                      <img src={diary.photos[0]} alt="封面" className="publish-thumb" />
                    )}
                    <p className="publish-preview-text">
                      {diary.content.slice(0, 140)}...
                    </p>
                  </div>

                  {/* Tags & Meta */}
                  <div className="publish-meta-row">
                    <div className="publish-tags">
                      {diary.tags?.map((t, i) => (
                        <span key={i} className="meta-tag">#{t}</span>
                      ))}
                    </div>
                    <div className="publish-platform-info">
                      <Globe size={13} />
                      <span>发布平台：小红书</span>
                      {diary.publishedAt && (
                        <span className="pub-time">({diary.publishedAt})</span>
                      )}
                    </div>
                  </div>

                  {/* Lightweight Feedback & Market Research Box */}
                  <div className="feedback-sub-box">
                    <div className="feedback-box-header">
                      <div className="box-header-title">
                        <Lightbulb size={14} className="bulb-icon" />
                        <span>市场调研 · 读者真实反馈记事</span>
                      </div>
                      {!isEditingThis && (
                        <button 
                          className="btn-edit-feedback"
                          onClick={() => {
                            setEditingFeedbackId(diary.id);
                            setFeedbackInput(diary.feedbackNote || '');
                          }}
                        >
                          {diary.feedbackNote ? '编辑反馈' : '+ 记一笔读者反应'}
                        </button>
                      )}
                    </div>

                    {isEditingThis ? (
                      <div className="feedback-edit-wrap animate-fade-in">
                        <textarea
                          className="feedback-textarea"
                          rows={3}
                          placeholder="例如：5个人私信问提示词 / 点赞比平时高一倍 / 读者吐槽某App记不住... 用真实反馈支撑干货选题"
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                        />
                        <div className="feedback-edit-actions">
                          <button 
                            className="btn-small-cancel"
                            onClick={() => setEditingFeedbackId(null)}
                          >
                            取消
                          </button>
                          <button 
                            className="btn-small-save"
                            onClick={() => handleSaveFeedback(diary.id)}
                          >
                            <Save size={13} />
                            <span>保存反馈</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="feedback-display">
                        {diary.feedbackNote ? (
                          <div className="feedback-quote">
                            <span className="quote-mark">“</span>
                            <p>{diary.feedbackNote}</p>
                          </div>
                        ) : (
                          <p className="feedback-placeholder">
                            暂无读者反馈记录。发完后留意评论区卡点，用真实反馈测选题。
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Strategic Research Insight Panel */}
        <div className="publish-sidebar-column">
          <div className="research-insight-card glass-panel">
            <div className="card-badge-header">
              <TrendingUp size={16} />
              <span>日记反哺干货机制</span>
            </div>
            <h4>为什么日记能当作“低成本市场调研”？</h4>
            <div className="insight-bullets">
              <div className="bullet-item">
                <span className="bullet-num">1</span>
                <div>
                  <strong>高频探路，零心理负担</strong>
                  <p>日记发得快，每天发1篇，用 1 周时间就能测试 7 个不同切入点。</p>
                </div>
              </div>
              <div className="bullet-item">
                <span className="bullet-num">2</span>
                <div>
                  <strong>从评论区抓痛点</strong>
                  <p>读者问得最多、共鸣最强的问题，直接作为后台 16 步干货工作台的正式立项选题！</p>
                </div>
              </div>
              <div className="bullet-item">
                <span className="bullet-num">3</span>
                <div>
                  <strong>手感熟练后再打硬仗</strong>
                  <p>等小红书网感、遣词造句、实拍图节奏都练顺了，干货型内容一出击就是爆款。</p>
                </div>
              </div>
            </div>

            <div className="cta-box">
              <p>想去加工新的日记？</p>
              <button className="btn-cta-studio" onClick={onGoToStudio}>
                <span>前往成型工坊 ➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
