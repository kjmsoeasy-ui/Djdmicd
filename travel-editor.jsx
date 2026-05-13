import { useState, useEffect, useRef } from "react";

const INITIAL_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>여행 계획 슬라이드</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0d0d0d;--white:#f0ece4;--gold:#c9a84c;--gold2:#e8cc7a;--dim:rgba(240,236,228,.55);--glass:rgba(255,255,255,.04);--border:rgba(201,168,76,.25);}
html,body{width:100%;height:100%;overflow:hidden;background:var(--bg)}
body{font-family:'Outfit',sans-serif;color:var(--white);cursor:default;}
#show{position:relative;width:100%;height:100%;}
.slide{position:absolute;inset:0;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:none;overflow:hidden;}
.slide.active{opacity:1;pointer-events:all;}
.slide.exit-left{animation:exitLeft .55s cubic-bezier(.77,0,.18,1) forwards;}
.slide.exit-right{animation:exitRight .55s cubic-bezier(.77,0,.18,1) forwards;}
.slide.enter-left{animation:enterLeft .55s cubic-bezier(.77,0,.18,1) forwards;}
.slide.enter-right{animation:enterRight .55s cubic-bezier(.77,0,.18,1) forwards;}
@keyframes exitLeft{to{transform:translateX(-100%);opacity:.3;}}
@keyframes exitRight{to{transform:translateX(100%);opacity:.3;}}
@keyframes enterLeft{from{transform:translateX(100%);opacity:.3;}to{transform:none;opacity:1;}}
@keyframes enterRight{from{transform:translateX(-100%);opacity:.3;}to{transform:none;opacity:1;}}
.slide-bg{position:absolute;inset:0;background:var(--bg);z-index:0;overflow:hidden;}
.slide-bg img{width:100%;height:100%;object-fit:cover;opacity:.45;transition:transform 8s ease;}
.slide.active .slide-bg img{transform:scale(1.06);}
.slide-bg-gradient{position:absolute;inset:0;background:linear-gradient(135deg,rgba(13,13,13,.85) 0%,rgba(13,13,13,.3) 60%,rgba(13,13,13,.7) 100%);}
.slide-content{position:relative;z-index:2;display:flex;flex-direction:column;height:100%;padding:3.5rem 5rem;}
.slide-cover .slide-content{justify-content:flex-end;}
.slide-cover .tag{font-size:.7rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;opacity:0;animation:none;}
.slide.active .tag{animation:fadeUp .7s .15s forwards;}
.slide-cover h1{font-family:'Cormorant Garamond',serif;font-size:clamp(3.5rem,9vw,8rem);font-weight:300;line-height:1;color:var(--white);opacity:0;}
.slide.active .slide-cover h1{animation:fadeUp .8s .3s forwards;}
.slide-cover h1 em{font-style:italic;color:var(--gold2);}
.slide-cover .subtitle{margin-top:1.4rem;font-size:1rem;color:var(--dim);max-width:50ch;line-height:1.7;opacity:0;}
.slide.active .slide-cover .subtitle{animation:fadeUp .8s .5s forwards;}
.cover-meta{display:flex;gap:3rem;margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--border);opacity:0;}
.slide.active .cover-meta{animation:fadeUp .8s .65s forwards;}
.cover-meta-item .label{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:.3rem;}
.cover-meta-item .val{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;}
.slide-overview .slide-content{justify-content:center;}
.slide-split .slide-content{flex-direction:row;padding:0;}
.split-photo{flex:1;position:relative;overflow:hidden;cursor:pointer;}
.split-photo img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease;}
.split-photo:hover img{transform:scale(1.04);}
.split-photo-overlay{position:absolute;inset:0;background:linear-gradient(to right,transparent 60%,var(--bg));}
.split-text{flex:1;display:flex;flex-direction:column;justify-content:center;padding:4rem 4.5rem;background:var(--bg);}
.slide-grid .slide-content{justify-content:flex-start;}
.grid-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem;flex:1;}
.photo-cell{position:relative;border-radius:2px;overflow:hidden;cursor:pointer;background:rgba(255,255,255,.05);border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;min-height:160px;transition:border-color .2s;}
.photo-cell:hover{border-color:var(--gold);}
.photo-cell img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.photo-cell .upload-hint{display:flex;flex-direction:column;align-items:center;gap:.5rem;color:var(--border);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;pointer-events:none;transition:color .2s;}
.photo-cell:hover .upload-hint{color:var(--gold);}
.upload-hint svg{width:28px;height:28px;opacity:.6;}
.photo-cell input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
.slide-budget .slide-content{justify-content:center;}
.budget-rows{margin-top:2rem;display:flex;flex-direction:column;gap:.4rem;}
.budget-row{display:grid;grid-template-columns:1.5rem 1fr auto;align-items:center;gap:1rem;padding:.9rem 1.2rem;background:var(--glass);border:1px solid var(--border);border-radius:2px;transition:background .2s;}
.budget-row:hover{background:rgba(201,168,76,.07);}
.budget-row .icon{font-size:1rem;}
.budget-row .name{font-size:.85rem;color:var(--dim);}
.budget-row .amt{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--gold2);}
.budget-total{margin-top:1rem;padding:1.2rem 1.5rem;background:rgba(201,168,76,.12);border:1px solid var(--gold);border-radius:2px;display:flex;justify-content:space-between;align-items:center;}
.budget-total .label{font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);}
.budget-total .total{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--gold2);}
.slide-label{font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;opacity:0;}
.slide.active .slide-label{animation:fadeUp .6s .1s forwards;}
.slide-heading{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.5rem);font-weight:300;line-height:1.1;opacity:0;}
.slide.active .slide-heading{animation:fadeUp .7s .2s forwards;}
.slide-body{margin-top:1.5rem;font-size:.9rem;color:var(--dim);line-height:1.8;max-width:55ch;opacity:0;}
.slide.active .slide-body{animation:fadeUp .7s .35s forwards;}
.schedule{margin-top:1.8rem;display:flex;flex-direction:column;gap:.8rem;opacity:0;}
.slide.active .schedule{animation:fadeUp .7s .45s forwards;}
.sched-item{display:flex;gap:1.2rem;align-items:flex-start;padding:.8rem 1rem;background:var(--glass);border-left:2px solid var(--gold);border-radius:0 2px 2px 0;}
.sched-time{font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);min-width:52px;padding-top:.15rem;}
.sched-desc{font-size:.85rem;color:var(--dim);line-height:1.6;}
.tips-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem;opacity:0;}
.slide.active .tips-grid{animation:fadeUp .7s .3s forwards;}
.tip-card{padding:1.5rem;background:var(--glass);border:1px solid var(--border);border-radius:2px;transition:border-color .25s,background .25s;}
.tip-card:hover{border-color:var(--gold);background:rgba(201,168,76,.06);}
.tip-icon{font-size:1.5rem;margin-bottom:.7rem;}
.tip-title{font-size:.8rem;font-weight:500;margin-bottom:.4rem;}
.tip-body{font-size:.75rem;color:var(--dim);line-height:1.7;}
.bg-upload-btn{position:absolute;bottom:1.2rem;left:1.2rem;z-index:10;display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;background:rgba(13,13,13,.8);border:1px solid var(--border);border-radius:2px;font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--dim);cursor:pointer;transition:border-color .2s,color .2s;}
.bg-upload-btn:hover{border-color:var(--gold);color:var(--gold);}
.bg-upload-btn input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
#nav{position:fixed;bottom:2.5rem;left:50%;transform:translateX(-50%);z-index:1000;display:flex;align-items:center;gap:1rem;padding:.7rem 1.4rem;background:rgba(13,13,13,.85);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:40px;}
.nav-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:transparent;color:var(--white);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s;font-size:1rem;}
.nav-btn:hover{background:rgba(201,168,76,.15);border-color:var(--gold);}
.slide-counter{font-size:.75rem;letter-spacing:.15em;color:var(--dim);min-width:50px;text-align:center;}
.dot-row{display:flex;gap:.45rem;align-items:center;}
.dot{width:5px;height:5px;border-radius:50%;background:var(--border);cursor:pointer;transition:background .2s,transform .2s;}
.dot.active{background:var(--gold);transform:scale(1.4);}
#chrome{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;justify-content:space-between;padding:1.2rem 2.5rem;background:linear-gradient(to bottom,rgba(13,13,13,.7),transparent);pointer-events:none;}
.chrome-logo{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--gold);letter-spacing:.08em;}
.chrome-slide-name{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);}
#fs-btn{position:fixed;top:1.2rem;right:2.5rem;z-index:1000;background:transparent;border:none;color:var(--dim);cursor:pointer;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;display:flex;align-items:center;gap:.4rem;transition:color .2s;}
#fs-btn:hover{color:var(--gold);}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}
</style>
</head>
<body>
<div id="chrome">
  <div class="chrome-logo">✈ Travel Plan</div>
  <div class="chrome-slide-name" id="slide-name">표지</div>
