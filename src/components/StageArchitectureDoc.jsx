import React, { useState } from 'react';
import { 
  BookOpen, 
  GitBranch, 
  History, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Send, 
  Flame, 
  Save, 
  ExternalLink 
} from 'lucide-react';

export default function StageArchitectureDoc({ 
  changelog, 
  onAddChangelog, 
  onShowToast 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newChangeInput, setNewChangeInput] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newVersion.trim() || !newSummary.trim()) return;

    const changes = newChangeInput.split('\n').filter(line => line.trim().length > 0);
    onAddChangelog({
      version: newVersion.trim(),
      date: new Date().toISOString().slice(0, 10),
      summary: newSummary.trim(),
      changes: changes.length > 0 ? changes : ['沉淀了新的流程迭代经验']
    });

    setShowAddModal(false);
    setNewVersion('');
    setNewSummary('');
    setNewChangeInput('');
    onShowToast(`🎉 已成功记录版本 ${newVersion} 迭代心得！`);
  };

  return (
    <section className="stage-section doc-section animate-fade-in">
      {/* Concept Header */}
      <div className="stage-concept-card doc-banner">
        <div className="concept-info">
          <div className="concept-pill purple">
            <span className="dot pulse"></span> 方法论与系统演进
          </div>
          <h2 className="concept-title">初衷与架构设计 · 版本沉淀中心</h2>
          <p className="concept-desc">
            “搭建系统的目的不是让‘写日记’变复杂，而是让<strong>方法论、决策、迭代经验</strong>能够沉淀、不丢失。
            未来无论何时AI Agent或创作者再次介入，能直接读取当前状态往下走，不需要重复口述背景。”
          </p>
        </div>

        <div className="doc-top-actions">
          <button 
            className="btn-add-changelog"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>沉淀新的迭代心得</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Architecture Cards */}
      <div className="architecture-stages-grid">
        <div className="arch-card stage-1-border">
          <div className="arch-card-header">
            <span className="stage-step-tag">01 · 前阶段</span>
            <Layers size={18} className="arch-icon-1" />
          </div>
          <h4>随时记录 · 素材池</h4>
          <p className="arch-body">
            做雅思、AI搭建等正事时产生真实感悟、卡点、小发现。<strong>当场记下一句话</strong>，绝不打断正事。
          </p>
          <div className="arch-output">
            <span className="output-label">产出物：</span>
            <span>按板块分类的原始碎片素材池</span>
          </div>
        </div>

        <div className="arch-card stage-2-border">
          <div className="arch-card-header">
            <span className="stage-step-tag">02 · 中阶段</span>
            <Zap size={18} className="arch-icon-2" />
          </div>
          <h4>固定时间 · 拉家常成型</h4>
          <p className="arch-body">
            每天下午固定回看，挑出1~2条条目。用<strong>懂懂日记式3~5句老朋友随口唠嗑</strong>，对齐<strong>薏米现成实拍图</strong>极速成型。
          </p>
          <div className="arch-output">
            <span className="output-label">产出物：</span>
            <span>一篇可直接发布的图文日记</span>
          </div>
        </div>

        <div className="arch-card stage-3-border">
          <div className="arch-card-header">
            <span className="stage-step-tag">03 · 后阶段</span>
            <Send size={18} className="arch-icon-3" />
          </div>
          <h4>极简发布 · 留白与测反应</h4>
          <p className="arch-body">
            不提前过度设计。发得快、发得多，<strong>测试读者对什么话题真正有反应</strong>，为后续深度干货型提供真实选题支撑。
          </p>
          <div className="arch-output">
            <span className="output-label">产出物：</span>
            <span>真实市场反馈与干货选题储备</span>
          </div>
        </div>
      </div>

      {/* Dual Track Comparison Panel */}
      <div className="dual-track-deep-panel glass-panel">
        <div className="panel-title-row">
          <GitBranch size={18} />
          <h3>日记型 vs 16步干货型 · 战略分工与并行图景</h3>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>对比维度</th>
                <th style={{ width: '40%' }} className="highlight-col">🚀 日记型（前锋插队跑）</th>
                <th style={{ width: '40%' }}>⚙️ 干货型（后台16步）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-label">核心角色</td>
                <td><strong>侦察兵与手感训练场</strong>（发得快、发得多）</td>
                <td><strong>正规军主力输出</strong>（高壁垒、深度干货）</td>
              </tr>
              <tr>
                <td className="row-label">前置要求</td>
                <td>零门槛，每天随时的一两句卡点与实拍</td>
                <td>天然要求“反复做过、验证过才敢出”</td>
              </tr>
              <tr>
                <td className="row-label">语言语调</td>
                <td>懂懂日记式拉家常、3~5句老朋友随口说</td>
                <td>严谨的 BAB 结构、六轮修改、教程化</td>
              </tr>
              <tr>
                <td className="row-label">配图方式</td>
                <td>一张现成书桌/电脑实拍图，练展示手感</td>
                <td>严格的参考图匹配、示意图与全套清单</td>
              </tr>
              <tr>
                <td className="row-label">市场调研价值</td>
                <td>直接用评论区验证读者对什么话题真有反应</td>
                <td>依托日记型跑出的真实反馈精准选题</td>
              </tr>
              <tr>
                <td className="row-label">参照标杆</td>
                <td>卡兹克起号期、懂懂日记、薏米（赛博工头）</td>
                <td>深度行业拆解、实操复盘与系统教程</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Version Changelog & Evolution Records */}
      <div className="changelog-container glass-panel">
        <div className="changelog-header-row">
          <div className="title-box">
            <History size={18} />
            <h3>系统版本演进与决策沉淀（Changelog）</h3>
          </div>
          <span className="sub-hint">已沉淀 {changelog.length} 次系统迭代</span>
        </div>

        <div className="changelog-timeline">
          {changelog.map((log, index) => (
            <div key={index} className="timeline-node">
              <div className="node-marker">
                <span className="node-dot"></span>
                {index < changelog.length - 1 && <span className="node-line"></span>}
              </div>

              <div className="node-content">
                <div className="node-header">
                  <span className="version-tag">{log.version}</span>
                  <span className="node-date">{log.date}</span>
                  <h4 className="node-summary">{log.summary}</h4>
                </div>

                <ul className="node-changes-list">
                  {log.changes.map((c, i) => (
                    <li key={i}>
                      <CheckCircle2 size={13} className="check-icon" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding New Changelog */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div 
            className="modal-container animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">沉淀新的系统迭代经验</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="field-group">
                <label className="field-label">版本代号（如 v1.2）：</label>
                <input 
                  type="text" 
                  className="quick-inline-input"
                  placeholder="v1.2"
                  value={newVersion}
                  onChange={e => setNewVersion(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">本次迭代核心结论（Summary）：</label>
                <input 
                  type="text" 
                  className="quick-inline-input"
                  placeholder="例如：发现每天下午3点整理最顺手 / 增加了某某板块..."
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">具体改动与决策心得（每行一条）：</label>
                <textarea 
                  className="quick-textarea"
                  rows={4}
                  placeholder="每行输入一条心得或调整项..."
                  value={newChangeInput}
                  onChange={e => setNewChangeInput(e.target.value)}
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={16} />
                  <span>沉淀入系统记忆</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
