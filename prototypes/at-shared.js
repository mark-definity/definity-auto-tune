// AT-SHARED — single source of truth for the Auto-Tune right-rail UI
// Used by: 06 (Task), 08 (Compute), 10 (Pipeline). Change here => changes everywhere.
(function(){
  var S = {};

  // ---- shared activity log (entity word is the only nuance) ----
  S.log = function(entity){
    return [
      {t:"TUNED",when:"2h ago",msg:"-91% vCore waste, runtime unchanged (executors 100 to 64)", res:"within SLA"},
      {t:"VERIFIED",when:"1d ago",msg:"Savings held across 5 runs, no performance impact", res:"retained"},
      {t:"LEARNED",when:"3d ago",msg:"Learned this "+entity+" baseline before adjusting (20 runs)", res:"baseline saved"},
      {t:"TUNED",when:"5d ago",msg:"-12% cost this run, runtime unchanged", res:"within SLA"}
    ];
  };

  // ---- Auto-Tuning chip (canonical MUI markup, square radius — LOCKED) ----
  S.chip = function(opts){
    opts = opts || {};
    var chip = document.createElement('div');
    chip.className = 'MuiChip-root MuiChip-outlined MuiChip-sizeSmall MuiChip-colorDefault';
    chip.setAttribute('data-at-chip','1');
    chip.style.cssText = 'height:'+(opts.height||'18px')+';font-size:'+(opts.fontSize||'11px')+';display:inline-flex;align-items:center;vertical-align:middle;background-color:var(--mui-palette-primary-lightest);color:var(--mui-palette-primary-dark);border:1px solid transparent;border-radius:var(--mui-shape-borderRadius);padding:0 8px;box-sizing:border-box;white-space:nowrap;';
    var l = document.createElement('span');
    l.className = 'MuiChip-label';
    l.style.cssText = 'padding:0;line-height:1;';
    l.textContent = opts.label || 'Auto-Tuning';
    chip.appendChild(l);
    return chip;
  };

  // ---- "<Entity> details" panel (title + label/value grid + status-row slot) ----
  S.detailsHTML = function(cfg){
    var rows = (cfg.rows||[]).map(function(r){
      return '<div style="display:contents"><div class="text-text-secondary" style="min-width:0;overflow-wrap:break-word;line-height:1rem;">'+r[0]+'</div><div style="min-width:0;line-height:1rem;">'+r[1]+'</div></div>';
    }).join('');
    return '<div class="min-h-full h-1"><div style="display:flex;flex-direction:column;gap:24px;">'
      +'<header><h1 class="text-base">'+cfg.title+'</h1></header>'
      +'<section><div style="display:grid;grid-template-columns:1fr 2fr;column-gap:16px;row-gap:12px;">'
      + rows
      +'<div id="at-details-status" style="display:contents"></div>'
      +'</div></section>'
      +'</div></div>';
  };

  // ---- Auto-Tune On/Off row: grey label + separate MUI-token toggle ----
  // container becomes [label | toggle] — works as grid row (display:contents) or flex row.
  S.wireToggleRow = function(container, cfg){
    if(!container) return;
    container.innerHTML = '';
    var label1 = document.createElement('div');
    label1.className = 'text-text-secondary leading-4';
    label1.style.cssText = 'min-width:0;line-height:1rem;white-space:nowrap;';
    var val = document.createElement('div');
    val.style.cssText = 'min-width:0;line-height:1rem;display:flex;align-items:center;';
    var lbl = document.createElement('label');
    lbl.style.cssText = 'display:inline-flex;align-items:center;cursor:pointer;user-select:none;';
    var inp = document.createElement('input');
    inp.type = 'checkbox';
    inp.checked = window[cfg.stateKey] !== false;
    inp.style.cssText = 'position:absolute;opacity:0;pointer-events:none;';
    var track = document.createElement('span');
    track.style.cssText = 'position:relative;display:inline-block;width:34px;height:14px;border-radius:var(--mui-shape-borderRadius);background:var(--mui-palette-primary-main);transition:background 150ms;';
    var thumb = document.createElement('span');
    thumb.style.cssText = 'position:absolute;top:-3px;left:16px;width:20px;height:20px;border-radius:50%;background:var(--mui-palette-background-paper);box-shadow:var(--mui-shadows-2);transition:left 150ms;';
    track.appendChild(thumb);
    function sync(){
      label1.textContent = 'Auto-Tune ' + (inp.checked ? 'On' : 'Off');
      track.style.background = inp.checked ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-action-disabled, rgba(0,0,0,0.38))';
      thumb.style.left = inp.checked ? '16px' : '-2px';
      window[cfg.stateKey] = inp.checked;
      if(cfg.onChange) cfg.onChange(inp.checked);
    }
    lbl.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); inp.checked = !inp.checked; sync(); });
    lbl.appendChild(inp); lbl.appendChild(track);
    val.appendChild(lbl);
    container.appendChild(label1); container.appendChild(val);
    sync();
  };

  // ---- Auto-Tune wand panel (stats + activity log) ----
  S.autotuneHTML = function(cfg){
    var on = window[cfg.stateKey] !== false;
    var log = cfg.log || S.log(cfg.entity);
    var list = log.map(function(e){
      return '<div style="display:flex;gap:10px;padding:12px 0;border-bottom:1px solid var(--mui-palette-divider);">'
        +'<div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:var(--mui-palette-primary-lightest);color:var(--mui-palette-primary-dark);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">AT</div>'
        +'<div style="min-width:0;flex:1;"><div style="display:flex;justify-content:space-between;gap:8px;"><span style="font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--mui-palette-primary-dark);">'+e.t+'</span><span style="font-size:11px;color:var(--mui-palette-text-secondary);">'+e.when+'</span></div>'
        +'<div style="font-size:13px;color:var(--mui-palette-text-primary);margin-top:3px;line-height:1.4;">'+e.msg+'</div>'
        +'<span style="display:inline-block;margin-top:5px;font-size:11px;color:var(--mui-palette-text-secondary);background:transparent;border:1px solid var(--mui-palette-divider);padding:2px 8px;border-radius:var(--mui-shape-borderRadius);">'+e.res+'</span></div></div>';
    }).join('');
    return '<div><header><h1 class="text-base">Auto-Tune</h1><div class="typo-subtitle">Per-run impact for this '+cfg.entity+'</div>'
      +'<div class="text-text-secondary leading-4" style="margin-top:6px;">Auto-Tune '+(on?'On':'Off')+'</div></header>'
      +'<div style="'+(on?'':'opacity:0.5;')+'">'
      +'<div style="display:flex;justify-content:space-between;gap:10px;padding:12px 0;border-bottom:1px solid var(--mui-palette-divider);margin-bottom:6px;">'
      +'<div><div style="font-size:18px;font-weight:700;color:var(--mui-palette-primary-dark);">'+cfg.saved+'</div><div style="font-size:11px;color:var(--mui-palette-text-secondary);">Saved</div></div>'
      +'<div style="text-align:left;"><div style="font-size:18px;font-weight:700;color:var(--mui-palette-primary-dark);">'+cfg.annualized+'</div><div style="font-size:11px;color:var(--mui-palette-text-secondary);">Annualized</div></div>'
      +'<div style="text-align:right;"><div style="font-size:18px;font-weight:700;color:var(--mui-palette-text-primary);">'+log.length+'</div><div style="font-size:11px;color:var(--mui-palette-text-secondary);">actions</div></div>'
      +'</div>'+list+'</div></div>';
  };

  // ---- rendering fixes for reference-HTML panels (icons, grids, list bullets) ----
  S.fixPanel = function(tc){
    [...tc.querySelectorAll('[data-test-id="insight-icon"]')].forEach(function(el){
      el.style.setProperty('align-self','start','important');
      ['height','width','min-width','min-height','max-width','max-height'].forEach(function(p){ el.style.setProperty(p,'20px','important'); });
      el.style.setProperty('flex','0 0 20px','important');
    });
    [...tc.querySelectorAll('svg.css-vcr5rz')].forEach(function(s){
      s.style.setProperty('width','16px','important');
      s.style.setProperty('height','16px','important');
    });
    [...tc.querySelectorAll('[class*="grid-cols-"]')].forEach(function(el){
      if(el.closest('.MuiDataGrid-root')) return;
      el.style.display='grid'; el.style.gridTemplateColumns='auto 1fr'; el.style.gap='16px';
    });
    [...tc.querySelectorAll('ul')].forEach(function(el){ el.style.listStyle='none'; el.style.padding='0'; el.style.margin='0'; });
    var lis=[...tc.querySelectorAll('li')];
    lis.forEach(function(el,i){
      el.style.listStyle='none';
      el.style.paddingBottom='12px';
      el.style.marginBottom='12px';
      if(i < lis.length-1) el.style.borderBottom='1px solid var(--mui-palette-divider)';
    });
  };

  // ---- exclusive selection painter for rails whose CSS lacks .Mui-selected bg ----
  S.selectRail = function(grp, btn, paintBg){
    [...grp.querySelectorAll('button')].forEach(function(x){
      x.classList.remove('Mui-selected'); x.setAttribute('aria-pressed','false');
      if(paintBg) x.style.background='';
    });
    if(btn){
      btn.classList.add('Mui-selected'); btn.setAttribute('aria-pressed','true');
      if(paintBg) btn.style.background='oklch(0.97 0.045 255)';
    }
  };

  // ---- uniform right-sidebar width on every page that loads this file ----
  S.lockAside = function(){
    var grp = document.querySelector('[data-test-id="toolbox-buttons"]');
    if(!grp) return false;
    var aside = grp.closest('aside');
    if(!aside) return false;
    aside.style.width='350px'; aside.style.minWidth='350px'; aside.style.maxWidth='350px'; aside.style.flexShrink='0';
    return true;
  };
  (function(){
    var tries = 0;
    function attempt(){ if(S.lockAside()) return; if(tries++ < 30) setTimeout(attempt, 200); }
    if(document.readyState !== 'loading') attempt();
    else document.addEventListener('DOMContentLoaded', attempt);
  })();

  window.ATShared = S;
})();