</div>
<button id="fs-btn" onclick="toggleFS()">⛶ 전체화면</button>
<div id="show">
  <div class="slide slide-cover active" data-name="표지">
    <div class="slide-bg"><img id="bg0" src="" alt="" style="display:none"/><div class="slide-bg-gradient"></div></div>
    <div style="position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 80% 70% at 30% 60%,#1a0f05,#0d0d0d)"></div>
    <div class="bg-upload-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>배경 사진 업로드<input type="file" accept="image/*" onchange="setBg(this,'bg0')"/></div>
    <div class="slide-content">
      <p class="tag">✈ 해외 여행 계획서</p>
      <h1>나의 <em>특별한</em><br/>여행지</h1>
      <p class="subtitle">여행지 소개 및 여행 컨셉을 여기에 작성하세요.<br/>설레는 여행의 시작입니다.</p>
      <div class="cover-meta">
        <div class="cover-meta-item"><div class="label">여행지</div><div class="val">나라 / 도시</div></div>
        <div class="cover-meta-item"><div class="label">기간</div><div class="val">__ 박 __ 일</div></div>
        <div class="cover-meta-item"><div class="label">출발일</div><div class="val">20__ . __ . __</div></div>
        <div class="cover-meta-item"><div class="label">인원</div><div class="val">__ 명</div></div>
      </div>
    </div>
  </div>
  <div class="slide slide-overview" data-name="여행 개요">
    <div class="slide-bg"><img id="bg1" src="" alt="" style="display:none"/><div class="slide-bg-gradient"></div></div>
    <div style="position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 60% 80% at 80% 20%,#0f1a14,#0d0d0d)"></div>
    <div class="bg-upload-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>배경 사진 업로드<input type="file" accept="image/*" onchange="setBg(this,'bg1')"/></div>
    <div class="slide-content">
      <p class="slide-label">01 — 여행 개요</p>
      <h2 class="slide-heading">Trip Overview</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:2rem;opacity:0" class="anim-cards">
        <div class="budget-row" style="flex-direction:column;align-items:flex-start;gap:.4rem"><span class="icon">🌍</span><span class="sched-time">여행지</span><span class="sched-desc">나라 / 도시를 작성하세요.</span></div>
        <div class="budget-row" style="flex-direction:column;align-items:flex-start;gap:.4rem"><span class="icon">📅</span><span class="sched-time">일정</span><span class="sched-desc">출발일 ~ 귀국일을 작성하세요.</span></div>
        <div class="budget-row" style="flex-direction:column;align-items:flex-start;gap:.4rem"><span class="icon">👥</span><span class="sched-time">인원</span><span class="sched-desc">여행 인원 및 구성을 작성하세요.</span></div>
        <div class="budget-row" style="flex-direction:column;align-items:flex-start;gap:.4rem"><span class="icon">🎯</span><span class="sched-time">테마</span><span class="sched-desc">관광 / 휴양 / 미식 등 테마를 작성하세요.</span></div>
      </div>
      <p class="slide-body" style="max-width:70ch">여행에 대한 전반적인 소개와 기대하는 점, 여행을 계획하게 된 이유 등을 여기에 자유롭게 작성하세요.</p>
    </div>
  </div>
  <div class="slide slide-split" data-name="Day 1">
    <div class="slide-content">
      <div class="split-photo" style="position:relative">
        <div style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.6rem;color:var(--border);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;position:relative">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 업로드
          <input type="file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%" onchange="setSplitPhoto(this)"/>
          <img id="split2img" src="" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none"/>
        </div>
        <div class="split-photo-overlay"></div>
      </div>
      <div class="split-text">
        <p class="slide-label">02 — 일정</p>
        <h2 class="slide-heading">Day 1<br/><em style="font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold2);font-size:1.8rem">도착 & 첫째 날</em></h2>
        <div class="schedule">
          <div class="sched-item"><span class="sched-time">오전</span><span class="sched-desc">오전 일정을 작성하세요.<br/>(예: 공항 도착, 호텔 체크인)</span></div>
          <div class="sched-item"><span class="sched-time">오후</span><span class="sched-desc">오후 일정을 작성하세요.<br/>(예: 관광지 방문, 시내 투어)</span></div>
          <div class="sched-item"><span class="sched-time">저녁</span><span class="sched-desc">저녁 일정을 작성하세요.<br/>(예: 현지 맛집, 야경 감상)</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="slide slide-split" data-name="Day 2">
    <div class="slide-content" style="flex-direction:row-reverse">
      <div class="split-photo" style="position:relative">
        <div style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.6rem;color:var(--border);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;position:relative">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 업로드
          <input type="file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%" onchange="setSplitPhoto(this)"/>
          <img id="split3img" src="" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none"/>
        </div>
        <div style="position:absolute;inset:0;background:linear-gradient(to left,transparent 60%,#0d0d0d)"></div>
      </div>
      <div class="split-text">
        <p class="slide-label">03 — 일정</p>
        <h2 class="slide-heading">Day 2<br/><em style="font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold2);font-size:1.8rem">둘째 날</em></h2>
        <div class="schedule">
          <div class="sched-item"><span class="sched-time">오전</span><span class="sched-desc">오전 일정을 작성하세요.</span></div>
          <div class="sched-item"><span class="sched-time">오후</span><span class="sched-desc">오후 일정을 작성하세요.</span></div>
          <div class="sched-item"><span class="sched-time">저녁</span><span class="sched-desc">저녁 일정을 작성하세요.</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="slide slide-split" data-name="Day 3">
    <div class="slide-content">
      <div class="split-photo" style="position:relative">
        <div style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.6rem;color:var(--border);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;position:relative">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 업로드
          <input type="file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%" onchange="setSplitPhoto(this)"/>
          <img id="split4img" src="" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none"/>
        </div>
        <div class="split-photo-overlay"></div>
      </div>
      <div class="split-text">
        <p class="slide-label">04 — 일정</p>
        <h2 class="slide-heading">Day 3<br/><em style="font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold2);font-size:1.8rem">셋째 날</em></h2>
        <div class="schedule">
          <div class="sched-item"><span class="sched-time">오전</span><span class="sched-desc">오전 일정을 작성하세요.</span></div>
          <div class="sched-item"><span class="sched-time">오후</span><span class="sched-desc">오후 일정을 작성하세요.</span></div>
          <div class="sched-item"><span class="sched-time">저녁</span><span class="sched-desc">저녁 일정을 작성하세요.</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="slide slide-grid" data-name="사진 갤러리">
    <div class="slide-bg"><div style="position:absolute;inset:0;background:#0d0d0d"></div></div>
    <div class="slide-content">
      <p class="slide-label">05 — 갤러리</p>
      <h2 class="slide-heading">Photo Gallery</h2>
      <div class="grid-photos">
        <div class="photo-cell"><div class="upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 추가</div><input type="file" accept="image/*" onchange="addGridPhoto(this)"/></div>
        <div class="photo-cell"><div class="upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 추가</div><input type="file" accept="image/*" onchange="addGridPhoto(this)"/></div>
        <div class="photo-cell"><div class="upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 추가</div><input type="file" accept="image/*" onchange="addGridPhoto(this)"/></div>
        <div class="photo-cell"><div class="upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 추가</div><input type="file" accept="image/*" onchange="addGridPhoto(this)"/></div>
        <div class="photo-cell"><div class="upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 추가</div><input type="file" accept="image/*" onchange="addGridPhoto(this)"/></div>
        <div class="photo-cell"><div class="upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>사진 추가</div><input type="file" accept="image/*" onchange="addGridPhoto(this)"/></div>
      </div>
    </div>
  </div>
  <div class="slide slide-budget" data-name="예산 계획">
    <div class="slide-bg"><img id="bg6" src="" alt="" style="display:none"/><div class="slide-bg-gradient"></div></div>
    <div style="position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 70% 60% at 50% 80%,#0f0a1a,#0d0d0d)"></div>
    <div class="bg-upload-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>배경 사진 업로드<input type="file" accept="image/*" onchange="setBg(this,'bg6')"/></div>
    <div class="slide-content">
      <p class="slide-label">06 — 예산</p>
      <h2 class="slide-heading">Budget Plan</h2>
      <div class="budget-rows" style="opacity:0" id="brows">
        <div class="budget-row"><span class="icon">✈️</span><span class="name">항공권 (왕복)</span><span class="amt">₩ 000,000</span></div>
        <div class="budget-row"><span class="icon">🏨</span><span class="name">숙박 (__ 박)</span><span class="amt">₩ 000,000</span></div>
        <div class="budget-row"><span class="icon">🍽️</span><span class="name">식비</span><span class="amt">₩ 000,000</span></div>
        <div class="budget-row"><span class="icon">🚌</span><span class="name">현지 교통</span><span class="amt">₩ 000,000</span></div>
        <div class="budget-row"><span class="icon">🎡</span><span class="name">관광 / 입장료</span><span class="amt">₩ 000,000</span></div>
        <div class="budget-row"><span class="icon">🛍️</span><span class="name">쇼핑 / 기타</span><span class="amt">₩ 000,000</span></div>
      </div>
      <div class="budget-total" style="opacity:0" id="btotal"><span class="label">총 예산</span><span class="total">₩ 0,000,000</span></div>
    </div>
  </div>
  <div class="slide" data-name="여행 팁">
    <div class="slide-bg"><img id="bg7" src="" alt="" style="display:none"/><div class="slide-bg-gradient"></div></div>
    <div style="position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 60% 70% at 10% 30%,#1a100a,#0d0d0d)"></div>
    <div class="bg-upload-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>배경 사진 업로드<input type="file" accept="image/*" onchange="setBg(this,'bg7')"/></div>
    <div class="slide-content">
      <p class="slide-label">07 — 준비 & 팁</p>
      <h2 class="slide-heading">Travel Tips</h2>
      <div class="tips-grid">
        <div class="tip-card"><div class="tip-icon">🌐</div><p class="tip-title">비자 & 입국</p><p class="tip-body">비자 필요 여부, 입국 조건 등을 작성하세요.</p></div>
        <div class="tip-card"><div class="tip-icon">💱</div><p class="tip-title">화폐 & 환전</p><p class="tip-body">현지 화폐, 환전 방법 등을 작성하세요.</p></div>
        <div class="tip-card"><div class="tip-icon">🌡️</div><p class="tip-title">날씨 & 옷차림</p><p class="tip-body">여행 시즌 날씨와 권장 옷차림을 작성하세요.</p></div>
        <div class="tip-card"><div class="tip-icon">🏥</div><p class="tip-title">건강 & 안전</p><p class="tip-body">여행자 보험, 비상 연락처 등을 작성하세요.</p></div>
        <div class="tip-card"><div class="tip-icon">📱</div><p class="tip-title">통신 & 데이터</p><p class="tip-body">현지 유심, 유용한 앱 등을 작성하세요.</p></div>
        <div class="tip-card"><div class="tip-icon">🗣️</div><p class="tip-title">언어 & 문화</p><p class="tip-body">간단한 현지어, 문화 에티켓을 작성하세요.</p></div>
      </div>
    </div>
  </div>
  <div class="slide slide-cover" data-name="마무리">
    <div class="slide-bg"><img id="bg8" src="" alt="" style="display:none"/><div class="slide-bg-gradient"></div></div>
    <div style="position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 70% 60% at 60% 40%,#0a1214,#0d0d0d)"></div>
    <div class="bg-upload-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>배경 사진 업로드<input type="file" accept="image/*" onchange="setBg(this,'bg8')"/></div>
    <div class="slide-content">
      <p class="tag">✈ Thank you</p>
      <h1><em>좋은 여행</em><br/>되길!</h1>
      <p class="subtitle">발표를 들어주셔서 감사합니다.<br/>작성자: __________&nbsp;&nbsp;|&nbsp;&nbsp;제출일: 20__ . __ . __</p>
    </div>
  </div>
</div>
<div id="nav">
  <button class="nav-btn" onclick="go(-1)">&#8592;</button>
  <div class="dot-row" id="dots"></div>
  <span class="slide-counter" id="counter">1 / 9</span>
  <button class="nav-btn" onclick="go(1)">&#8594;</button>
</div>
<script>
const slides=document.querySelectorAll('.slide');
const dotsEl=document.getElementById('dots');
const counterEl=document.getElementById('counter');
const slideNameEl=document.getElementById('slide-name');
let cur=0;
const total=slides.length;
slides.forEach((_,i)=>{const d=document.createElement('div');d.className='dot'+(i===0?' active':'');d.onclick=()=>go(i-cur);dotsEl.appendChild(d);});
function updateUI(){counterEl.textContent=(cur+1)+' / '+total;slideNameEl.textContent=slides[cur].dataset.name||'';document.querySelectorAll('.dot').forEach((d,i)=>{d.classList.toggle('active',i===cur);});if(slides[cur].classList.contains('slide-budget')){const br=document.getElementById('brows');const bt=document.getElementById('btotal');if(br){br.style.animation='fadeUp .7s .3s forwards';br.style.opacity=0;}if(bt){bt.style.animation='fadeUp .7s .55s forwards';bt.style.opacity=0;}}const cards=slides[cur].querySelector('.anim-cards');if(cards){cards.style.animation='fadeUp .7s .4s forwards';cards.style.opacity=0;}}
function go(dir){if(dir===0)return;const next=Math.max(0,Math.min(total-1,cur+dir));if(next===cur)return;const exitCls=dir>0?'exit-left':'exit-right';const enterCls=dir>0?'enter-left':'enter-right';slides[cur].classList.add(exitCls);slides[next].classList.add(enterCls,'active');slides[cur].addEventListener('animationend',()=>{slides[cur].classList.remove('active',exitCls);cur=next;slides[cur].classList.remove(enterCls);updateUI();},{once:true});}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' ')go(1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(-1);});
let tx=0;document.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)go(dx<0?1:-1);});
function setBg(input,imgId){const file=input.files[0];if(!file)return;const img=document.getElementById(imgId);img.src=URL.createObjectURL(file);img.style.display='block';}
function setSplitPhoto(input){const file=input.files[0];if(!file)return;const cell=input.parentElement;let img=cell.querySelector('img[id^="split"]');if(img){img.src=URL.createObjectURL(file);img.style.display='block';}cell.querySelector('.upload-hint')&&(cell.querySelector('.upload-hint').style.display='none');input.style.pointerEvents='none';}
function addGridPhoto(input){const file=input.files[0];if(!file)return;const cell=input.closest('.photo-cell');let img=cell.querySelector('img');if(!img){img=document.createElement('img');cell.appendChild(img);}img.src=URL.createObjectURL(file);img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';cell.querySelector('.upload-hint')&&(cell.querySelector('.upload-hint').style.display='none');}
function toggleFS(){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen();}
updateUI();
</script>
</body>
</html>`;

export default function TravelEditor() {
  const [html, setHtml] = useState(INITIAL_HTML);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(INITIAL_HTML);
  const iframeRef = useRef(null);

  const applyHtml = (code) => {
    setHtml(code);
    setEditMode(false);
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "index.html";
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#111", fontFamily: "sans-serif" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "8px 16px", background: "#1a1a1a",
        borderBottom: "1px solid #333", flexShrink: 0
      }}>
        <span style={{ color: "#c9a84c", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}>✈ 여행 슬라이드 편집기</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { setDraft(html); setEditMode(!editMode); }}
          style={{
            padding: "5px 14px", borderRadius: "4px", border: "1px solid #444",
            background: editMode ? "#c9a84c" : "#2a2a2a", color: editMode ? "#000" : "#ccc",
            cursor: "pointer", fontSize: "12px", fontWeight: 600
          }}>
          {editMode ? "← 미리보기로" : "✏️ 코드 편집"}
        </button>
        {editMode && (
          <button
            onClick={() => applyHtml(draft)}
            style={{
              padding: "5px 14px", borderRadius: "4px", border: "none",
              background: "#4caf7d", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: 600
            }}>
            ✓ 적용
          </button>
        )}
        <button
          onClick={downloadHtml}
          style={{
            padding: "5px 14px", borderRadius: "4px", border: "1px solid #444",
            background: "#2a2a2a", color: "#ccc", cursor: "pointer", fontSize: "12px"
          }}>
          ⬇ index.html 다운로드
        </button>
      </div>

      {/* Main area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {editMode ? (
          /* Code editor */
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={{
                flex: 1, background: "#0d1117", color: "#c9d1d9",
                border: "none", outline: "none", padding: "20px",
                fontFamily: "'Courier New', monospace", fontSize: "12px",
                lineHeight: 1.6, resize: "none", overflow: "auto"
              }}
              spellCheck={false}
            />
            {/* live preview panel */}
            <div style={{ flex: 1, borderLeft: "1px solid #333" }}>
              <div style={{ padding: "6px 12px", background: "#161b22", fontSize: "11px", color: "#666", borderBottom: "1px solid #333" }}>
                실시간 미리보기 (적용 버튼 누르면 확정)
              </div>
              <iframe
                srcDoc={draft}
                style={{ width: "100%", height: "calc(100% - 28px)", border: "none" }}
                title="preview"
              />
            </div>
          </div>
        ) : (
          /* Full preview */
          <iframe
            ref={iframeRef}
            srcDoc={html}
            style={{ flex: 1, border: "none" }}
            title="slide-preview"
          />
        )}
      </div>

      {/* Bottom hint */}
      {!editMode && (
        <div style={{
          padding: "6px 16px", background: "#1a1a1a", borderTop: "1px solid #2a2a2a",
          fontSize: "11px", color: "#555", display: "flex", gap: "20px"
        }}>
          <span>← → 키 또는 하단 버튼으로 슬라이드 이동</span>
          <span>수정하려면 위 <b style={{color:"#c9a84c"}}>✏️ 코드 편집</b> 버튼 클릭</span>
          <span>완성 후 <b style={{color:"#4caf7d"}}>⬇ 다운로드</b>해서 GitHub에 올리기</span>
        </div>
      )}
    </div>
  );
}
