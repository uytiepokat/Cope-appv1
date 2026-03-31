import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* ─── GLOBAL STYLES ─── */
const injectStyles = () => {
  const s = document.createElement("style");
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&family=Poppins:wght@600&display=swap');
    @keyframes ob-fade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes ob-logo{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
    @keyframes ob-pulse{0%,100%{opacity:.35;transform:scale(.75)}50%{opacity:1;transform:scale(1)}}

    /* ── New splash animations ── */
    @keyframes sp-orb{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.18)}}
    @keyframes sp-orb2{0%,100%{transform:translate(-50%,-50%) scale(1.08) rotate(0deg)}50%{transform:translate(-50%,-50%) scale(.92) rotate(180deg)}}
    @keyframes sp-logo{0%{opacity:0;transform:scale(.6) translateY(20px)}70%{transform:scale(1.04) translateY(-3px)}100%{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes sp-word{0%{opacity:0;transform:translateY(10px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes sp-tap{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}
    @keyframes sp-particle{0%{opacity:0;transform:scale(0) rotate(0deg)}30%{opacity:.7}100%{opacity:0;transform:scale(1) rotate(360deg) translate(var(--px),var(--py))}}
    @keyframes sp-ring{0%{transform:translate(-50%,-50%) scale(.75);opacity:.7}100%{transform:translate(-50%,-50%) scale(1.6);opacity:0}}
    @media(prefers-reduced-motion:reduce){
      .sp-orb,.sp-logo,.sp-word,.sp-particle{animation:none!important;opacity:1!important;}
    }
    @keyframes ob-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes ob-pop{from{opacity:0;transform:scale(.6) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes ob-slide-in{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Jost',sans-serif;background:var(--bone,#FAF9F6);-webkit-font-smoothing:antialiased;}
    .serif{letter-spacing:-.01em;}
    ::-webkit-scrollbar{width:0;}

    .root{max-width:390px;min-height:100svh;margin:0 auto;background:var(--bone,#FAF9F6);position:relative;overflow:hidden;}
    .screen.active{background:transparent!important;}

    /* SCREENS */
    .screen{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;padding-bottom:90px;
      transition:transform .42s cubic-bezier(.77,0,.18,1),opacity .35s ease;will-change:transform;}
    .screen.active{transform:translateX(0);opacity:1;pointer-events:all;}
    .screen.enter-right{transform:translateX(100%);opacity:0;pointer-events:none;}
    .screen.exit-left{transform:translateX(-60%);opacity:0;pointer-events:none;}
    .screen.enter-left{transform:translateX(-100%);opacity:0;pointer-events:none;}
    .screen.exit-right{transform:translateX(60%);opacity:0;pointer-events:none;}

    /* GHOST SLIDER */
    .g-slider{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:3px;outline:none;cursor:pointer;
      background:linear-gradient(to right,#E06B6B 0%,#F28C8C var(--v,50%),rgba(242,140,140,.12) var(--v,50%),rgba(242,140,140,.12) 100%);}
    .g-slider::-webkit-slider-thumb{-webkit-appearance:none;width:30px;height:30px;border-radius:50%;
      background:#fff;border:2.5px solid #F28C8C;
      box-shadow:0 3px 14px rgba(242,140,140,.28),0 0 0 7px rgba(242,140,140,.07);
      cursor:grab;transition:box-shadow .2s,transform .15s;}
    .g-slider::-webkit-slider-thumb:hover{box-shadow:0 5px 20px rgba(242,140,140,.38),0 0 0 12px rgba(242,140,140,.1);transform:scale(1.08);}
    .g-slider:active::-webkit-slider-thumb{cursor:grabbing;transform:scale(1.18);}

    /* FLOAT LABELS */
    .fg{position:relative;margin-bottom:16px;}
    .fi,.ft{width:100%;padding:22px 16px 9px;border:none;border-radius:14px;
      font-family:'Jost',sans-serif;font-size:15px;color:#222222;background:#F2F2F2;outline:none;resize:none;
      transition:box-shadow .22s,background .22s;}
    .fi:focus,.ft:focus{background:#fff;box-shadow:0 0 0 2px #F28C8C;}
    .fl{position:absolute;left:16px;top:17px;font-size:15px;color:#B0B0B0;pointer-events:none;
      transition:all .22s cubic-bezier(.34,1.56,.64,1);transform-origin:left;}
    .fi:focus~.fl,.fi:not(:placeholder-shown)~.fl,.ft:focus~.fl,.ft:not(:placeholder-shown)~.fl{
      top:7px;font-size:10.5px;color:#F28C8C;font-weight:600;letter-spacing:.05em;text-transform:uppercase;}

    /* CHIPS */
    .chip{display:inline-flex;align-items:center;padding:7px 15px;border-radius:100px;font-size:13px;font-weight:500;
      border:none;background:#F2F2F2;color:#717171;cursor:pointer;
      transition:all .22s cubic-bezier(.34,1.56,.64,1);user-select:none;}
    .chip.on{background:rgba(242,140,140,.10);color:#D45A5A;transform:scale(1.06);}
    .chip:active{transform:scale(.95);}

    /* CARDS */
    .card{background:var(--white);border-radius:20px;padding:20px;border:1px solid #E7E5E4;box-shadow:0 1px 3px rgba(0,0,0,.03),0 4px 16px rgba(0,0,0,.04);}
    .card-press{transition:transform .15s,box-shadow .15s;cursor:pointer;}
    .card-press:active{transform:scale(.97);box-shadow:0 2px 10px rgba(0,0,0,.04);}

    /* BUTTONS */
    .btn{width:100%;padding:16px;border:none;border-radius:14px;font-family:'Jost',sans-serif;
      font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;}
    .btn-p{background:var(--coral-grad);color:#fff;
      box-shadow:0 4px 18px rgba(242,140,140,.30),0 1px 0 rgba(255,255,255,.15) inset;
      letter-spacing:.01em;}
    .btn-p:hover{background:linear-gradient(180deg,#F59A9A 0%,#E87070 100%);
      box-shadow:var(--coral-glow);}
    .btn-p:active{transform:scale(.97);box-shadow:0 2px 10px rgba(242,140,140,.20);}
    .btn-s{background:transparent;color:var(--coral);border:1.5px solid var(--coral);}
    .btn-s:active{transform:scale(.97);background:rgba(242,140,140,.05);}

    /* TAB BAR */
    .tabbar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:390px;
      background:rgba(255,255,255,.95);backdrop-filter:blur(22px);border-top:1px solid #F0F0F0;
      display:flex;padding:10px 4px 28px;z-index:200;}
    .tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:4px 2px;
      transition:transform .2s cubic-bezier(.34,1.56,.64,1);}
    .tab:active{transform:scale(.82);}
    .tab svg{transition:all .2s;}
    .tl{font-size:10px;font-weight:500;color:#B0B0B0;transition:color .2s;}
    .tab.on .tl{color:var(--coral);font-weight:700;}

    /* BREATHING */
    @keyframes bExpand{0%{transform:scale(1)}100%{transform:scale(1.65)}}
    @keyframes bContract{0%{transform:scale(1.65)}100%{transform:scale(1)}}
    @keyframes bHold{0%,100%{transform:scale(1.65)}}
    @keyframes bHoldS{0%,100%{transform:scale(1)}}
    @keyframes ringPulse{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.28;transform:scale(1.08)}}
    @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:.5}100%{transform:translateY(-90px) translateX(var(--dx));opacity:0}}

    /* PROGRESS / CHART */
    .mood-line{stroke-dasharray:1000;stroke-dashoffset:1000;animation:drawLine 1.2s ease forwards .3s;}
    @keyframes drawLine{to{stroke-dashoffset:0}}

    /* CARD STACK */
    @keyframes csIn{0%{transform:translateY(28px) scale(.95);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
    .cs-item{animation:csIn .52s cubic-bezier(.34,1.56,.64,1) both;}

    /* TOAST */
    @keyframes tIn{from{transform:translateY(90px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes tOut{from{transform:translateY(0);opacity:1}to{transform:translateY(90px);opacity:0}}
    .toast{position:fixed;bottom:110px;left:50%;transform:translateX(-50%);
      background:#222;color:#fff;padding:12px 22px;border-radius:100px;font-size:14px;font-weight:500;
      box-shadow:0 8px 30px rgba(0,0,0,.15);z-index:500;white-space:nowrap;}
    .toast.in{animation:tIn .4s cubic-bezier(.34,1.56,.64,1) both;}
    .toast.out{animation:tOut .3s ease both;}

    /* MISC */
    .serif{font-family:'Playfair Display',serif;}
    .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
    .back-btn{display:flex;align-items:center;gap:6px;color:#F28C8C;font-weight:500;font-size:14px;cursor:pointer;padding:4px 0;}
    .back-btn:active{opacity:.7;}
    .pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:.04em;}

    /* FLOATING MENU */
    @keyframes menuIn{from{opacity:0;transform:scale(.88) translateY(-8px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes menuOut{from{opacity:1;transform:scale(1) translateY(0)}to{opacity:0;transform:scale(.88) translateY(-8px)}}
    .fmenu{position:fixed;top:54px;right:calc(50% - 185px);width:210px;
      background:rgba(255,255,255,.98);backdrop-filter:blur(20px);border-radius:18px;
      box-shadow:0 8px 40px rgba(0,0,0,.10);
      overflow:hidden;z-index:400;animation:menuIn .22s cubic-bezier(.34,1.56,.64,1) both;}
    .fmenu.closing{animation:menuOut .18s ease both;}
    .fmi{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer;
      transition:background .12s;border-bottom:1px solid #F5F5F5;}
    .fmi:last-child{border-bottom:none;}
    .fmi:hover{background:rgba(242,140,140,.05);}
    .fmi:active{background:rgba(242,140,140,.10);}
    .fmb{position:fixed;inset:0;z-index:399;}
    .fab{position:fixed;top:14px;right:calc(50% - 185px);width:40px;height:40px;border-radius:12px;
      background:rgba(255,255,255,.9);backdrop-filter:blur(12px);
      border:none;box-shadow:0 4px 20px rgba(0,0,0,.08);
      display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:401;
      transition:transform .15s,box-shadow .15s;}
    .fab:hover{box-shadow:0 6px 24px rgba(0,0,0,.12);}
    .fab:active{transform:scale(.9);}

    /* STEPS for CBT */
    .step-bar{display:flex;gap:6px;margin-bottom:24px;}
    .step-dot{height:4px;flex:1;border-radius:2px;background:#EBEBEB;transition:background .3s;}
    .step-dot.done{background:var(--coral-grad);}
    .step-dot.current{background:rgba(242,140,140,.40);}

    /* HABIT TRACKER */
    @keyframes habitCheck{0%{transform:scale(1)}40%{transform:scale(1.28)}100%{transform:scale(1)}}
    .habit-row{display:flex;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid #F5F5F5;cursor:pointer;user-select:none;}
    .habit-row:last-child{border-bottom:none;}
    .hcheck{width:28px;height:28px;border-radius:8px;border:2px solid #E0E0E0;display:flex;align-items:center;justify-content:center;
      flex-shrink:0;transition:all .22s cubic-bezier(.34,1.56,.64,1);}
    .hcheck.done{background:#F28C8C;border-color:#F28C8C;animation:habitCheck .3s cubic-bezier(.34,1.56,.64,1);}

    /* MEDICINE TRACKER */
    @keyframes pillPop{0%{transform:scale(1)}35%{transform:scale(1.22)}100%{transform:scale(1)}}
    .med-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #F5F5F5;}
    .med-row:last-child{border-bottom:none;}
    .med-pill{width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
    .med-toggle{margin-left:auto;width:50px;height:28px;border-radius:100px;border:none;cursor:pointer;
      position:relative;transition:background .22s;flex-shrink:0;}
    .med-toggle::after{content:'';position:absolute;top:3px;width:22px;height:22px;border-radius:50%;
      background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.15);transition:left .22s cubic-bezier(.34,1.56,.64,1);}
    .med-toggle.off{background:#E0E0E0;}
    .med-toggle.off::after{left:3px;}
    .med-toggle.on{background:#F28C8C;}
    .med-toggle.on::after{left:25px;}
    .add-med-form{background:#F9F9F9;border-radius:16px;padding:16px;margin-top:14px;}
    .time-chip{padding:6px 12px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:#F2F2F2;color:#717171;transition:all .18s;}
    .time-chip.on{background:rgba(242,140,140,.10);color:#D45A5A;}

    /* ═══ GLOBAL MOTION SYSTEM ═══════════════════════════════════ */

    /* Reduced-motion: kill all animations & transitions */
    @media(prefers-reduced-motion:reduce){
      *{animation-duration:0.01ms!important;animation-iteration-count:1!important;
        transition-duration:0.01ms!important;scroll-behavior:auto!important;}
    }

    /* Core easing tokens */
    :root{
      --ease-apple:cubic-bezier(0.4,0,0.2,1);
      --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
      --ease-out:cubic-bezier(0,0,0.2,1);
      --dur-fast:180ms;
      --dur-base:280ms;
      --dur-slow:420ms;
    }

    /* ── Screen transitions (upgraded) ── */
    .screen{transition:transform var(--dur-slow) var(--ease-apple),
                        opacity var(--dur-base) var(--ease-apple);}

    /* ── Page-level stagger (Insights cards) ── */
    @keyframes stagger-in{
      from{opacity:0;transform:translateY(16px) scale(.98)}
      to  {opacity:1;transform:translateY(0)    scale(1)}
    }
    .stagger-card{
      animation:stagger-in var(--dur-base) var(--ease-apple) both;
    }
    .stagger-card:nth-child(1){animation-delay:0ms}
    .stagger-card:nth-child(2){animation-delay:55ms}
    .stagger-card:nth-child(3){animation-delay:110ms}
    .stagger-card:nth-child(4){animation-delay:165ms}
    .stagger-card:nth-child(5){animation-delay:220ms}
    .stagger-card:nth-child(6){animation-delay:275ms}
    .stagger-card:nth-child(7){animation-delay:330ms}

    /* ── Grounding/Journal step transitions ── */
    @keyframes step-enter{
      from{opacity:0;transform:translateY(12px)}
      to  {opacity:1;transform:translateY(0)}
    }
    @keyframes step-exit{
      from{opacity:1;transform:translateY(0)}
      to  {opacity:0;transform:translateY(-10px)}
    }
    .step-enter{animation:step-enter 420ms var(--ease-apple) both}
    .step-exit {animation:step-exit  var(--dur-fast) var(--ease-apple) both}

    /* ── Vault card elevated hover ── */
    .vault-card{
      transition:transform var(--dur-fast) var(--ease-apple),
                 box-shadow var(--dur-fast) var(--ease-apple);
      cursor:pointer;
    }
    .vault-card:hover{
      transform:scale(1.02) translateY(-2px);
      box-shadow:0 12px 32px rgba(0,0,0,.09),0 4px 12px rgba(0,0,0,.05)!important;
    }
    .vault-card:active{
      transform:scale(.98);
      box-shadow:0 2px 8px rgba(0,0,0,.06)!important;
    }

    /* ── Toggle knob micro-feedback ── */
    .med-toggle::after{
      transition:left var(--dur-base) var(--ease-spring),
                 transform var(--dur-fast) var(--ease-apple);
    }
    .med-toggle:active::after{transform:scale(0.82)!important;}

    /* ── Elevated card-press (upgraded) ── */
    .card-press{
      transition:transform var(--dur-fast) var(--ease-apple),
                 box-shadow var(--dur-fast) var(--ease-apple)!important;
    }
    .card-press:hover{
      transform:translateY(-1px) scale(1.005);
      box-shadow:0 8px 26px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.04)!important;
    }
    .card-press:active{
      transform:scale(.97)!important;
      box-shadow:0 2px 8px rgba(0,0,0,.05)!important;
    }

    /* ── Button press pulse ── */
    @keyframes btn-press{0%{transform:scale(1)}50%{transform:scale(.96)}100%{transform:scale(1)}}
    .btn-p:active,.btn-s:active{animation:btn-press 200ms var(--ease-apple);}

    /* ── FAB ring pulse ── */
    @keyframes fab-ring{0%{box-shadow:0 0 0 0 rgba(242,140,140,.4)}
      70%{box-shadow:0 0 0 10px rgba(242,140,140,0)}100%{box-shadow:0 0 0 0 rgba(242,140,140,0)}}
    .fab:focus{animation:fab-ring 600ms var(--ease-apple);}

    /* ── Skeleton shimmer ── */
    @keyframes shimmer{
      0%  {transform:translateX(-100%)}
      100%{transform:translateX(100%)}
    }
    .skeleton{
      position:relative;overflow:hidden;
      background:#EFEFEF;
      border-radius:10px;
    }
    .skeleton::after{
      content:'';position:absolute;inset:0;
      background:linear-gradient(90deg,
        transparent 0%,
        rgba(255,255,255,0.55) 40%,
        rgba(255,255,255,0.75) 50%,
        rgba(255,255,255,0.55) 60%,
        transparent 100%);
      animation:shimmer 2s var(--ease-apple) infinite;
    }
    @media(prefers-reduced-motion:reduce){.skeleton::after{animation:none;}}
    .skeleton-dark{background:#2A2A2A;}
    .skeleton-dark::after{
      background:linear-gradient(90deg,
        transparent 0%,rgba(255,255,255,.08) 40%,
        rgba(255,255,255,.15) 50%,rgba(255,255,255,.08) 60%,transparent 100%);
    }

    /* ── Chip tap ripple ── */
    @keyframes chip-tap{0%{transform:scale(1)}40%{transform:scale(.93)}100%{transform:scale(1.06)}}
    .chip:active{animation:chip-tap 220ms var(--ease-spring)!important;}

    /* ── Face picker bounce ── */
    @keyframes face-select{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1.18)}}
    .face-on{animation:face-select 260ms var(--ease-spring);}

    /* ── Tab switch indicator ── */
    @keyframes tab-dot{0%{transform:scale(0)}100%{transform:scale(1)}}
    .tab.on::before{
      content:'';display:block;width:4px;height:4px;border-radius:50%;
      background:#F28C8C;margin:0 auto 2px;
      animation:tab-dot 220ms var(--ease-spring);
    }

    /* ── Mood calendar day tap ── */
    @keyframes cal-tap{0%{transform:scale(1)}40%{transform:scale(.88)}100%{transform:scale(1.1)}}
    .cal-day:active{animation:cal-tap 220ms var(--ease-spring);}

    /* ── Insight score number count-up (for JS use) ── */
    @keyframes score-reveal{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
    .score-reveal{animation:score-reveal 350ms var(--ease-spring);}

    /* ── Modal / sheet enter ── */
    @keyframes sheet-in{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes sheet-out{from{transform:translateY(0)}to{transform:translateY(100%)}}
    .sheet-enter{animation:sheet-in var(--dur-base) var(--ease-apple);}
    .sheet-exit {animation:sheet-out var(--dur-fast) var(--ease-apple);}

    /* ── Overlay backdrop ── */
    @keyframes overlay-in{from{opacity:0}to{opacity:1}}
    .overlay-enter{animation:overlay-in var(--dur-base) var(--ease-apple);}

    /* ═══ PREMIUM FINISH ═════════════════════════════════════ */
    :root{
      --coral:#F28C8C;--coral-deep:#E06B6B;
      --coral-grad:linear-gradient(180deg,#F28C8C 0%,#E06B6B 100%);
      --coral-10:rgba(242,140,140,.10);
      --coral-glow:0 8px 28px rgba(242,140,140,.30);
      --slate:#1E293B;--slate-mid:#334155;
      --taupe:#71717A;--ghost:#A8A8B0;
      --bone:#FAF9F6;--white:#FFFFFF;
      --border:rgba(0,0,0,.07);--border-soft:rgba(0,0,0,.04);
    }
    body{color:var(--slate);background:var(--bone);}
    .glass{background:rgba(255,255,255,.72);backdrop-filter:blur(24px) saturate(180%);
      -webkit-backdrop-filter:blur(24px) saturate(180%);border:1px solid rgba(255,255,255,.28);}
    .frosted-header{position:sticky;top:0;z-index:50;
      background:rgba(250,249,246,.92);backdrop-filter:blur(20px) saturate(160%);
      -webkit-backdrop-filter:blur(20px) saturate(160%);
      border-bottom:1px solid rgba(0,0,0,.06);
      transition:box-shadow var(--dur-fast,180ms) linear;}
    .frosted-header.scrolled{box-shadow:0 2px 24px rgba(0,0,0,.07);}
    .card{box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.04),0 0 0 1px rgba(0,0,0,.03);}
    .quote-text{font-family:"Playfair Display",serif;font-style:italic;color:#5A5A5A;line-height:1.8;letter-spacing:.01em;}
    /* ── Ambient mesh gradient background ── */
    @keyframes mesh-drift{
      0%   {background-position:0% 50%}
      50%  {background-position:100% 50%}
      100% {background-position:0% 50%}
    }
    .mesh-bg{
      position:fixed;inset:0;pointer-events:none;z-index:0;
      background:linear-gradient(-45deg,
        #FAF9F6 0%,
        #F0EFF8 20%,
        #EBF5EE 40%,
        #FAF9F6 60%,
        #F5EFF7 80%,
        #EEF3F0 100%);
      background-size:400% 400%;
      animation:mesh-drift 18s ease infinite;
    }
    @media(prefers-reduced-motion:reduce){.mesh-bg{animation:none;}}

    /* Breathe Start pill — soft blue pulse */
    @keyframes breathe-pulse{
      0%,100%{box-shadow:0 0 0 0 rgba(74,111,168,.35)}
      50%    {box-shadow:0 0 0 8px rgba(74,111,168,0)}
    }
    .breathe-pill{
      animation:breathe-pulse 2.4s ease-in-out infinite;
    }
    @media(prefers-reduced-motion:reduce){.breathe-pill{animation:none;}}

    /* Mood face — selected glow ring */
    @keyframes face-glow{
      0%  {box-shadow:0 0 0 0 var(--glow-col,rgba(140,174,138,.5))}
      60% {box-shadow:0 0 0 9px rgba(0,0,0,0)}
      100%{box-shadow:0 0 0 0 rgba(0,0,0,0)}
    }
    .face-active{
      animation:face-glow .6s cubic-bezier(.34,1.56,.64,1);
      transform:scale(1.14);
    }
    .face-active-hold{
      transform:scale(1.1);
      box-shadow:0 0 0 4px var(--glow-col,rgba(140,174,138,.3));
    }

    /* ── Mood bloom overlays ── */
    @keyframes bloom-in{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
    .mood-bloom{
      position:fixed;inset:0;pointer-events:none;z-index:1;
      animation:bloom-in .55s cubic-bezier(.4,0,.2,1) both;
      transition:background .5s ease;
    }

    /* ── Glass card ── */
    .card-glass{
      background:rgba(255,255,255,.68)!important;
      backdrop-filter:blur(18px) saturate(160%);
      -webkit-backdrop-filter:blur(18px) saturate(160%);
      border:1px solid rgba(255,255,255,.5)!important;
      box-shadow:0 2px 16px rgba(0,0,0,.06),0 0 0 0.5px rgba(255,255,255,.6) inset!important;
    }

    /* ── Glass card for colorful cards (coping, journals) ── */
    .card-glass-tinted{
      backdrop-filter:blur(14px) saturate(140%);
      -webkit-backdrop-filter:blur(14px) saturate(140%);
      border:1px solid rgba(255,255,255,.45)!important;
      box-shadow:0 2px 12px rgba(0,0,0,.06)!important;
    }
  `;
  document.head.appendChild(s);
  return () => document.head.removeChild(s);
};


/* ── Reduced-motion hook ── */
const useReducedMotion = () => {
  const [reduced, setReduced] = React.useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
  React.useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const handler = e => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

/* ── Skeleton loader ── */
/* ── Skeleton atom ── */
const Skeleton = ({ w='100%', h=18, r=10, dark=false, style={} }) => (
  <div className={dark ? "skeleton skeleton-dark" : "skeleton"}
    style={{ width:w, height:h, borderRadius:r, flexShrink:0, ...style }}/>
);

/* ── Insights skeleton ── */
const InsightsSkeleton = () => (
  <div style={{ padding:"52px 24px 120px" }}>
    {/* Header */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
      <div><Skeleton w={120} h={28} r={8} style={{marginBottom:8}}/><Skeleton w={80} h={12} r={6}/></div>
      <Skeleton w={72} h={36} r={100}/>
    </div>
    {/* Stats 2-row */}
    <Skeleton w={60} h={11} r={6} style={{marginBottom:10}}/>
    <div style={{ display:"flex", gap:10, marginBottom:10 }}>
      <Skeleton h={70} r={16} style={{flex:1}}/>
      <Skeleton h={70} r={16} style={{flex:1}}/>
    </div>
    <div style={{ display:"flex", gap:10, marginBottom:28 }}>
      <Skeleton h={64} r={16} style={{flex:1}}/>
      <Skeleton h={64} r={16} style={{flex:1}}/>
      <Skeleton h={64} r={16} style={{flex:1}}/>
    </div>
    {/* Mood Map */}
    <Skeleton w={80} h={11} r={6} style={{marginBottom:10}}/>
    <div style={{ background:"#fff", borderRadius:20, padding:"16px 12px", boxShadow:"0 4px 20px rgba(0,0,0,.05)", marginBottom:6 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginBottom:4 }}>
        {Array.from({length:7},(_,i)=><Skeleton key={i} h={10} r={4}/>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
        {Array.from({length:35},(_,i)=><Skeleton key={i} h={40} r={10}/>)}
      </div>
    </div>
    <Skeleton h={12} r={6} style={{marginBottom:28}}/>
    {/* Trend chart */}
    <Skeleton w={60} h={11} r={6} style={{marginBottom:12}}/>
    <div style={{ background:"#fff", borderRadius:20, padding:"16px 14px", boxShadow:"0 4px 20px rgba(0,0,0,.05)", marginBottom:28 }}>
      <Skeleton h={140} r={10}/>
    </div>
  </div>
);

/* ── Vault skeleton ── */
const VaultSkeleton = () => (
  <div style={{ padding:"56px 24px 24px" }}>
    {/* Header */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
      <Skeleton w={48} h={20} r={6}/>
      <Skeleton w={96} h={34} r={100}/>
    </div>
    {/* Tag pills */}
    <div style={{ display:"flex", gap:8, marginBottom:24 }}>
      {[70,60,80,55].map((w,i)=><Skeleton key={i} w={w} h={30} r={100}/>)}
    </div>
    {/* Entries */}
    {[1,2,3,4].map(i=>(
      <div key={i} style={{ background:"#fff", borderRadius:20, padding:"18px 20px",
        boxShadow:"0 4px 20px rgba(0,0,0,.05)", marginBottom:12,
        borderLeft:`4px solid #EFEFEF`,
        animationDelay:`${(i-1)*60}ms`,
      }} className="stagger-card">
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <Skeleton w={60} h={20} r={100}/>
          <Skeleton w={80} h={12} r={6}/>
        </div>
        <Skeleton h={14} r={6} style={{marginBottom:8}}/>
        <Skeleton w="75%" h={14} r={6} style={{marginBottom:14}}/>
        <div style={{ display:"flex", gap:8 }}>
          {[50,60,45].map((w,j)=><Skeleton key={j} w={w} h={24} r={100}/>)}
        </div>
      </div>
    ))}
  </div>
);

/* ── Home skeleton ── */
const HomeSkeleton = () => (
  <div style={{ padding:"56px 24px 24px" }}>
    {/* Header */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
      <div><Skeleton w={140} h={14} r={6} style={{marginBottom:8}}/><Skeleton w={200} h={28} r={8}/></div>
      <Skeleton w={42} h={42} r={14}/>
    </div>
    {/* Mood row */}
    <div style={{ background:"#fff", borderRadius:20, padding:"16px 20px", boxShadow:"0 4px 20px rgba(0,0,0,.05)", marginBottom:20 }}>
      <Skeleton w={120} h={12} r={6} style={{marginBottom:14}}/>
      <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
        {[1,2,3,4,5].map(i=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            <Skeleton w={40} h={40} r={20}/>
            <Skeleton w={32} h={9} r={5}/>
          </div>
        ))}
      </div>
    </div>
    {/* Breathe strip */}
    <Skeleton h={66} r={20} style={{marginBottom:20}}/>
    {/* 2×2 grid */}
    <Skeleton w={80} h={11} r={6} style={{marginBottom:12}}/>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:28 }}>
      {[1,2,3,4].map(i=><Skeleton key={i} h={90} r={20}/>)}
    </div>
  </div>
);

/* ── AnimatedNumber — smooth count-up ── */
const AnimatedNumber = ({ value, suffix='' }) => {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    if (!value) return;
    const start = 0; const end = parseFloat(value); const dur = 700;
    const startTime = performance.now();
    const tick = now => {
      const p = Math.min((now - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      setDisplay(+(start + (end - start) * eased).toFixed(1));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span className="score-reveal">{display}{suffix}</span>;
};


const useSounds = () => {
  const ctx = React.useRef(null);
  const getCtx = () => {
    if (!ctx.current) { try { ctx.current = new (window.AudioContext||window.webkitAudioContext)(); } catch {} }
    return ctx.current;
  };
  const playTone = (freq,type='sine',dur=0.18,vol=0.06,delay=0) => {
    const ac=getCtx(); if(!ac) return;
    try {
      const osc=ac.createOscillator(),gain=ac.createGain();
      osc.connect(gain);gain.connect(ac.destination);
      osc.type=type;osc.frequency.value=freq;
      const t=ac.currentTime+delay;
      gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(vol,t+0.02);
      gain.gain.exponentialRampToValueAtTime(0.001,t+dur);
      osc.start(t);osc.stop(t+dur+0.05);
    } catch {}
  };
  return {
    ping:()=>{playTone(880,'sine',0.22,0.05);playTone(1320,'sine',0.18,0.04,0.06);},
    tap: ()=>playTone(440,'sine',0.08,0.03),
    chip:()=>playTone(660,'triangle',0.1,0.025),
    save:()=>{playTone(523,'sine',0.3,0.04);playTone(659,'sine',0.3,0.03,0.04);playTone(784,'sine',0.28,0.025,0.08);},
    nudge:()=>playTone(220,'triangle',0.15,0.04),
  };
};
const haptic={
  light:  ()=>{try{navigator.vibrate?.(8);}catch{}},
  medium: ()=>{try{navigator.vibrate?.(16);}catch{}},
  success:()=>{try{navigator.vibrate?.([10,40,20]);}catch{}},
  error:  ()=>{try{navigator.vibrate?.([20,60,20]);}catch{}},
};

/* ─── DATA ─── */
const EMOTION_GROUPS = [
  { category:"Positive / Energetic", color:"#F28C8C", bg:"rgba(242,140,140,.1)", emotions:["Motivated","Hopeful","Grateful","Focused","Joyful"] },
  { category:"Calm / Neutral",       color:"#4A9A7A", bg:"rgba(74,154,122,.1)",  emotions:["Peaceful","Grounded","Content","Relieved","Numb"] },
  { category:"Low / Heavy",          color:"#7B8FA8", bg:"rgba(123,143,168,.1)", emotions:["Sad","Lonely","Hopeless","Tired","Disappointed"] },
  { category:"High Energy / Tense",  color:"#D4702A", bg:"rgba(212,112,42,.1)",  emotions:["Anxious","Overwhelmed","Irritated","Angry","Fearful"] },
  { category:"Self-Referential",     color:"#7B3FA0", bg:"rgba(123,63,160,.1)",  emotions:["Worthy","Guilty","Insecure","Ashamed"] },
];
const EMOTIONS = EMOTION_GROUPS.flatMap(g => g.emotions);
const COPING_CARDS = [
  { emoji:"🌿", title:"5-4-3-2-1 Grounding", color:"#D4EDDA", accent:"#3D7A5E", desc:"Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste to anchor yourself in the present moment.", time:"2 min" },
  { emoji:"📓", title:"Expressive Writing", color:"#FFF3CD", accent:"#B68A20", desc:"Write freely for 10 minutes about what's weighing on you. Don't edit. Let thoughts flow uncensored onto the page.", time:"10 min" },
  { emoji:"🧊", title:"Cold Water Reset", color:"#D1ECF1", accent:"#1A7F93", desc:"Splash cold water on your face or hold your wrists under cool water for 30 seconds. Activates the dive reflex to slow heart rate.", time:"1 min" },
  { emoji:"🌀", title:"Progressive Relaxation", color:"#E8D5F5", accent:"#7B3FA0", desc:"Tense each muscle group for 5 seconds, then release. Work from feet upward to shoulders, face, jaw.", time:"8 min" },
  { emoji:"🌤️", title:"Safe Place Visualization", color:"#FDE8D0", accent:"#D4702A", desc:"Close your eyes. Picture a place where you feel completely safe and calm. Engage all senses. Spend 5 minutes there.", time:"5 min" },
  { emoji:"🎵", title:"Rhythmic Movement", color:"#FFECEC", accent:"#C0392B", desc:"Put on a song and move — sway, stretch, dance. Physical rhythm regulates the nervous system and shifts mood.", time:"4 min" },
];
// Generate a full month of mock mood data (current month)
const generateMonthData = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const scores = [62,74,55,80,68,85,77,58,71,66,82,70,45,78,63,88,72,60,76,84,57,69,81,65,73,90,55,67,79,71,64];
  const notes = {3:"Stressful morning",6:"Conflict at work",12:"Hard day",13:"Couldn't sleep",20:"Great session"};
  // cycle: days 1-5 = period, 6-13 = follicular, 14 = ovulatory, 15-28 = luteal
  const cycleDays = {1:true,2:true,3:true,4:true,5:true};
  const data = {};
  for (let d = 1; d <= Math.min(today, daysInMonth); d++) {
    const sc = scores[(d-1) % scores.length];
    const ms = sc<=20?1:sc<=40?2:sc<=60?3:sc<=80?4:5;
    data[d] = { score: sc, moodScore: ms, note: notes[d] || null, cycle: cycleDays[d] || false };
  }
  return data;
};

const MONTH_DATA = generateMonthData();

// Per-face fills (keyed by moodScore 1-5)
const FACE_FILLS = { 1:"#8A9A88", 2:"#5A8C6A", 3:"#3D7A5E", 4:"#7A9A30", 5:"#C8900A" };
const FACE_LABELS = { 1:"Terrible", 2:"Low", 3:"Okay", 4:"Good", 5:"Great" };
const moodFill = (ms) => ms ? FACE_FILLS[ms] : null;

// Smart mood-to-action mapping
const MOOD_INTERVENTIONS = {
  1: {
    label:"Emergency Calm",
    tagline:"You're not alone in this moment.",
    socratic:"What is one thing you can control in this very moment?",
    journalId:"anxious-mind",
    toolScreen:"breathe",
    toolLabel:"5-4-3-2-1 Grounding",
    toolEmoji:"🌿",
    bg:"#FFF0F0",
    accent:"#C0392B",
    gradient:"linear-gradient(135deg,#FFF0F0 0%,#FFE4E4 100%)",
  },
  2: {
    label:"Heavy Thoughts",
    tagline:"Let's gently untangle what's weighing on you.",
    socratic:"Is this feeling a permanent fact, or a temporary cloud?",
    journalId:"self-worth",
    toolScreen:"breathe",
    toolLabel:"Deep Breathing",
    toolEmoji:"🌊",
    bg:"#EEF4FF",
    accent:"#4A6FA8",
    gradient:"linear-gradient(135deg,#EEF4FF 0%,#DDE8FF 100%)",
  },
  3: {
    label:"Steady State",
    tagline:"A calm mind is a powerful mind.",
    socratic:"What is one small win from the last 4 hours?",
    journalId:"gratitude-reframe",
    toolScreen:"coping",
    toolLabel:"Coping Toolkit",
    toolEmoji:"🧰",
    bg:"#F5F5F5",
    accent:"#3D7A5E",
    gradient:"linear-gradient(135deg,#F5F5F5 0%,#EBEBEB 100%)",
  },
  4: {
    label:"Building Momentum",
    tagline:"Channel this energy into something that lasts.",
    socratic:"How can you use this energy to help your future self?",
    journalId:"boundary-setting",
    toolScreen:"thought",
    toolLabel:"Thought Record",
    toolEmoji:"💬",
    bg:"#EDFBF4",
    accent:"#3D9A6E",
    gradient:"linear-gradient(135deg,#EDFBF4 0%,#D4EDDA 100%)",
  },
  5: {
    label:"Peak Focus",
    tagline:"Capture this feeling — it's data too.",
    socratic:"What contributed most to this great feeling today?",
    journalId:"gratitude-reframe",
    toolScreen:"checkin",
    toolLabel:"Log Full Check-in",
    toolEmoji:"✨",
    bg:"#FFFBEB",
    accent:"#C8900A",
    gradient:"linear-gradient(135deg,#FFFBEB 0%,#FFF3C4 100%)",
  },
};


const moodColor = (score, type="bg") => {
  if (!score && score !== 0) return type === "bg" ? "transparent" : "#E0E0E0";
  if (score <= 30) return type === "bg" ? "rgba(242,140,140,.12)" : "#F28C8C";
  if (score <= 70) return type === "bg" ? "rgba(242,140,140,.55)" : "#F28C8C";
  return type === "bg" ? "#F28C8C" : "#F28C8C";
};
const moodTextColor = (score) => {
  if (!score) return "#B0B0B0";
  return "#fff";
};

const MOOD_HISTORY = [
  { day:"Mon", score:62, note:"Stressful morning" },
  { day:"Tue", score:74 },
  { day:"Wed", score:55, note:"Conflict at work" },
  { day:"Thu", score:80 },
  { day:"Fri", score:68 },
  { day:"Sat", score:85, note:"Good walk" },
  { day:"Sun", score:77 },
];

// ── Guided Journals ─────────────────────────────────────────────────
const GUIDED_JOURNALS = [
  {
    id:"work-stress",
    title:"Work Stress",
    subtitle:"Untangle pressure from identity",
    emoji:"💼", tag:"Work",
    color:"#FFFBF0", accent:"#B68A20",
    moodTrigger:[1,2],   // show when mood is low
    technique:"Decatastrophising",
    steps:[
      { q:"What happened at work today that's sitting with you?",            hint:"Describe the situation as simply as possible — no judgment yet.", prompts:["What would I tell a friend who described this same situation?","Is this about a task, a person, or my own expectations?","What's the worst realistic outcome — and could I handle it?"] },
      { q:"What thoughts ran through your head in that moment?",             hint:"Write the raw, unedited thoughts — even if they seem harsh.", prompts:["Did I assume something about what others were thinking?","Am I predicting a bad outcome without full evidence?","What's the story I'm telling myself?"] },
      { q:"How did those thoughts make your body feel?",                     hint:"Chest tight? Shoulders tense? Just notice.", prompts:["Where do I feel this in my body?","Is this familiar — have I felt this before in similar situations?"] },
      { q:"What's one piece of evidence that challenges your initial thought?", hint:"No matter how small — something that complicates the story.", prompts:["What has gone well that I might be discounting?","What would I need to believe to feel differently?"] },
      { q:"What's one thing within your control you could do tomorrow?",     hint:"Even the smallest action counts.", prompts:["What has helped me get through difficult work moments before?","What boundary or conversation might shift this?"] },
    ],
    distortions:["Catastrophising","Mind-reading","All-or-nothing thinking"],
  },
  {
    id:"self-worth",
    title:"Self-Worth Check-In",
    subtitle:"Reconnect with who you are",
    emoji:"🌱", tag:"Self-care",
    color:"#D4EDDA", accent:"#3D7A5E",
    moodTrigger:[1,2,3],
    technique:"Cognitive Restructuring",
    steps:[
      { q:"What's one thing you've been criticising yourself for lately?",   hint:"Be honest — this is just between you and the page.", prompts:["Would I speak to someone I love the way I'm speaking to myself?","Is this a pattern I recognise?"] },
      { q:"Where do you think that inner critic's voice comes from?",        hint:"An old relationship, a past experience, a comparison?", prompts:["When did I first start believing this about myself?","Whose voice does this sound like, if not mine?"] },
      { q:"What is one true, specific thing you did well this week?",        hint:"It doesn't need to be impressive — just real.", prompts:["What would someone who loves me say I did well?","Am I applying a double standard to myself?"] },
      { q:"What do you need most from yourself right now?",                  hint:"Grace? Rest? Celebration? Something else?", prompts:["If I were a plant, what condition would I be in?","What would I tell a version of me who was five years younger?"] },
    ],
    distortions:["Personalisation","Should statements","Labelling"],
  },
  {
    id:"anxious-mind",
    title:"Anxious Mind",
    subtitle:"Name the worry, shrink its power",
    emoji:"🌊", tag:"Health",
    color:"#EAF2FF", accent:"#4A6FA8",
    moodTrigger:[1,2,3],
    technique:"Worry Exposure",
    steps:[
      { q:"Write down the worry that's taking up the most space right now.",  hint:"Get it out of your head and onto the page.", prompts:["Is this worry about something happening now or something that might happen?","How likely is this outcome, honestly?"] },
      { q:"What's the absolute worst version of this scenario?",              hint:"Let yourself go there — then we'll come back.", prompts:["If this happened, what would I actually do?","Have I survived something this hard before?"] },
      { q:"What's a more realistic, middle-ground version of this scenario?", hint:"Not toxic positivity — just proportion.", prompts:["What information am I missing that might change the picture?","What does my worried brain leave out?"] },
      { q:"What would help you feel more grounded right now?",                hint:"A person, a habit, a mantra, a breath.", prompts:["What has helped me ride out anxiety before?","What's one physical thing I can do in the next five minutes?"] },
    ],
    distortions:["Fortune-telling","Catastrophising","Magnification"],
  },
  {
    id:"relationship-friction",
    title:"Relationship Friction",
    subtitle:"Process conflict with clarity",
    emoji:"💛", tag:"Relationships",
    color:"#E8F0FF", accent:"#4A6FA8",
    moodTrigger:[1,2,3,4],
    technique:"Perspective-taking",
    steps:[
      { q:"Describe the friction without using the words 'always' or 'never'.", hint:"Just the specific incident, not the pattern.", prompts:["What did I observe vs. what did I interpret?","What might they have been feeling or needing in that moment?"] },
      { q:"What did you need in that moment that you didn't get?",              hint:"Underneath anger, there's usually a need.", prompts:["Was I needing to feel heard? Safe? Respected?","Did I communicate this need, or did I expect it to be understood?"] },
      { q:"What's your part in the dynamic — even a small part?",               hint:"Not blame. Just honest reflection.", prompts:["Did my tone or timing play a role?","Am I bringing something from a different relationship into this one?"] },
      { q:"What's one thing you appreciate about this person?",                 hint:"Even in hard moments, something true.", prompts:["What drew me to this person originally?","What would I miss if they weren't in my life?"] },
      { q:"What would repair look like for you — what do you actually need?",  hint:"A conversation? Space? An apology?", prompts:["What outcome am I hoping for?","Is this realistic given who they are?"] },
    ],
    distortions:["Mind-reading","All-or-nothing","Emotional reasoning"],
  },
  {
    id:"gratitude-reframe",
    title:"Gratitude Reframe",
    subtitle:"Notice what's quietly working",
    emoji:"🌤️", tag:"General",
    color:"#FFF8E7", accent:"#C8900A",
    moodTrigger:[3,4,5],
    technique:"Positive Data Log",
    steps:[
      { q:"Name three things that went okay today — however small.",  hint:"Not amazing. Just okay.", prompts:["What did I do that I can feel neutral or good about?","What would I not have noticed if I wasn't looking?"] },
      { q:"Who showed up for you recently, in any way?",              hint:"A message, a gesture, a presence.", prompts:["Did I acknowledge or receive that support?","Who do I want to show up for in return?"] },
      { q:"What's one thing about yourself you're quietly proud of?", hint:"Not a trophy moment. Something real.", prompts:["What have I been consistent with despite difficulty?","What have I gotten better at that I don't give myself credit for?"] },
    ],
    distortions:["Mental filter","Disqualifying the positive"],
  },
  {
    id:"boundary-setting",
    title:"Setting Boundaries",
    subtitle:"Clarify your limits with compassion",
    emoji:"🤝", tag:"Social",
    color:"#F3E8FF", accent:"#7B3FA0",
    moodTrigger:[1,2,3,4],
    technique:"Values Clarification",
    steps:[
      { q:"What situation is asking you to set a boundary right now?",           hint:"Who? What? When does it happen?", prompts:["Am I feeling resentment, exhaustion, or dread as a signal?","Is this a one-off or a pattern?"] },
      { q:"What value of yours does this situation violate?",                    hint:"Peace, time, honesty, safety — what matters to you here?", prompts:["What am I saying yes to when I say no to this?","What would I need to believe to feel okay setting this limit?"] },
      { q:"What fear comes up when you imagine setting this boundary?",          hint:"Rejection? Conflict? Guilt?", prompts:["Is this fear based on something that has actually happened before?","What's the cost of NOT setting this boundary over time?"] },
      { q:"In one sentence, what would you like to say or do to set this limit?", hint:"Simple, direct, kind.", prompts:["Can I say it without attacking or apologising excessively?","What tone do I want to come from?"] },
    ],
    distortions:["Should statements","Emotional reasoning","Personalisation"],
  },
  {
    id:"family-tension",
    title:"Family Tension",
    subtitle:"Untangle love and frustration",
    emoji:"🏠", tag:"Family",
    color:"#FDE8D0", accent:"#D4702A",
    moodTrigger:[1,2,3],
    technique:"Schema Awareness",
    steps:[
      { q:"What happened with a family member recently that affected you?",      hint:"Just the situation — no interpretation yet.", prompts:["What did they do or say specifically?","What did I do in response?"] },
      { q:"What old story about your family does this activate?",                hint:"Something you've heard or felt before.", prompts:["Is this familiar from my childhood?","Am I responding to the person in front of me — or to an old version of them?"] },
      { q:"What do you actually want from this relationship?",                   hint:"Not what you wish they were — what you genuinely want.", prompts:["Is that realistic given who they are?","What would 'good enough' look like here?"] },
      { q:"What helps you feel more yourself after difficult family interactions?", hint:"Your reset ritual.", prompts:["How long do I typically need to decompress?","What do I need to hear — and can I give that to myself?"] },
    ],
    distortions:["Emotional reasoning","Overgeneralisation","Mind-reading"],
  },
  {
    id:"stress-script",
    title:"The Stress Script",
    subtitle:"Prepare, confront, and own the moment",
    emoji:"⚡", tag:"Resilience",
    color:"#EDF1F7", accent:"#4A6A9A",
    moodTrigger:[1,2,3,4],
    technique:"Stress Inoculation Training",
    stressScript:true,
    steps:[
      { q:"A challenge is approaching. What exactly is the stressor, and what is the story your mind is telling you about it?", hint:"Name the event on the left, your fear on the right.", prompts:["Is this fear a fact, or an interpretation?","What would I say to a friend facing the same stressor?","How likely is the worst-case outcome, honestly?"] },
      { q:"When you are in the heat of this moment, how will you meet it? Write a short, powerful Confrontation Statement.", hint:"Your personal playbook — direct, calm, and focused.", prompts:["Focus on the next task, not the whole picture","This is just a temporary spike — it will pass","I have prepared for this. I have what I need","One breath, then one step"] },
      { q:"If things feel overwhelming in the moment, what is your Safety Valve? How will you keep your fears in check in real-time?", hint:"Try: 'I can handle this feeling. It is my body preparing for action.'", prompts:["What physical cue will I use to reset? (breath, posture, pause)","What is the smallest next step I can take right now?","Is this anxiety helping me focus, or spiralling?"] },
      { q:"The script is set. Take a breath. How does your anxiety feel now that you have a plan?", hint:"Rate your anxiety, then give yourself credit for preparing.", prompts:["What does it mean that I took time to prepare for this?","What strength did I show by working through this?","What would I tell myself right before the moment begins?"] },
    ],
    distortions:["Catastrophizing","Fortune telling","Emotional reasoning"],
  },
];

// Recommend a journal based on moodScore
const recommendJournal = (moodScore) => {
  const ms = moodScore || 3;
  const matches = GUIDED_JOURNALS.filter(j => j.moodTrigger.includes(ms));
  return matches.length ? matches[Math.floor(Math.random() * matches.length)] : GUIDED_JOURNALS[2];
};

const BREATHE_PATTERNS = [
  { name:"4-7-8 Calming", in:4, hold:7, out:8, desc:"Reduces anxiety fast" },
  { name:"Box Breathing", in:4, hold:4, out:4, holdOut:4, desc:"Military stress reset" },
  { name:"Deep Relax", in:5, hold:0, out:7, desc:"Evening wind-down" },
];

const DEFAULT_VAULT = [
  {
    id: 1,
    date: "Tuesday, Feb 25",
    situation: "Presentation at work didn't go as planned",
    thought: "Everyone thinks I'm incompetent and my career is over",
    emotions: ["Shame", "Fear", "Dread"],
    intensity: 85,
    evidenceFor: "I stumbled over my words and lost my place twice. A colleague looked away during the key slide.",
    evidenceAgainst: "My manager thanked me afterwards. No one said anything negative. I've delivered 10+ successful presentations this year.",
    balanced: "One difficult presentation doesn't define my competence. My manager still trusts me with this project, and I've delivered well many times before. I can learn from what went wrong.",
    tag: "Work",
    color: "#FFF3E0",
    accent: "#B68A20",
  },
  {
    id: 2,
    date: "Friday, Feb 21",
    situation: "Friend didn't reply to my messages for two days",
    thought: "She's angry at me and our friendship is ruined",
    emotions: ["Anxiety", "Sadness", "Rejection"],
    intensity: 70,
    evidenceFor: "She usually replies within hours. I can't think of anything I did wrong but maybe I said something.",
    evidenceAgainst: "She mentioned being slammed at work last week. She's never held a grudge before. Our friendship has been solid for 5 years.",
    balanced: "People get busy. Her silence is more likely about her own life than anything I did. I can reach out gently rather than assuming the worst.",
    tag: "Relationships",
    color: "#E8F0FF",
    accent: "#4A6FA8",
  },
  {
    id: 3,
    date: "Monday, Feb 17",
    situation: "Skipped the gym three days in a row",
    thought: "I have no willpower. I'll never be healthy.",
    emotions: ["Guilt", "Frustration", "Hopelessness"],
    intensity: 60,
    evidenceFor: "I said I'd go every day and didn't. This keeps happening.",
    evidenceAgainst: "I was fighting a cold. I've maintained a consistent routine for months before this. Three days is not a pattern.",
    balanced: "Missing a few days doesn't erase all my progress. Rest is also part of health. I can start again tomorrow — three days is not three months.",
    tag: "Self-care",
    color: "#D4EDDA",
    accent: "#3D7A5E",
  },
];

// Single source of truth — used by both Daily Check-in habits step AND Rituals tab
const DEFAULT_RITUALS = [
  { id:1, emoji:"🚶", label:"Morning Walk",            color:"#D4EDDA", time:"Morning",   done:false },
  { id:2, emoji:"🧘", label:"Meditation",              color:"#E8D5F5", time:"Morning",   done:false },
  { id:3, emoji:"📝", label:"Journaling",              color:"#FFF3CD", time:"Evening",   done:false },
  { id:4, emoji:"📵", label:"Screen-free hour",        color:"#FDE8D0", time:"Evening",   done:false },
  { id:5, emoji:"🏃", label:"Exercise",                color:"#D4EDDA", time:"Morning",   done:false },
  { id:6, emoji:"💧", label:"Drink 8 glasses of water",color:"#D1ECF1", time:"Morning",   done:false },
  { id:7, emoji:"🥗", label:"Eat nourishing meals",    color:"#FFECEC", time:"Evening",   done:false },
];

// Alias for legacy references inside CheckInScreen
const DEFAULT_HABITS = DEFAULT_RITUALS;

// Shared habit analytics config — synced with DEFAULT_HABITS
const HABIT_IMPACT_CONFIG = [
  { id:1, name:"Morning Walk",           emoji:"🚶", days:[true,false,true,true,true,true,false],  color:"#A8D5C2", accentColor:"#3D9A6E" },
  { id:2, name:"Meditation",             emoji:"🧘", days:[true,true,false,true,false,true,true],   color:"#B5A8E0", accentColor:"#6B5BB5" },
  { id:3, name:"Journaling",             emoji:"📝", days:[false,true,true,true,true,false,true],   color:"#F5C76A", accentColor:"#B68A20" },
  { id:4, name:"Screen-free hour",       emoji:"📵", days:[true,false,false,true,true,true,false],  color:"#F0B8A8", accentColor:"#C05A3A" },
  { id:5, name:"Exercise",               emoji:"🏃", days:[false,true,true,false,true,false,true],  color:"#A8D5C2", accentColor:"#3D9A6E" },
  { id:6, name:"Drink 8 glasses of water",emoji:"💧",days:[true,true,false,true,true,false,true],   color:"#A8D5E8", accentColor:"#1A6A9A" },
  { id:7, name:"Eat nourishing meals",   emoji:"🥗", days:[true,true,true,false,true,true,false],   color:"#C8E8A8", accentColor:"#4A8A2A" },
];

const DEFAULT_MEDS = [
  { id:1, name:"Sertraline",  dose:"50mg",  time:"Morning", scheduledHour:8,  missedAfterHours:2, emoji:"\uD83D\uDC8A", color:"#E8D5F5", taken:false },
  { id:2, name:"Clonazepam", dose:"0.5mg", time:"Evening", scheduledHour:20, missedAfterHours:2, emoji:"\uD83D\uDC99", color:"#D1ECF1", taken:false },
];

/* ─── FLOATING LABEL FIELD ─── */
const Field = ({ label, value, onChange, textarea, rows = 3 }) => (
  <div className="fg">
    {textarea
      ? <textarea className="ft" rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder=" " />
      : <input className="fi" type="text" value={value} onChange={e => onChange(e.target.value)} placeholder=" " />}
    <label className="fl">{label}</label>
  </div>
);

/* ─── GHOST SLIDER ─── */
const GhostSlider = ({ value, onChange, label, min = 0, max = 100 }) => {
  const pct = ((value - min) / (max - min) * 100).toFixed(1);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:14, color:"#7A7570", fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:26, fontWeight:600, color:"#3D7A5E", fontFamily:"'Playfair Display',serif" }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        className="g-slider"
        style={{"--v": `${pct}%`}}
        onChange={e => onChange(+e.target.value)}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
        <span style={{ fontSize:11, color:"#9A9490" }}>None</span>
        <span style={{ fontSize:11, color:"#9A9490" }}>Extreme</span>
      </div>
    </div>
  );
};

/* ─── BREATHING SCREEN ─── */
const BreatheScreen = ({ goBack }) => {
  const [patIdx, setPatIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("ready"); // ready | in | hold | out | holdOut
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);
  const pat = BREATHE_PATTERNS[patIdx];

  const stop = useCallback(() => {
    clearInterval(timerRef.current);
    setRunning(false); setPhase("ready"); setCount(0);
  }, []);

  useEffect(() => { if (!running) return; runCycle(); return () => clearInterval(timerRef.current); }, [running, patIdx]);

  const runCycle = () => {
    const p = BREATHE_PATTERNS[patIdx];
    let seq = [];
    for (let i = p.in; i >= 1; i--) seq.push({ phase:"in", count: i });
    if (p.hold) for (let i = p.hold; i >= 1; i--) seq.push({ phase:"hold", count: i });
    for (let i = p.out; i >= 1; i--) seq.push({ phase:"out", count: i });
    if (p.holdOut) for (let i = p.holdOut; i >= 1; i--) seq.push({ phase:"holdOut", count: i });
    let idx = 0;
    setPhase(seq[0].phase); setCount(seq[0].count);
    timerRef.current = setInterval(() => {
      idx++;
      if (idx >= seq.length) { idx = 0; setCycles(c => c + 1); }
      setPhase(seq[idx].phase); setCount(seq[idx].count);
    }, 1000);
  };

  const phaseLabel = { in:"Breathe In", hold:"Hold", out:"Breathe Out", holdOut:"Hold Empty", ready:"Tap to begin" };
  const circleAnim = {
    in: "bExpand 4s linear forwards",
    hold: "bHold 1s linear infinite",
    holdOut: "bHoldS 1s linear infinite",
    out: "bContract 4s linear forwards",
    ready: "none",
  }[phase];
  const circleScale = phase === "in" || phase === "hold" ? 1.65 : 1;

  const particles = [...Array(8)].map((_, i) => ({
    id: i,
    dx: `${(Math.random() - 0.5) * 60}px`,
    delay: `${Math.random() * 2}s`,
    size: Math.random() * 8 + 4,
  }));

  return (
    <div className="screen active" style={{ background: "linear-gradient(160deg,#E8F4EC 0%,#D4EBE0 50%,#EEF0EB 100%)" }}>
      <div style={{ padding:"56px 24px 0" }}>
        <div className="back-btn" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </div>
        <h1 className="serif" style={{ fontSize:28, marginTop:20, color:"#1C1C2E" }}>Breathing<br/><em>Exercise</em></h1>

        {/* Pattern selector */}
        <div style={{ display:"flex", gap:8, marginTop:20, overflowX:"auto", paddingBottom:4 }}>
          {BREATHE_PATTERNS.map((p, i) => (
            <div key={i} onClick={() => { stop(); setPatIdx(i); }}
              style={{ flexShrink:0, padding:"8px 14px", borderRadius:12,
                background: patIdx === i ? "#3D7A5E" : "#fff",
                color: patIdx === i ? "#fff" : "#6B6560",
                fontSize:12, fontWeight:600, cursor:"pointer",
                boxShadow: patIdx === i ? "0 4px 14px rgba(61,122,94,.3)" : "0 1px 6px rgba(0,0,0,.07)",
                transition:"all .2s" }}>
              <div>{p.name}</div>
              <div style={{ fontSize:10, fontWeight:400, opacity:.75, marginTop:2 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Breathing circle */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", height:300, marginTop:20 }}
          onClick={() => running ? stop() : setRunning(true)}>
          {/* Ambient rings */}
          {[1.9,2.3,2.7].map((s,i) => (
            <div key={i} style={{ position:"absolute", width:160, height:160, borderRadius:"50%",
              background:`rgba(61,122,94,${.04-i*.01})`, animation:`ringPulse ${2+i*.5}s ease-in-out infinite`,
              animationDelay:`${i*.4}s`, transform:`scale(${s})` }} />
          ))}
          {/* Particles */}
          {running && phase === "out" && particles.map(p => (
            <div key={p.id} style={{ position:"absolute", width:p.size, height:p.size, borderRadius:"50%",
              background:"rgba(61,122,94,.4)", "--dx":p.dx,
              animation:`floatUp 2s ease-out infinite`, animationDelay:p.delay }} />
          ))}
          {/* Main circle */}
          <div style={{ width:160, height:160, borderRadius:"50%",
            background:"radial-gradient(circle at 35% 35%,rgba(255,255,255,.9) 0%,rgba(61,122,94,.25) 100%)",
            border:"2px solid rgba(61,122,94,.3)", backdropFilter:"blur(10px)",
            boxShadow:"0 8px 40px rgba(61,122,94,.2)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            animation: circleAnim, transformOrigin:"center",
            transform: phase === "hold" || phase === "out" ? `scale(${circleScale})` : undefined,
            cursor:"pointer" }}>
            <span style={{ fontSize:32, fontWeight:300, color:"#3D7A5E", fontFamily:"'Playfair Display',serif" }}>
              {running ? count : "○"}
            </span>
            <span style={{ fontSize:13, color:"#5A9A7A", fontWeight:500, marginTop:4 }}>
              {phaseLabel[phase]}
            </span>
          </div>
        </div>

        {running && (
          <div style={{ textAlign:"center", marginTop:8 }}>
            <span style={{ fontSize:13, color:"#7A9A88" }}>Cycles completed: <strong>{cycles}</strong></span>
          </div>
        )}

        <div style={{ marginTop:24 }}>
          <button className="btn btn-p" onClick={() => running ? stop() : setRunning(true)}>
            {running ? "Stop Exercise" : "Start Breathing"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── FACE PICKER ─── */
const FACES = [
  { score:1, label:"Terrible",  bg:"#D1D8D0", fill:"#8A9A88",
    eyes:<><circle cx="9" cy="10" r="1.4" fill="#fff"/><circle cx="15" cy="10" r="1.4" fill="#fff"/></>,
    mouth:<path d="M8.5 15.5 Q12 12.5 15.5 15.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>,
    tear:<line x1="15" y1="12" x2="15.5" y2="14.5" stroke="#fff" strokeWidth="1" strokeLinecap="round"/>
  },
  { score:2, label:"Low",       bg:"#A8C4AA", fill:"#5A8C6A",
    eyes:<><circle cx="9" cy="10" r="1.4" fill="#fff"/><circle cx="15" cy="10" r="1.4" fill="#fff"/></>,
    mouth:<path d="M8.5 15 Q12 13 15.5 15" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>,
    tear:null
  },
  { score:3, label:"Okay",      bg:"#7AAF88", fill:"#3D7A5E",
    eyes:<><circle cx="9" cy="10" r="1.3" fill="#fff"/><circle cx="15" cy="10" r="1.3" fill="#fff"/></>,
    mouth:<line x1="9" y1="14.5" x2="15" y2="14.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>,
    tear:null
  },
  { score:4, label:"Good",      bg:"#C4D988", fill:"#7A9A30",
    eyes:<><circle cx="9" cy="10" r="1.3" fill="#fff"/><circle cx="15" cy="10" r="1.3" fill="#fff"/></>,
    mouth:<path d="M8.5 14 Q12 17 15.5 14" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>,
    tear:null
  },
  { score:5, label:"Great",     bg:"#F5D06B", fill:"#C8900A",
    eyes:<><path d="M7.5 10 Q9 8.5 10.5 10" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M13.5 10 Q15 8.5 16.5 10" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    mouth:<path d="M8 14 Q12 18.5 16 14" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>,
    tear:null
  },
];

const FacePicker = ({ label, value, onChange }) => {
  const selected = FACES.find(f => f.score === value) || FACES[2];
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <p style={{ fontSize:14, fontWeight:600, color:"#1E293B" }}>{label}</p>
        <span style={{ fontSize:13, fontWeight:600, color: selected.fill }}>{selected.label}</span>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
        {FACES.map(f => {
          const on = value === f.score;
          return (
            <div key={f.score} onClick={() => onChange(f.score)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer" }}>
              <div style={{
                width:"100%", aspectRatio:1, borderRadius:"50%",
                background: on ? f.fill : f.bg,
                display:"flex", alignItems:"center", justifyContent:"center",
                transform: on ? "scale(1.18)" : "scale(1)",
                transition:"all .22s cubic-bezier(.34,1.56,.64,1)",
                boxShadow: on ? `0 6px 18px ${f.fill}55` : "none",
              }}>
                <svg viewBox="0 0 24 24" width="65%" height="65%">
                  {f.eyes}
                  {f.mouth}
                  {f.tear}
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// Emotion suggestions keyed by moodScore (1=Terrible→5=Great)
const MOOD_EMOTIONS = {
  1: { primary:["Hopeless","Despair","Numb","Worthless","Empty","Trapped","Helpless"], secondary:["Sad","Exhausted","Disconnected","Grief","Shame"] },
  2: { primary:["Sad","Anxious","Lonely","Tired","Frustrated","Insecure","Defeated"], secondary:["Guilty","Overwhelmed","Worried","Withdrawn","Disappointed"] },
  3: { primary:["Okay","Neutral","Unsure","Distracted","Restless","Tense","Flat"],    secondary:["Hopeful","Meh","Uncertain","Cautious","Indifferent"] },
  4: { primary:["Hopeful","Calm","Grateful","Motivated","Content","Confident","Energised"], secondary:["Proud","Optimistic","Focused","Peaceful","Satisfied"] },
  5: { primary:["Joyful","Grateful","Energised","Excited","Proud","Connected","Vibrant"],   secondary:["Inspired","Loved","Playful","Radiant","Grounded"] },
};

/* ─── CHECK-IN SCREEN ─── */
const CheckInScreen = ({ goBack, onSave, rituals, onNavigate }) => {
  const snd = useSounds();
  const [step, setStep] = useState(0);
  const [moodScore, setMoodScore] = useState(3);
  const [anxietyScore, setAnxietyScore] = useState(3);
  const [emotions, setEmotions] = useState([]);
  const [habits, setHabits] = useState((rituals || DEFAULT_RITUALS).map(h => ({ ...h, done: false })));
  const [sleepHrs, setSleepHrs]         = useState(7);
  const [sleepQuality, setSleepQuality] = useState(null);
  const [energyLevel, setEnergyLevel]   = useState(null);
  const [trigger, setTrigger] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const STEPS = ["Mood","Emotions","Habits","Sleep","Energy","Notes","Your Plan"];
  const sndE = useSounds();
  const toggleEmotion = e => { sndE.chip(); haptic.light(); setEmotions(prev => prev.includes(e) ? prev.filter(x=>x!==e) : [...prev, e]); };
  const toggleHabit = id => setHabits(prev => prev.map(h => h.id === id ? {...h, done:!h.done} : h));
  const doneCount = habits.filter(h=>h.done).length;

  const buildPayload = () => {
    const moodPct    = ((moodScore - 1) / 4) * 100;
    const anxietyPct = ((5 - anxietyScore) / 4) * 100;
    const compositeScore = Math.round(moodPct * 0.7 + anxietyPct * 0.3);
    return { moodScore, anxietyScore, sleepHrs, sleepQuality, energyLevel, emotions, compositeScore };
  };
  const save = () => {
    setSubmitted(true);
    snd.save(); haptic.success();
    setTimeout(() => { onSave(buildPayload()); goBack(); }, 1400);
  };
  const saveQuiet = (thenNavigate) => {
    onSave(buildPayload());
    if (thenNavigate && onNavigate) onNavigate(thenNavigate);
  };

  if (submitted) return (
    <div className="screen active" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#FFF0F0,#F9F9F9)" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>✓</div>
      <h2 className="serif" style={{ fontSize:26, color:"#F28C8C" }}>Reflection saved</h2>
      <p style={{ color:"#71717A", marginTop:8 }}>Your data is safe and private.</p>
    </div>
  );

  return (
    <div className="screen active">
      <div style={{ padding:"0 24px 24px" }}>
        <div className="frosted-header" style={{ margin:"0 -24px", padding:"52px 24px 16px" }}>
          <div className="back-btn" onClick={goBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </div>
          <h1 className="serif" style={{ fontSize:28, marginTop:12, color:"#1A1A1A" }}>Daily<br/><em>Check-in</em></h1>
          <p style={{ fontSize:14, color:"#9A9A9A", marginTop:4 }}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          </p>
        </div>
        <div style={{ height:20 }}/>

        <div className="step-bar">
          {STEPS.map((_, i) => <div key={i} className={`step-dot${i<step?" done":i===step?" current":""}`} />)}
        </div>
        <p style={{ fontSize:12, color:"#A8A8B0", marginBottom:20 }}>Step {step+1} of {STEPS.length}: <strong style={{color:"#F28C8C"}}>{STEPS[step]}</strong></p>

        {step === 0 && (
          <div className="card">
            <FacePicker label="Overall Mood" value={moodScore} onChange={setMoodScore} />
            <div style={{ borderTop:"1px solid #F5F5F5", paddingTop:20 }}>
              <GhostSlider label="Anxiety Level" value={(anxietyScore - 1) * 25} onChange={v => setAnxietyScore(Math.round(v / 25) + 1)} />
            </div>
          </div>
        )}

        {/* Step 1 – Emotions */}
        {step === 1 && (
          <div className="card">
            <p style={{ fontSize:14, color:"#71717A", marginBottom:4 }}>What are you feeling?</p>
            <p style={{ fontSize:12, color:"#A8A8B0", marginBottom:16 }}>
              Suggestions based on your <strong style={{color:FACE_FILLS[moodScore]}}>{FACE_LABELS[moodScore]}</strong> mood
            </p>
            {/* Primary suggestions */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {MOOD_EMOTIONS[moodScore].primary.map(e => {
                const on = emotions.includes(e);
                return (
                  <div key={e} onClick={() => toggleEmotion(e)} style={{
                    padding:"9px 18px", borderRadius:100, fontSize:13, fontWeight:600, cursor:"pointer",
                    background: on ? FACE_FILLS[moodScore] : `${FACE_FILLS[moodScore]}18`,
                    color: on ? "#fff" : FACE_FILLS[moodScore],
                    border: `1.5px solid ${on ? FACE_FILLS[moodScore] : `${FACE_FILLS[moodScore]}40`}`,
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform: on ? "scale(1.05)" : "scale(1)",
                    userSelect:"none",
                  }}>{e}</div>
                );
              })}
            </div>
            {/* Secondary suggestions */}
            <p style={{ fontSize:10, fontWeight:700, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:8 }}>Also common</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {MOOD_EMOTIONS[moodScore].secondary.map(e => {
                const on = emotions.includes(e);
                return (
                  <div key={e} onClick={() => toggleEmotion(e)} style={{
                    padding:"7px 14px", borderRadius:100, fontSize:12, fontWeight:500, cursor:"pointer",
                    background: on ? FACE_FILLS[moodScore] : "#F2F2F2",
                    color: on ? "#fff" : "#717171",
                    border: `1.5px solid ${on ? FACE_FILLS[moodScore] : "transparent"}`,
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform: on ? "scale(1.04)" : "scale(1)",
                    userSelect:"none",
                  }}>{e}</div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 – Habits */}
        {step === 2 && (
          <div>
            <div className="card" style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <p style={{ fontSize:13, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase" }}>Today's Habits</p>
                <span style={{ fontSize:13, fontWeight:700, color:"#F28C8C" }}>{doneCount}/{habits.length}</span>
              </div>
              {/* Mini progress bar */}
              <div style={{ height:5, background:"#F5F5F5", borderRadius:3, marginBottom:16 }}>
                <div style={{ height:"100%", width:`${(doneCount/habits.length)*100}%`, background:"linear-gradient(90deg,#F28C8C,#E06B6B)", borderRadius:3, transition:"width .4s ease" }} />
              </div>
              {habits.map(h => (
                <div key={h.id} className="habit-row" onClick={() => toggleHabit(h.id)}>
                  <div className={`hcheck${h.done?" done":""}`}>
                    {h.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div style={{ width:36,height:36,borderRadius:12,background:h.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{h.emoji}</div>
                  <span style={{ fontSize:14, color: h.done?"#F28C8C":"#222222", fontWeight: h.done?600:400, flex:1 }}>{h.label}</span>
                </div>
              ))}
            </div>
            {doneCount === habits.length && (
              <div style={{ textAlign:"center", padding:"12px", background:"rgba(242,140,140,.08)", borderRadius:14 }}>
                <span style={{ fontSize:22 }}>🌟</span>
                <p style={{ fontSize:14, color:"#F28C8C", fontWeight:600, marginTop:4 }}>All habits complete. Amazing day!</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3 – Sleep */}
        {step === 3 && (
          <div className="card">
            <p style={{ fontSize:14, color:"#71717A", marginBottom:4 }}>How many hours did you sleep?</p>
            <p style={{ fontSize:12, color:"#A8A8B0", marginBottom:24 }}>Good sleep is one of the strongest predictors of mood.</p>

            {/* Slider */}
            <div style={{ textAlign:"center", marginBottom:8 }}>
              <span style={{ fontSize:40, fontWeight:700, color: sleepHrs < 6 ? "#F28C8C" : sleepHrs < 7 ? "#B68A20" : "#3D9A6E", fontFamily:"'Playfair Display',serif" }}>
                {sleepHrs}h
              </span>
            </div>
            <input type="range" min="3" max="12" step="0.5" value={sleepHrs}
              onChange={e => setSleepHrs(+e.target.value)}
              className="g-slider"
              style={{ "--v":`${((sleepHrs-3)/9*100).toFixed(1)}%`, marginBottom:8, width:"100%" }} />
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <span style={{ fontSize:10, color:"#A8A8B0" }}>3h</span>
              <span style={{ fontSize:10, color:"#A8A8B0" }}>12h</span>
            </div>

            {/* Context pill */}
            <div style={{ padding:"11px 16px", borderRadius:14, marginBottom:24,
              background: sleepHrs < 6 ? "rgba(242,140,140,.1)" : sleepHrs < 7 ? "rgba(245,199,106,.12)" : "rgba(61,154,110,.1)",
              display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>{sleepHrs < 6 ? "😴" : sleepHrs < 7 ? "🌙" : "✨"}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color: sleepHrs < 6 ? "#F28C8C" : sleepHrs < 7 ? "#B68A20" : "#3D9A6E" }}>
                  {sleepHrs < 6 ? "Below recommended" : sleepHrs < 7 ? "Getting there" : "Well rested"}
                </p>
                <p style={{ fontSize:11, color:"#71717A", marginTop:2 }}>
                  {sleepHrs < 6 ? "Low sleep is linked to higher anxiety. Try for 7–9h." : sleepHrs < 7 ? "Aim for 7+ hours when you can." : "Great — well-rested days average 30% better mood."}
                </p>
              </div>
            </div>

            {/* Sleep quality */}
            <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginBottom:12 }}>Sleep quality</p>
            <div style={{ display:"flex", gap:8 }}>
              {[["😫","Terrible"],["😔","Poor"],["😐","Okay"],["😌","Good"],["😄","Great"]].map(([e,label],i) => {
                const on = sleepQuality === i+1;
                return (
                  <div key={i} onClick={() => setSleepQuality(i+1)} style={{ flex:1, textAlign:"center", cursor:"pointer",
                    padding:"10px 0", borderRadius:14,
                    background: on ? "rgba(242,140,140,.08)" : "#F5F5F5",
                    border: `1.5px solid ${on ? "#F28C8C" : "transparent"}`,
                    transform: on ? "scale(1.06)" : "scale(1)",
                    transition:"all .18s cubic-bezier(.34,1.56,.64,1)" }}>
                    <div style={{ fontSize:22 }}>{e}</div>
                    <div style={{ fontSize:9, color: on ? "#F28C8C" : "#B0B0B0", fontWeight:600, marginTop:4 }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 – Energy */}
        {step === 4 && (
          <div className="card">
            <p style={{ fontSize:14, color:"#71717A", marginBottom:4 }}>What's your energy like today?</p>
            <p style={{ fontSize:12, color:"#A8A8B0", marginBottom:28 }}>This helps track patterns across your day and week.</p>
            <div style={{ display:"flex", gap:8 }}>
              {[["🪫","Depleted"],["😓","Low"],["😐","Neutral"],["⚡","Good"],["🔥","High"]].map(([e,label],i) => {
                const on = energyLevel === i+1;
                return (
                  <div key={i} onClick={() => setEnergyLevel(i+1)} style={{ flex:1, textAlign:"center", cursor:"pointer",
                    padding:"14px 0", borderRadius:16,
                    background: on ? "rgba(242,140,140,.08)" : "#F5F5F5",
                    border: `1.5px solid ${on ? "#F28C8C" : "transparent"}`,
                    transform: on ? "scale(1.06)" : "scale(1)",
                    transition:"all .18s cubic-bezier(.34,1.56,.64,1)" }}>
                    <div style={{ fontSize:26 }}>{e}</div>
                    <div style={{ fontSize:9, color: on ? "#F28C8C" : "#B0B0B0", fontWeight:600, marginTop:6 }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5 – Notes */}
        {step === 5 && (
          <div className="card">
            <Field label="What triggered this feeling?" value={trigger} onChange={setTrigger} />
            <Field label="Additional notes..." value={note} onChange={setNote} textarea rows={4} />
          </div>
        )}

        {/* Step 6 – Your Plan */}
        {step === 6 && (() => {
          const iv = MOOD_INTERVENTIONS[moodScore];
          const journal = GUIDED_JOURNALS.find(j => j.id === iv.journalId);
          const face = FACES.find(f => f.score === moodScore);
          return (
            <div style={{animation:"ob-slide-in .42s cubic-bezier(.4,0,.2,1) both"}}>
              {/* Header */}
              <div style={{marginBottom:16,textAlign:"center"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:face.fill,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",boxShadow:`0 6px 20px ${face.fill}55`}}>
                  <svg viewBox="0 0 24 24" width="60%" height="60%">{face.eyes}{face.mouth}</svg>
                </div>
                <p style={{fontSize:13,fontWeight:700,color:iv.accent}}>{iv.label}</p>
                <p style={{fontSize:12,color:"#71717A",marginTop:2}}>Based on your check-in today</p>
              </div>

              {/* Socratic prompt */}
              <div style={{padding:"14px 16px",background:"rgba(255,255,255,.7)",borderRadius:14,borderLeft:`3px solid ${iv.accent}`,marginBottom:16,boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
                <p style={{fontSize:11,fontWeight:700,color:iv.accent,marginBottom:5}}>Reflect on this</p>
                <p style={{fontSize:14,color:"#1E293B",lineHeight:1.7,fontStyle:"italic"}}>"{iv.socratic}"</p>
              </div>

              {/* Recommended Journal CTA */}
              <div onClick={()=>saveQuiet("journal-"+iv.journalId)}
                style={{
                  borderRadius:16, padding:"16px", marginBottom:10,
                  background:iv.gradient, border:`1.5px solid ${iv.accent}22`,
                  boxShadow:`0 6px 22px ${iv.accent}22`,
                  display:"flex", alignItems:"center", gap:14, cursor:"pointer",
                  transition:"transform .15s",
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.01)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{width:46,height:46,borderRadius:14,background:"rgba(255,255,255,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  {journal?.emoji||"📓"}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:10,fontWeight:700,color:iv.accent,textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>Recommended Journal</p>
                  <p style={{fontSize:15,fontWeight:700,color:"#1E293B"}}>{journal?.title||"Guided Journal"}</p>
                  <p style={{fontSize:11,color:"#71717A",marginTop:2}}>{journal?.subtitle||iv.tagline}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iv.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>

              {/* Secondary tool pill */}
              <div onClick={()=>saveQuiet(iv.toolScreen)}
                style={{
                  borderRadius:14, padding:"12px 16px", marginBottom:4,
                  background:"#F5F5F5", border:"1.5px solid #E8E8E8",
                  display:"flex", alignItems:"center", gap:12, cursor:"pointer",
                }}>
                <span style={{fontSize:20}}>{iv.toolEmoji}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:600,color:"#1E293B"}}>{iv.toolLabel}</p>
                  <p style={{fontSize:11,color:"#71717A"}}>Quick relief tool</p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          );
        })()}

        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          {step > 0 && step < 6 && <button className="btn btn-s" style={{flex:1}} onClick={() => setStep(s=>s-1)}>Back</button>}
          {step < 6 && (
            <button className="btn btn-p" style={{flex:2}} onClick={() => setStep(s=>s+1)}>
              {step === 5 ? "See My Plan →" : "Continue →"}
            </button>
          )}
          {step === 6 && (
            <button className="btn btn-s" style={{flex:1,fontSize:13}} onClick={save}>
              Just save for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── THOUGHT RECORD SCREEN ─── */
const THOUGHT_TAGS = [
  { label:"Work", emoji:"💼", color:"#FFF3E0", accent:"#B68A20" },
  { label:"Relationships", emoji:"💛", color:"#E8F0FF", accent:"#4A6FA8" },
  { label:"Self-care", emoji:"🌿", color:"#D4EDDA", accent:"#3D7A5E" },
  { label:"Family", emoji:"🏠", color:"#FDE8D0", accent:"#D4702A" },
  { label:"Health", emoji:"❤️", color:"#FFECEC", accent:"#C0392B" },
  { label:"Finances", emoji:"💰", color:"#FFF3CD", accent:"#B68A20" },
  { label:"Social", emoji:"🤝", color:"#E8D5F5", accent:"#7B3FA0" },
  { label:"General", emoji:"📝", color:"#F0EDE8", accent:"#7A7570" },
];


const SOCRATIC_PROMPTS = [
  { persona:"The Lawyer",           q:"If you were defending yourself against this thought in court, what evidence would you present to prove it false?" },
  { persona:"The Lawyer",           q:"Is there any evidence at all that contradicts this thought — no matter how small it feels?" },
  { persona:"The Lawyer",           q:"Are you basing this on a proven fact, or a feeling that only feels like a fact?" },
  { persona:"Compassionate Friend", q:"If a close friend came to you with this exact worry, what would you say to comfort them?" },
  { persona:"Compassionate Friend", q:"Would you judge someone else as harshly as you're judging yourself right now?" },
  { persona:"Compassionate Friend", q:"Ten years from now, how much importance will this specific moment actually carry?" },
  { persona:"Objective Observer",   q:"What is the most likely middle-ground scenario — between the best and worst possible outcomes?" },
  { persona:"Objective Observer",   q:"Are you assuming you can read someone else's mind? What are three other possible reasons for their behaviour?" },
  { persona:"Objective Observer",   q:"Is this thought helpful? Does dwelling on it solve the problem, or just drain your energy?" },
  { persona:"Objective Observer",   q:"Are you taking 100% of the blame for something that involved other people or outside factors?" },
  { persona:"Reality Check",        q:"Have you been in a similar situation before? How did you survive it then?" },
  { persona:"Reality Check",        q:"Are you seeing the whole picture, or only the filtered negative parts?" },
  { persona:"Reality Check",        q:"Is there a 'shades of grey' way to look at this, rather than all-or-nothing?" },
  { persona:"Reality Check",        q:"What is one small thing you do have control over in this situation right now?" },
  { persona:"Reality Check",        q:"If you were 10% more confident today, how would that version of you view this thought?" },
];

const ThoughtRecord = ({ goBack, onSave }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ situation:"", thoughts:"", emotions:[], intensity:50, evidenceFor:"", evidenceAgainst:"", socrPrompt:null, balanced:"", tag:"General" });
  const STEPS = ["Situation","Automatic Thought","Emotions","Evidence","Balanced View"];
  const upd = (k, v) => setData(d => ({...d, [k]: v}));

  const next = () => {
    if (step < STEPS.length - 1) { setStep(s=>s+1); return; }
    onSave({
      situation: data.situation,
      thought: data.thoughts,
      emotions: data.emotions,
      intensity: data.intensity,
      evidenceFor: data.evidenceFor,
      evidenceAgainst: data.evidenceAgainst,
      balanced: data.balanced || "No balanced thought recorded.",
      tag: data.tag,
      distortions: [],
    });
    goBack();
  };

  const selectedTag = THOUGHT_TAGS.find(t => t.label === data.tag) || THOUGHT_TAGS[THOUGHT_TAGS.length - 1];

  return (
    <div className="screen active">
      <div style={{ padding:"56px 20px 24px" }}>
        <div className="back-btn" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </div>
        <h1 className="serif" style={{ fontSize:26, marginTop:18, color:"#1C1C2E" }}>Thought <em>Record</em></h1>

        <div className="step-bar" style={{ marginTop:18 }}>
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot${i<step?" done":i===step?" current":""}`} />
          ))}
        </div>
        <p style={{ fontSize:12, color:"#9A9490", marginBottom:20 }}>Step {step+1} of {STEPS.length}: <strong style={{color:"#3D7A5E"}}>{STEPS[step]}</strong></p>

        {step === 0 && (
          <div>
            <div className="card" style={{ marginBottom:12 }}>
              <p style={{ fontSize:14, color:"#6B6560", marginBottom:16 }}>Describe the situation that triggered distressing thoughts. Be specific about who, what, when, where.</p>
              <Field label="Describe the situation..." value={data.situation} onChange={v=>upd("situation",v)} textarea rows={4} />
            </div>
            <div className="card">
              <p style={{ fontSize:13, fontWeight:600, color:"#9A9490", letterSpacing:".04em", textTransform:"uppercase", marginBottom:14 }}>Category</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {THOUGHT_TAGS.map(t => (
                  <div key={t.label} onClick={() => upd("tag", t.label)}
                    style={{
                      display:"flex", alignItems:"center", gap:6,
                      padding:"7px 13px", borderRadius:100, cursor:"pointer",
                      border:`1.5px solid ${data.tag === t.label ? t.accent : "#DDD9D0"}`,
                      background: data.tag === t.label ? t.color : "#F8F6F2",
                      transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                      transform: data.tag === t.label ? "scale(1.05)" : "scale(1)",
                    }}>
                    <span style={{ fontSize:14 }}>{t.emoji}</span>
                    <span style={{ fontSize:13, fontWeight: data.tag === t.label ? 600 : 400, color: data.tag === t.label ? t.accent : "#7A7570" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="card">
            <p style={{ fontSize:14, color:"#6B6560", marginBottom:16 }}>What went through your mind? What were you telling yourself? Write down the automatic thought exactly as it appeared.</p>
            <Field label="Automatic thought..." value={data.thoughts} onChange={v=>upd("thoughts",v)} textarea rows={4} />
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <p style={{ fontSize:14, color:"#71717A", marginBottom:20 }}>Which emotions did you notice? Select all that apply.</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
              {["Motivated","Hopeful","Grateful","Peaceful","Grounded","Tired","Anxious","Overwhelmed","Sad","Angry"].map(e => {
                const on = data.emotions.includes(e);
                return (
                  <div key={e}
                    onClick={() => upd("emotions", on ? data.emotions.filter(x=>x!==e) : [...data.emotions, e])}
                    style={{
                      padding:"9px 18px", borderRadius:100, fontSize:13, fontWeight:500, cursor:"pointer",
                      background: on ? "#F28C8C" : "#F2F2F2",
                      color: on ? "#fff" : "#717171",
                      transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                      transform: on ? "scale(1.05)" : "scale(1)",
                      userSelect:"none",
                    }}>
                    {e}
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop:"1px solid #F5F5F5", paddingTop:16 }}>
              <GhostSlider label="Emotion Intensity" value={data.intensity} onChange={v=>upd("intensity",v)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="card" style={{ marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <span style={{ fontSize:18 }}>&#x2705;</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#3D7A5E" }}>Supports this thought</span>
              </div>
              <Field label="Facts that support the thought..." value={data.evidenceFor} onChange={v=>upd("evidenceFor",v)} textarea rows={3} />
            </div>
            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>&#x274C;</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#C0392B" }}>Challenges this thought</span>
                </div>
                <div onClick={()=>{ const idx=Math.floor(Math.random()*SOCRATIC_PROMPTS.length); upd("socrPrompt",SOCRATIC_PROMPTS[idx]); }}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:100, background:"rgba(242,140,140,.08)", cursor:"pointer", border:"1px solid rgba(242,140,140,.2)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                  <span style={{ fontSize:11, fontWeight:700, color:"#F28C8C" }}>Prompt me</span>
                </div>
              </div>
              {data.socrPrompt && (
                <div style={{ padding:"12px 14px", background:"rgba(242,140,140,.05)", borderRadius:12, marginBottom:12, borderLeft:"3px solid #F28C8C" }}>
                  <p style={{ fontSize:9.5, fontWeight:800, color:"#F28C8C", letterSpacing:".07em", textTransform:"uppercase", marginBottom:5 }}>{data.socrPrompt.persona}</p>
                  <p style={{ fontSize:13, color:"#555", lineHeight:1.65, fontStyle:"italic" }}>{data.socrPrompt.q}</p>
                </div>
              )}
              <Field label="Facts that contradict the thought..." value={data.evidenceAgainst} onChange={v=>upd("evidenceAgainst",v)} textarea rows={3} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <p style={{ fontSize:14, color:"#6B6560", marginBottom:16 }}>Based on all the evidence, write a more balanced, realistic perspective. What would you tell a friend in this situation?</p>
            <Field label="Balanced thought..." value={data.balanced} onChange={v=>upd("balanced",v)} textarea rows={5} />
            {data.balanced && (
              <div style={{ padding:"12px 16px", background:"rgba(61,122,94,.08)", borderRadius:12, marginTop:8 }}>
                <p style={{ fontSize:13, color:"#3D7A5E" }}>💡 Remember this thought. It reflects a more compassionate, realistic view of yourself.</p>
              </div>
            )}
          </div>
        )}

        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          {step > 0 && <button className="btn btn-s" style={{flex:1}} onClick={() => setStep(s=>s-1)}>Back</button>}
          <button className="btn btn-p" style={{flex:2}} onClick={next}>
            {step === STEPS.length-1 ? "Reflect & save ✓" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── EXPRESSIVE WRITING TOOL ─── */
const EW_PROMPTS = [
  "What has been weighing on your mind lately?",
  "Describe a moment today when you felt something strongly.",
  "What are you afraid to say out loud? Write it here — no one is watching.",
  "If your anxiety could speak, what would it say?",
  "What do you need to let go of right now?",
  "Describe the situation exactly as it happened, without judgement.",
  "What would you tell a younger version of yourself about this?",
];

const ExpressiveWriting = ({ onSave, onClose }) => {
  const [phase, setPhase]       = useState("setup");   // setup | writing | done
  const [tag, setTag]           = useState("General");
  const [prompt, setPrompt]     = useState(EW_PROMPTS[0]);
  const [body, setBody]         = useState("");
  const [timeLimit, setTimeLimit] = useState(10);      // minutes
  const [elapsed, setElapsed]   = useState(0);         // seconds
  const [running, setRunning]   = useState(false);
  const [animIn, setAnimIn]     = useState(true);
  const timerRef                = useRef(null);
  const textRef                 = useRef(null);

  // Countdown tick
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= timeLimit * 60) {
          clearInterval(timerRef.current);
          setRunning(false);
          return timeLimit * 60;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, timeLimit]);

  // Auto-focus textarea when writing starts
  useEffect(() => {
    if (phase === "writing") setTimeout(() => textRef.current?.focus(), 300);
  }, [phase]);

  const startWriting = () => {
    setAnimIn(false);
    setTimeout(() => { setPhase("writing"); setRunning(true); setAnimIn(true); }, 220);
  };

  const finish = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    if (!body.trim()) { onClose(); return; }

    const tagMeta = THOUGHT_TAGS.find(t => t.label === tag) || THOUGHT_TAGS[THOUGHT_TAGS.length - 1];
    const preview = body.trim().split(/[.!?\n]/)[0].trim().slice(0, 80);
    onSave({
      type: "expressive",
      tag,
      situation: "Expressive writing session",
      thought: preview || body.slice(0, 80),
      emotions: [],
      intensity: null,
      evidenceFor: "",
      evidenceAgainst: "",
      balanced: body.trim(),
      distortions: [],
      color: tagMeta.color,
      accent: tagMeta.accent,
    });
    setAnimIn(false);
    setTimeout(() => { setPhase("done"); setAnimIn(true); }, 220);
  };

  const remaining = timeLimit * 60 - elapsed;
  const pct = elapsed / (timeLimit * 60);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const wc = body.trim().split(/\s+/).filter(Boolean).length;
  const tagMeta = THOUGHT_TAGS.find(t => t.label === tag) || THOUGHT_TAGS[THOUGHT_TAGS.length - 1];

  return (
    <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", background: phase === "writing" ? "#FFFDF9" : "#FAFAFA",
      opacity:animIn?1:0, transform:animIn?"translateY(0)":"translateY(8px)", transition:"all .22s ease" }}>

      {/* ── SETUP PHASE ── */}
      {phase === "setup" && (
        <div style={{ flex:1, padding:"16px 20px 32px", overflowY:"auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <div onClick={onClose} style={{ width:34,height:34,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </div>
            <div>
              <p style={{ fontSize:12, color:"#A8A8B0", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>Expressive Writing</p>
              <p style={{ fontSize:11, color:"#C8C0B0", marginTop:2 }}>Uncensored. Private. Yours.</p>
            </div>
          </div>

          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1C1C2E", lineHeight:1.3, marginBottom:6 }}>
            <em>What's on<br/>your mind?</em>
          </h2>
          <p style={{ fontSize:13, color:"#A8A8B0", marginBottom:24, lineHeight:1.65 }}>
            Write freely — no editing, no judgement. Let everything out.
          </p>

          {/* Prompt picker */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Starting Prompt</p>
            <div style={{ padding:"14px 16px", background:"#fff", borderRadius:16, boxShadow:"0 2px 10px rgba(0,0,0,.05)", marginBottom:8, borderLeft:"3px solid #B68A20" }}>
              <p style={{ fontSize:14, color:"#555", lineHeight:1.65, fontStyle:"italic" }}>"{prompt}"</p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <div onClick={() => setPrompt(EW_PROMPTS[Math.floor(Math.random()*EW_PROMPTS.length)])}
                style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:100, background:"rgba(182,138,32,.08)", cursor:"pointer", border:"1px solid rgba(182,138,32,.2)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B68A20" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                <span style={{ fontSize:11, fontWeight:700, color:"#B68A20" }}>New prompt</span>
              </div>
              <div onClick={() => setPrompt("")}
                style={{ padding:"6px 12px", borderRadius:100, background:"#F5F5F5", cursor:"pointer", border:"1px solid #E8E8E8" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#A8A8B0" }}>No prompt</span>
              </div>
            </div>
          </div>

          {/* Tag */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Category</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {THOUGHT_TAGS.map(t => (
                <div key={t.label} onClick={() => setTag(t.label)}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:100, cursor:"pointer",
                    background: tag === t.label ? t.color : "#F8F6F2",
                    border: `1.5px solid ${tag === t.label ? t.accent : "#DDD9D0"}`,
                    transform: tag === t.label ? "scale(1.04)" : "scale(1)",
                    transition:"all .18s cubic-bezier(.34,1.56,.64,1)" }}>
                  <span style={{ fontSize:13 }}>{t.emoji}</span>
                  <span style={{ fontSize:12, fontWeight: tag===t.label?700:400, color: tag===t.label?t.accent:"#7A7570" }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div style={{ marginBottom:28 }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Write for</p>
            <div style={{ display:"flex", gap:8 }}>
              {[5, 10, 15, 20].map(m => (
                <div key={m} onClick={() => setTimeLimit(m)}
                  style={{ flex:1, padding:"10px 0", borderRadius:14, textAlign:"center", cursor:"pointer",
                    background: timeLimit===m ? "#FFF3CD" : "#F5F5F5",
                    border: `1.5px solid ${timeLimit===m ? "#B68A20" : "transparent"}`,
                    transform: timeLimit===m ? "scale(1.04)" : "scale(1)",
                    transition:"all .18s cubic-bezier(.34,1.56,.64,1)" }}>
                  <p style={{ fontSize:16, fontWeight:700, color: timeLimit===m?"#B68A20":"#717171" }}>{m}</p>
                  <p style={{ fontSize:9, color:"#A8A8B0", marginTop:2 }}>min</p>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-p" style={{ fontSize:15, background:"linear-gradient(135deg,#B68A20,#D4A830)", boxShadow:"0 10px 28px rgba(182,138,32,.3)" }}
            onClick={startWriting}>
            Start writing &#x2192;
          </button>
        </div>
      )}

      {/* ── WRITING PHASE ── */}
      {phase === "writing" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 20px" }}>
          {/* Timer bar */}
          <div style={{ marginBottom:16, flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:running?"#3D9A6E":"#E74C3C",animation:running?"ob-pulse 1.6s ease infinite":"none" }}/>
                <span style={{ fontSize:12, fontWeight:700, color:running?"#3D9A6E":"#E74C3C" }}>{running?"Writing…":"Time's up"}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:11, color:"#A8A8B0" }}>{wc} words</span>
                <span style={{ fontSize:18, fontWeight:700, color:"#222", fontFamily:"'Playfair Display',serif" }}>{mm}:{ss}</span>
              </div>
            </div>
            <div style={{ height:3, background:"#F0F0F0", borderRadius:100 }}>
              <div style={{ height:"100%", width:`${pct*100}%`, borderRadius:100, background:"linear-gradient(90deg,#B68A20,#F5C76A)", transition:"width .9s linear" }}/>
            </div>
          </div>

          {/* Prompt reminder */}
          {prompt && (
            <div style={{ padding:"10px 14px", background:"rgba(182,138,32,.06)", borderRadius:12, marginBottom:14, borderLeft:"3px solid #B68A20", flexShrink:0 }}>
              <p style={{ fontSize:12, color:"#B68A20", fontStyle:"italic", lineHeight:1.5 }}>"{prompt}"</p>
            </div>
          )}

          {/* Text area — fills remaining space */}
          <textarea ref={textRef} value={body} onChange={e=>setBody(e.target.value)}
            placeholder="Start writing. Don't stop. Don't edit. Just let it flow…"
            style={{ flex:1, border:"none", outline:"none", resize:"none", fontSize:16, lineHeight:1.85, color:"#222",
              background:"transparent", fontFamily:"'Playfair Display',serif", fontStyle: body?"normal":"italic",
              padding:0, minHeight:220 }}
          />

          {/* Bottom row */}
          <div style={{ display:"flex", gap:10, paddingTop:16, borderTop:"1px solid #F0F0F0", flexShrink:0, marginTop:8 }}>
            <button onClick={()=>{ setRunning(r=>!r); }}
              style={{ flex:"0 0 44px", height:44, borderRadius:12, background:"#F5F5F5", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {running
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              }
            </button>
            <button className="btn btn-p" style={{ flex:1, fontSize:14,
              background:"linear-gradient(135deg,#B68A20,#D4A830)", boxShadow:"0 8px 24px rgba(182,138,32,.25)",
              opacity: body.trim() ? 1 : .45 }}
              onClick={finish}>
              Finish &amp; save &#x2713;
            </button>
          </div>
        </div>
      )}

      {/* ── DONE PHASE ── */}
      {phase === "done" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 28px", textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:18 }}>&#x1F4D3;</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1C1C2E", marginBottom:10 }}><em>Beautifully done.</em></h2>
          <p style={{ fontSize:14, color:"#71717A", lineHeight:1.75, marginBottom:8, maxWidth:280 }}>
            You wrote <strong style={{ color:"#B68A20" }}>{wc} words</strong> in {Math.ceil(elapsed/60)} {Math.ceil(elapsed/60)===1?"minute":"minutes"}.
          </p>
          <p style={{ fontSize:13, color:"#A8A8B0", lineHeight:1.65, marginBottom:32, maxWidth:280 }}>
            Your entry has been saved to your Reflections vault.
          </p>
          <div style={{ padding:"14px 16px", background:`${tagMeta.color}`, borderRadius:16, width:"100%", marginBottom:28, borderLeft:`4px solid ${tagMeta.accent}` }}>
            <p style={{ fontSize:13, color:tagMeta.accent, lineHeight:1.7, fontStyle:"italic" }}>
              "{body.trim().slice(0,120)}{body.length>120?"…":""}"
            </p>
          </div>
          <button className="btn btn-p" style={{ fontSize:14, background:"linear-gradient(135deg,#B68A20,#D4A830)", boxShadow:"0 8px 24px rgba(182,138,32,.25)" }}
            onClick={onClose}>
            Done &#x2713;
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── GROUNDING WIZARD (5-4-3-2-1) ─── */
const GROUNDING_STEPS = [
  { sense:"See",   count:5, icon:"&#x1F441;", color:"#E8F4F8", accent:"#2A7AA0", prompt:"Look around. Name 5 things you can see right now." },
  { sense:"Touch", count:4, icon:"&#x270B;",  color:"#E8F5EE", accent:"#3D7A5E", prompt:"Pay attention to physical sensations. Name 4 things you can feel or touch." },
  { sense:"Hear",  count:3, icon:"&#x1F442;", color:"#FFF3CD", accent:"#B68A20", prompt:"Be still and listen. Name 3 sounds you can hear." },
  { sense:"Smell", count:2, icon:"&#x1F336;", color:"#F5EAF8", accent:"#7B3FA0", prompt:"Notice any scents in the air. Name 2 things you can smell (or 2 things nearby)." },
  { sense:"Taste", count:1, icon:"&#x1F444;", color:"#FFECEC", accent:"#C0392B", prompt:"Bring your attention to your mouth. Name 1 thing you can taste right now." },
];

const GroundingWizard = ({ onClose }) => {
  const [gStep, setGStep]     = useState(-1); // -1 = intro, 0-4 = sense steps, 5 = summary
  const [inputs, setInputs]   = useState({ 0:["","","","",""], 1:["","","",""], 2:["","",""], 3:["",""], 4:[""] });
  const [animIn, setAnimIn]   = useState(true);

  const advance = (dir) => {
    setAnimIn(false);
    setTimeout(() => { setGStep(s => s + dir); setAnimIn(true); }, 220);
  };

  const setVal = (stepIdx, i, v) => setInputs(prev => {
    const arr = [...prev[stepIdx]]; arr[i] = v;
    return { ...prev, [stepIdx]: arr };
  });

  const allFilled = gStep >= 0 && gStep < 5
    ? inputs[gStep].every(v => v.trim().length > 0)
    : false;

  const totalEntries = Object.values(inputs).flat().filter(v=>v.trim()).length;

  return (
    <div style={{ minHeight:"100%", background:"#FAF9F6", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px 0", flexShrink:0 }}>
        <div onClick={onClose} style={{ width:34,height:34,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:12, color:"#A8A8B0", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>5-4-3-2-1 Grounding</p>
          <div style={{ display:"flex", gap:4, marginTop:5 }}>
            {[0,1,2,3,4].map(i=>(
              <div key={i} style={{ height:3, flex:1, borderRadius:100, background: (gStep>i||gStep===5)?"#F28C8C":gStep===i?"#F28C8C55":"#E8E8E8", transition:"background .3s" }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:"20px", opacity:animIn?1:0, transform:animIn?"translateY(0)":"translateY(10px)", transition:"all .22s ease", overflowY:"auto" }}>

        {gStep === -1 && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", paddingTop:20 }}>
            <div style={{ fontSize:56, marginBottom:18 }}>&#x1F33F;</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1C1C2E", marginBottom:12 }}><em>Anchor yourself<br/>in this moment</em></h2>
            <p style={{ fontSize:14, color:"#71717A", lineHeight:1.75, maxWidth:300, marginBottom:28 }}>
              This exercise uses your five senses to gently pull your attention back to the present. Take your time with each step.
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", marginBottom:32 }}>
              {GROUNDING_STEPS.map((s,i)=>(
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }} dangerouslySetInnerHTML={{__html:s.icon}}/>
                  <p style={{ fontSize:11, color:"#A8A8B0", fontWeight:700 }}>{s.count}</p>
                </div>
              ))}
            </div>
            <button className="btn btn-p" style={{ fontSize:15 }} onClick={()=>advance(1)}>Begin &rarr;</button>
          </div>
        )}

        {gStep >= 0 && gStep < 5 && (
          <div>
            {(() => {
              const s = GROUNDING_STEPS[gStep];
              return (
                <div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:100, background:s.color, marginBottom:16 }}>
                    <span style={{ fontSize:18 }} dangerouslySetInnerHTML={{__html:s.icon}}/>
                    <span style={{ fontSize:11, fontWeight:800, color:s.accent, letterSpacing:".08em", textTransform:"uppercase" }}>{s.count} {s.sense}</span>
                  </div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#1C1C2E", marginBottom:8, lineHeight:1.3 }}><em>{s.prompt}</em></h2>
                  <p style={{ fontSize:12, color:"#A8A8B0", marginBottom:20 }}>Tap each line and type what you notice.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {inputs[gStep].map((val, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:14, background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,.05)", border:`1.5px solid ${val.trim()?s.accent+"55":"#F0F0F0"}`, transition:"border .2s" }}>
                        <div style={{ width:24, height:24, borderRadius:"50%", background:val.trim()?s.color:"#F5F5F5", border:`1.5px solid ${val.trim()?s.accent:"#E0E0E0"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
                          <span style={{ fontSize:11, fontWeight:700, color:val.trim()?s.accent:"#C0C0C0" }}>{i+1}</span>
                        </div>
                        <input value={val}
                          onChange={e=>setVal(gStep, i, e.target.value)}
                          placeholder={`${s.sense} #${i+1}…`}
                          style={{ flex:1, border:"none", outline:"none", fontSize:14, color:"#222", background:"transparent", fontFamily:"Jost,sans-serif" }}/>
                        {val.trim() && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    ))}
                  </div>
                  {allFilled && (
                    <div style={{ padding:"12px 16px", background:`${s.color}`, borderRadius:12, marginTop:16, display:"flex", alignItems:"center", gap:8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <p style={{ fontSize:12, color:s.accent, fontWeight:600 }}>
                        {gStep < 4 ? `Great. ${GROUNDING_STEPS[gStep+1].count} more for ${GROUNDING_STEPS[gStep+1].sense}.` : "Last one. You're doing brilliantly."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {gStep === 5 && (
          <div>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>&#x2728;</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1C1C2E", marginBottom:8 }}><em>You are here.</em></h2>
              <p style={{ fontSize:14, color:"#71717A", lineHeight:1.75 }}>You named {totalEntries} things. You are grounded, present, and safe.</p>
            </div>
            {GROUNDING_STEPS.map((s, si)=>(
              <div key={si} style={{ marginBottom:12, padding:"14px 16px", background:"#fff", borderRadius:16, boxShadow:"0 2px 8px rgba(0,0,0,.05)", borderLeft:`3px solid ${s.accent}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:16 }} dangerouslySetInnerHTML={{__html:s.icon}}/>
                  <span style={{ fontSize:10, fontWeight:800, color:s.accent, letterSpacing:".08em", textTransform:"uppercase" }}>You {s.sense.toLowerCase()}d</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {inputs[si].filter(v=>v.trim()).map((v,i)=>(
                    <span key={i} style={{ padding:"4px 10px", borderRadius:100, background:s.color, fontSize:12, color:s.accent, fontWeight:500 }}>{v}</span>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ padding:"14px 16px", background:"rgba(242,140,140,.06)", borderRadius:14, marginTop:8, marginBottom:8 }}>
              <p style={{ fontSize:13, color:"#F28C8C", lineHeight:1.65, textAlign:"center" }}>
                &#x1F4A1; Your nervous system has been gently reminded that you are in the present moment. This feeling is available to you anytime.
              </p>
            </div>
            <button className="btn btn-p" style={{ marginTop:12 }} onClick={onClose}>Done &#x2713;</button>
          </div>
        )}
      </div>

      {/* Footer nav */}
      {gStep >= 0 && gStep < 5 && (
        <div style={{ padding:"12px 20px 28px", display:"flex", gap:10, flexShrink:0 }}>
          <button className="btn btn-s" style={{ flex:"0 0 52px", padding:0, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>advance(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <button className="btn btn-p" style={{ flex:1, opacity: allFilled?1:.45, cursor:allFilled?"pointer":"default" }}
            onClick={()=>{ if(allFilled) advance(1); }}>
            {gStep < 4 ? `${GROUNDING_STEPS[gStep+1].count} ${GROUNDING_STEPS[gStep+1].sense} →` : "See my anchors →"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── COPING TOOLS SCREEN ─── */
const CopingTools = ({ goBack, onSave, onJournal }) => {
  const [active, setActive] = useState(null);
  const [grounding, setGrounding] = useState(false);
  const [writing, setWriting] = useState(false);

  if (grounding) return (
    <div className="screen active" style={{ overflow:"auto" }}>
      <GroundingWizard onClose={() => setGrounding(false)} />
    </div>
  );

  if (writing) return (
    <div className="screen active" style={{ overflow:"auto" }}>
      <ExpressiveWriting
        onSave={(entry) => { onSave(entry); }}
        onClose={() => setWriting(false)}
      />
    </div>
  );

  return (
    <div className="screen active">
      <div style={{ padding:"56px 20px 0" }}>
        <div className="back-btn" onClick={active !== null ? () => setActive(null) : goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          {active !== null ? "All Tools" : "Back"}
        </div>
        <h1 className="serif" style={{ fontSize:28, marginTop:20, marginBottom:24, color:"#1C1C2E" }}>
          Coping <em>Tools</em>
        </h1>

        {active !== null ? (
          <div className="card cs-item" style={{ background:COPING_CARDS[active].color }}>
            <span style={{ fontSize:48 }}>{COPING_CARDS[active].emoji}</span>
            <h2 style={{ fontSize:22, fontWeight:600, color:COPING_CARDS[active].accent, marginTop:12 }}>{COPING_CARDS[active].title}</h2>
            <span style={{ display:"inline-block", marginTop:8, padding:"3px 10px", borderRadius:100, background:`${COPING_CARDS[active].accent}22`, color:COPING_CARDS[active].accent, fontSize:11, fontWeight:600 }}>
              &#x23F1; {COPING_CARDS[active].time}
            </span>
            <p style={{ marginTop:16, fontSize:15, lineHeight:1.7, color:"#1E293B" }}>{COPING_CARDS[active].desc}</p>
            <button className="btn btn-p" style={{ marginTop:24 }} onClick={() => setActive(null)}>Try Another Tool</button>
          </div>
        ) : (
          <>
          <div style={{marginBottom:20}}>
            <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".06em",textTransform:"uppercase",marginBottom:12}}>Guided Journals</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {GUIDED_JOURNALS.map(j=>(
                <div key={j.id} className="card card-press" style={{background:j.color,padding:"16px"}}
                  onClick={()=>onJournal(j)}>
                  <div style={{width:38,height:38,borderRadius:12,background:"rgba(255,255,255,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10}}>{j.emoji}</div>
                  <p style={{fontSize:13,fontWeight:700,color:"#1E293B",lineHeight:1.3,marginBottom:3}}>{j.title}</p>
                  <p style={{fontSize:10,color:"#71717A",lineHeight:1.4}}>{j.steps.length} steps · {j.technique}</p>
                  <span style={{marginTop:8,display:"inline-block",fontSize:9,fontWeight:700,color:j.accent,background:`${j.accent}18`,padding:"2px 8px",borderRadius:100}}>{j.tag}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".06em",textTransform:"uppercase",marginBottom:12}}>Coping Tools</p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {COPING_CARDS.map((c, i) => (
              <div key={i} className="card card-press cs-item card-glass-tinted"
                style={{ animationDelay:`${i*.07}s`, display:"flex", alignItems:"center", gap:16, background:c.color, padding:"18px 20px" }}
                onClick={() => { if (i === 0) setGrounding(true); else if (i === 1) setWriting(true); else setActive(i); }}>
                <span style={{ fontSize:36 }}>{c.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, color:c.accent, fontSize:15 }}>{c.title}</p>
                  <p style={{ fontSize:12, color:"#6B6560", marginTop:2 }}>
                    {c.time} &middot; {i === 0 ? "Interactive step-by-step wizard" : i === 1 ? "Timed freewrite — saved to your vault" : c.desc.split(".")[0]+"."}
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  {(i === 0 || i === 1) && <span style={{ fontSize:10, fontWeight:700, color:c.accent, background:`${c.accent}18`, padding:"3px 8px", borderRadius:100 }}>Interactive</span>}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── PROGRESS SCREEN ─── */
const MoodCalendar = ({ monthData, onDayTap, compact=false, cycleData={}, viewYear, viewMonth, today: todayProp, mode="mood" }) => {
  const now = new Date();
  const year  = viewYear  !== undefined ? viewYear  : now.getFullYear();
  const month = viewMonth !== undefined ? viewMonth : now.getMonth();
  const today = todayProp !== undefined ? todayProp : now.getDate();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const dayLabels = ["M","T","W","T","F","S","S"];
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const gap = compact ? 4 : 5;
  const sz  = compact ? 30 : 36; // circle diameter

  // ── Colour palettes ──────────────────────────────────────────
  const MOOD_FILLS   = {1:"#B8AFA8",2:"#8FAE8A",3:"#5A8C6A",4:"#7A9A30",5:"#C8900A"};
  const ENERGY_FILLS = {1:"#CC7E85",2:"#E9A178",3:"#D1D5DB",4:"#86A789",5:"#D4A017"};

  // 5-level energy ring system — visual weight increases with energy
  // lvl 1: Depleted   — muted brick, inset shadow (sunken feel)
  // lvl 2: Low        — dusty orange, 1px dashed (fading)
  // lvl 3: Neutral    — light gray, 1px solid (quiet baseline)
  // lvl 4: Good       — sage green, 2px solid (balanced)
  // lvl 5: High       — gold, 3px solid (radiant, full capacity)
  const ENERGY_STYLES = [
    null, // placeholder for index 0
    { color:"#CC7E85", width:2, style:"solid",  inset:true  }, // 1 Depleted
    { color:"#E9A178", width:1, style:"dashed", inset:false }, // 2 Low
    { color:"#D1D5DB", width:1, style:"solid",  inset:false }, // 3 Neutral
    { color:"#86A789", width:2, style:"solid",  inset:false }, // 4 Good
    { color:"#D4A017", width:3, style:"solid",  inset:false }, // 5 High
  ];
  const getEnergyStyle = (lvl, col) => {
    if (!lvl || lvl < 1 || lvl > 5) return { border:"none", boxShadow: col ? `0 2px 8px ${col}30` : "none" };
    const e = ENERGY_STYLES[lvl];
    const border = `${e.width}px ${e.style} ${e.color}`;
    const boxShadow = e.inset
      ? `inset 0 2px 5px rgba(0,0,0,.16), 0 1px 3px rgba(0,0,0,.08)` // depleted: sunken
      : col ? `0 2px 8px ${col}30` : "none";
    return { border, boxShadow };
  };

  return (
    <div>
      {/* Day-of-week headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap, marginBottom:6 }}>
        {dayLabels.map((l,i) => (
          <div key={i} style={{ textAlign:"center", fontSize:10, color:"#A8A8B0", fontWeight:600 }}>{l}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap, rowGap: compact ? 8 : 10 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={"e"+i}/>;
          const entry     = monthData[d];
          const isToday   = d === today;
          const isFuture  = d > today;
          const isCycleDay= entry?.cycle || cycleData[d];
          const ms        = entry?.moodScore;
          const energyLvl = entry?.energyLevel || null;
          const col = (() => {
            if (isFuture) return null;
            if (mode === "energy") {
              const lvl = energyLvl;
              return lvl ? ENERGY_FILLS[lvl] : null;
            }
            return ms ? MOOD_FILLS[ms] : null;
          })();

          // Period track: detect left/right neighbours in the same grid row
          const colIdx   = (i) % 7; // 0=Mon … 6=Sun
          const prevDay  = d - 1;
          const nextDay  = d + 1;
          const prevCycle = prevDay >= 1 && (monthData[prevDay]?.cycle || cycleData[prevDay]);
          const nextCycle = nextDay <= daysInMonth && (monthData[nextDay]?.cycle || cycleData[nextDay]);
          // Whether the track pill extends left/right
          const trackLeft  = isCycleDay && prevCycle && colIdx > 0;
          const trackRight = isCycleDay && nextCycle && colIdx < 6;

          // Energy ring — 5-level system
          const eStyle = getEnergyStyle(energyLvl && !isFuture ? energyLvl : null, col);

          // Text: dark slate always readable
          const textCol = isFuture ? "#D8D8D8" : !entry ? "#C4C4C4" : "#1E293B";

          return (
            <div key={d} style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>

              {/* ── LAYER 1: Period track (background, mood mode only) ── */}
              {mode === "mood" && isCycleDay && !isFuture && !compact && (
                <div style={{
                  position:"absolute",
                  top:"50%", transform:"translateY(-50%)",
                  height: sz * 0.72,
                  left:  trackLeft  ? "-50%" : "50%",
                  right: trackRight ? "-50%" : "50%",
                  background:"rgba(242,140,140,.13)",
                  borderRadius: !trackLeft && !trackRight ? "100px"
                    : trackLeft && !trackRight ? "0 100px 100px 0"
                    : !trackLeft && trackRight ? "100px 0 0 100px"
                    : "0",
                  zIndex:0,
                }}/>
              )}

              {/* ── LAYER 2: Mood circle + Energy ring ── */}
              <div onClick={() => !isFuture && onDayTap && onDayTap(d, entry)}
                style={{
                  width:sz, height:sz, borderRadius:"50%",
                  background: col || "transparent",
                  border: mode === "energy"
                    ? (isToday ? `2px solid ${col||"#D4A017"}` : col ? "none" : "1.5px solid #EAEAEA")
                    : energyLvl && !isFuture
                      ? eStyle.border
                      : isToday
                      ? `2px solid ${col || "#F28C8C"}`
                      : isFuture ? "1.5px solid #F0F0F0"
                      : !entry  ? "1.5px solid #EAEAEA" : "none",
                  boxShadow: mode === "energy" ? (col ? `0 2px 8px ${col}40` : "none") : eStyle.boxShadow,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor: isFuture ? "default" : "pointer",
                  position:"relative", zIndex:1,
                  transition:"transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s",
                  flexShrink:0,
                }}
                onMouseEnter={e => { if (!isFuture) e.currentTarget.style.transform="scale(1.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}>
                <span style={{ fontSize:compact?9:11, fontWeight:600, color:textCol, lineHeight:1, userSelect:"none" }}>{d}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


/* ─── SCORE INFO CARD ─── */

/* ─── INSIGHT REPORT (PDF EXPORT) ─── */
const InsightReport = ({ allData, vault, checkIns, userName, selectedJournalIds = [], onClose }) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
  const monthEnd = now.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });

  // ── Compute weekly stats from allData ──
  const entries = Object.values(allData).filter(Boolean);
  const moodEntries    = entries.filter(e => e.moodScore);
  const anxietyEntries = entries.filter(e => e.anxietyScore);
  const sleepEntries   = entries.filter(e => e.sleepHrs);
  const avgMoodScore   = moodEntries.length ? +(moodEntries.reduce((a,e)=>a+e.moodScore,0)/moodEntries.length).toFixed(1) : null;
  const avgAnxScore    = anxietyEntries.length ? +(anxietyEntries.reduce((a,e)=>a+e.anxietyScore,0)/anxietyEntries.length).toFixed(1) : null;
  const avgSleep       = sleepEntries.length ? +(sleepEntries.reduce((a,e)=>a+e.sleepHrs,0)/sleepEntries.length).toFixed(1) : null;
  const totalDays      = Object.keys(allData).length;
  const adherence      = totalDays ? Math.round((moodEntries.length / totalDays) * 100) : 0;

  // ── Mood label helpers ──
  const moodLabel  = ms => FACE_LABELS[Math.round(ms)] || "—";
  const anxLabel   = as => ["None","Mild","Moderate","High","Severe"][Math.round(as)-1] || "—";
  const moodFillC  = ms => FACE_FILLS[Math.round(ms)] || "#B0B0B0";

  // ── Calendar for current month ──
  const year  = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const calOffset = firstDow === 0 ? 6 : firstDow - 1;
  const dayLabels = ["M","T","W","T","F","S","S"];

  // ── Top vault tags ──
  const tagCounts = {};
  vault.forEach(v => { if(v.tag) tagCounts[v.tag] = (tagCounts[v.tag]||0)+1; });
  const topTags = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);

  // ── Guided journals completed ──
  const journalCount = vault.filter(v=>v.type==="journal").length;

  // ── Trend data: last 14 days ──
  const trendDays = Array.from({length:14},(_,i)=>{
    const d = new Date(year, month, now.getDate()-13+i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return { label: d.getDate(), key, entry: allData[key] };
  });
  const maxSleep = Math.max(12, ...trendDays.map(d=>d.entry?.sleepHrs||0));

  // ── Energy data ──
  const energyEntries = entries.filter(e => e.energyLevel);
  const avgEnergy = energyEntries.length ? +(energyEntries.reduce((a,e)=>a+e.energyLevel,0)/energyEntries.length).toFixed(1) : null;
  const REPORT_ECOLS = {1:"#CC7E85",2:"#E9A178",3:"#D1D5DB",4:"#86A789",5:"#D4A017"};
  const REPORT_ELABELS = ["Depleted","Low","Neutral","Good","High"];

  // ── Habit data: compute 7-day completion from HABIT_IMPACT_CONFIG ──
  const habitReportData = HABIT_IMPACT_CONFIG.map(h => ({
    ...h,
    completedDays: h.days.filter(Boolean).length,
    pct: Math.round(h.days.filter(Boolean).length / 7 * 100),
  }));

  // ── Print helper ──
  const handlePrint = () => {
    const printArea = document.getElementById("cope-report");
    if (!printArea) return;
    const w = window.open("","_blank","width=900,height=700");
    w.document.write(`
      <html><head><title>Cope Insights Report</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin:0; padding:0; }
        body { font-family:'Jost',sans-serif; color:#1A1A1A; background:#fff; padding:40px; width:800px; margin:0 auto; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        .serif { font-family:'Playfair Display',serif; }
        @media print { body { padding:20px; } }
      </style></head><body>${printArea.innerHTML}</body></html>
    `);
    w.document.close();
    setTimeout(()=>w.print(), 600);
  };

  return (
    <div className="overlay-enter" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:400,display:"flex",flexDirection:"column",overflowY:"auto"}}
      onClick={onClose}>
      {/* Floating controls */}
      <div style={{position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",background:"rgba(255,255,255,.95)",backdropFilter:"blur(10px)",borderBottom:"1px solid #F0F0F0"}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{background:"none",border:"1.5px solid #E0E0E0",borderRadius:100,padding:"7px 16px",fontSize:13,color:"#71717A",cursor:"pointer",fontFamily:"Jost,sans-serif"}}>
          ← Close
        </button>
        <p style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>Insights Report</p>
        <button onClick={handlePrint} style={{background:"linear-gradient(180deg,#F28C8C 0%,#E06B6B 100%)",border:"none",borderRadius:100,padding:"8px 18px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"Jost,sans-serif",display:"flex",alignItems:"center",gap:6}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Save PDF
        </button>
      </div>

      {/* Report body */}
      <div style={{flex:1,display:"flex",justifyContent:"center",padding:"32px 20px 60px"}} onClick={e=>e.stopPropagation()}>
        <div id="cope-report" style={{width:"100%",maxWidth:700,background:"#fff",borderRadius:24,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.12)"}}>

          {/* ── HEADER ── */}
          <div style={{background:"#0A0A0A",padding:"32px 36px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <img src={COPE_LOGO} alt="cope" style={{width:36,height:36,objectFit:"contain"}}/>
              </div>
              <p style={{fontSize:10,color:"rgba(255,255,255,.4)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Clinical Insights Report</p>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#fff",fontStyle:"italic",lineHeight:1.2}}>Your <em>Monthly</em><br/>Health Summary</h1>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:14,fontWeight:700,color:"#fff"}}>{userName}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:4}}>{monthStart}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>— {monthEnd}</p>
            </div>
          </div>

          <div style={{padding:"32px 36px"}}>

            {/* ── SECTION 1: Executive Summary ── */}
            <div style={{marginBottom:36}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase"}}>I. Executive Summary</p>
                <p style={{fontSize:10,color:"#B0B0B0",fontStyle:"italic"}}>{monthStart} — {monthEnd}</p>
              </div>

              {/* Vital signs bar */}
              <div style={{
                background:"#FFFFFF", borderRadius:18, border:"1px solid #EDEAE6",
                boxShadow:"0 2px 12px rgba(0,0,0,.04)",
                display:"grid", gridTemplateColumns:"1fr 1px 1fr 1px 1fr 1px 1fr 1px 0.9fr",
                overflow:"hidden",
              }}>
                {/* Divider helper */}
                {(() => {
                  const DIV = <div style={{background:"#F0EDE8",alignSelf:"stretch"}}/>;

                  // ── Delta helpers: compare to prev period ──
                  const prevEntries = (() => {
                    const days = Object.keys(allData).sort().slice(0, Math.max(0, Object.keys(allData).length - moodEntries.length));
                    return days.map(k=>allData[k]).filter(Boolean);
                  })();
                  const prevMood = prevEntries.filter(e=>e.moodScore).length
                    ? +(prevEntries.filter(e=>e.moodScore).reduce((a,e)=>a+e.moodScore,0)/prevEntries.filter(e=>e.moodScore).length).toFixed(1) : null;
                  const prevAnx  = prevEntries.filter(e=>e.anxietyScore).length
                    ? +(prevEntries.filter(e=>e.anxietyScore).reduce((a,e)=>a+e.anxietyScore,0)/prevEntries.filter(e=>e.anxietyScore).length).toFixed(1) : null;
                  const prevSleep= prevEntries.filter(e=>e.sleepHrs).length
                    ? +(prevEntries.filter(e=>e.sleepHrs).reduce((a,e)=>a+e.sleepHrs,0)/prevEntries.filter(e=>e.sleepHrs).length).toFixed(1) : null;

                  const Delta = ({curr, prev, invert=false, unit=""}) => {
                    if (!curr || !prev) return <span style={{fontSize:9,color:"#C0C0C0"}}>no prior data</span>;
                    const diff = +(curr - prev).toFixed(1);
                    if (diff === 0) return <span style={{fontSize:9,color:"#A8A8B0"}}>→ Stable</span>;
                    const up = diff > 0;
                    const positive = invert ? !up : up;
                    return <span style={{fontSize:9,fontWeight:700,color:positive?"#3D9A6E":"#C0392B"}}>
                      {up?"↑":"↓"} {Math.abs(diff)}{unit} {positive?"Improving":"↓ Declining"}
                    </span>;
                  };

                  // Mood clinical label
                  const moodClinical = ms => {
                    if (!ms) return "—";
                    if (ms >= 4.5) return "Euthymic+";
                    if (ms >= 3.5) return "Euthymic";
                    if (ms >= 2.5) return "Dysthymic";
                    return "Depressed";
                  };
                  const anxClinical = as => {
                    if (!as) return "—";
                    if (as <= 1.5) return "Minimal";
                    if (as <= 2.5) return "Mild";
                    if (as <= 3.5) return "Moderate";
                    if (as <= 4.5) return "High";
                    return "Severe";
                  };
                  const sleepQualLabel = q => ["","Poor","Fair","Adequate","Good","Optimal"][Math.round(q)] || "—";

                  // Adherence ring (SVG)
                  const pct = adherence / 100;
                  const r = 20; const circ = 2 * Math.PI * r;
                  const dash = circ * pct;

                  const cell = (content) => (
                    <div style={{padding:"18px 10px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      {content}
                    </div>
                  );

                  return <>
                    {/* Mood */}
                    {cell(<>
                      <p style={{fontSize:9,fontWeight:700,color:"#9A9490",letterSpacing:".08em",textTransform:"uppercase"}}>Mood</p>
                      <p style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:avgMoodScore?moodFillC(avgMoodScore):"#D0D0D0",lineHeight:1}}>
                        {avgMoodScore||"—"}<span style={{fontSize:11,color:"#B0B0B0",fontWeight:400}}>{avgMoodScore?"/5":""}</span>
                      </p>
                      <p style={{fontSize:10,fontWeight:600,color:"#71717A"}}>{moodClinical(avgMoodScore)}</p>
                      <Delta curr={avgMoodScore} prev={prevMood}/>
                    </>)}
                    {DIV}

                    {/* Anxiety */}
                    {cell(<>
                      <p style={{fontSize:9,fontWeight:700,color:"#9A9490",letterSpacing:".08em",textTransform:"uppercase"}}>Anxiety</p>
                      <p style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,
                        color:avgAnxScore?(avgAnxScore<=2?"#3D9A6E":avgAnxScore<=3?"#B68A20":"#C0392B"):"#D0D0D0",lineHeight:1}}>
                        {avgAnxScore||"—"}<span style={{fontSize:11,color:"#B0B0B0",fontWeight:400}}>{avgAnxScore?"/5":""}</span>
                      </p>
                      <p style={{fontSize:10,fontWeight:600,color:"#71717A"}}>{anxClinical(avgAnxScore)} intensity</p>
                      <Delta curr={avgAnxScore} prev={prevAnx} invert={true}/>
                    </>)}
                    {DIV}

                    {/* Sleep */}
                    {cell(<>
                      <p style={{fontSize:9,fontWeight:700,color:"#9A9490",letterSpacing:".08em",textTransform:"uppercase"}}>Sleep</p>
                      <p style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,
                        color:avgSleep?(avgSleep>=7?"#1A6A9A":"#D4702A"):"#D0D0D0",lineHeight:1}}>
                        {avgSleep||"—"}<span style={{fontSize:11,color:"#B0B0B0",fontWeight:400}}>{avgSleep?"h":""}</span>
                      </p>
                      <p style={{fontSize:10,fontWeight:600,color:"#71717A"}}>
                        {avgSleep ? (avgSleep>=7?"Consistent rhythm":"Below optimal") : "No data"}
                      </p>
                      <Delta curr={avgSleep} prev={prevSleep} unit="h"/>
                    </>)}
                    {DIV}

                    {/* Energy */}
                    {cell(<>
                      <p style={{fontSize:9,fontWeight:700,color:"#9A9490",letterSpacing:".08em",textTransform:"uppercase"}}>Energy</p>
                      <p style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,
                        color:avgEnergy?["#CC7E85","#E9A178","#71717A","#86A789","#D4A017"][Math.round(avgEnergy)-1]:"#D0D0D0",lineHeight:1}}>
                        {avgEnergy||"—"}<span style={{fontSize:11,color:"#B0B0B0",fontWeight:400}}>{avgEnergy?"/5":""}</span>
                      </p>
                      <p style={{fontSize:10,fontWeight:600,color:"#71717A"}}>
                        {avgEnergy?["Depleted","Low","Neutral","Good","High"][Math.round(avgEnergy)-1]:"No data"}
                      </p>
                    </>)}
                    {DIV}

                    {/* Adherence — coral ring */}
                    {cell(<>
                      <p style={{fontSize:9,fontWeight:700,color:"#9A9490",letterSpacing:".06em",textTransform:"uppercase"}}>Meds</p>
                      <div style={{position:"relative",width:48,height:48,margin:"2px auto"}}>
                        <svg width="48" height="48" viewBox="0 0 48 48">
                          <circle cx="24" cy="24" r={r} fill="none" stroke="#F0EDE8" strokeWidth="4"/>
                          <circle cx="24" cy="24" r={r} fill="none" stroke="#F28C8C" strokeWidth="4"
                            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                            transform="rotate(-90 24 24)"
                            style={{transition:"stroke-dasharray .6s ease"}}/>
                        </svg>
                        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <span style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:"#F28C8C"}}>{adherence}%</span>
                        </div>
                      </div>
                      <p style={{fontSize:9,fontWeight:600,color:"#71717A"}}>{moodEntries.length}/{totalDays} days</p>
                    </>)}
                  </>;
                })()}
              </div>
            </div>

            {/* ── SECTION 2: Mood Map ── */}
            <div style={{marginBottom:28}}>
              <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>II. Mood Map</p>
              <p style={{fontSize:11,color:"#A8A8B0",marginBottom:10}}>{now.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</p>
              <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                {Object.entries(FACE_FILLS).map(([ms,fill])=>(
                  <div key={ms} style={{display:"flex",alignItems:"center",gap:3}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:fill}}/>
                    <span style={{fontSize:8,color:"#A8A8B0"}}>{FACE_LABELS[ms]}</span>
                  </div>
                ))}
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:"transparent",border:"1px solid #D8D5D0"}}/>
                  <span style={{fontSize:8,color:"#A8A8B0"}}>No entry</span>
                </div>
              </div>
              <div style={{background:"#FAF9F6",borderRadius:14,padding:"12px",border:"1px solid #EEEBE6"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
                  {dayLabels.map((l,i)=><div key={i} style={{textAlign:"center",fontSize:8,color:"#C0C0C0",fontWeight:700}}>{l}</div>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                  {Array.from({length:calOffset},(_,i)=><div key={"e"+i}/>)}
                  {Array.from({length:daysInMonth},(_,i)=>{
                    const d=i+1;
                    const key=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                    const entry=allData[key];
                    const ms=entry?.moodScore;
                    const isFuture=d>now.getDate();
                    const fill=ms&&!isFuture?FACE_FILLS[ms]:null;
                    return (
                      <div key={d} style={{
                        height:26,borderRadius:"50%",
                        background:fill||"transparent",
                        border:isFuture?"1px solid #F0F0F0":fill?"none":"1px solid #E8E4DE",
                        display:"flex",alignItems:"center",justifyContent:"center",
                      }}>
                        <span style={{fontSize:9,fontWeight:600,color:fill?"#1E293B":isFuture?"#D8D8D8":"#C0C0C0"}}>{d}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── SECTION 2b: Energy Map ── */}
            <div style={{marginBottom:36}}>
              <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>II b. Energy Map</p>
              <p style={{fontSize:11,color:"#A8A8B0",marginBottom:10}}>{now.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</p>
              <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                {Object.entries(REPORT_ECOLS).map(([lvl,col])=>(
                  <div key={lvl} style={{display:"flex",alignItems:"center",gap:3}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:col}}/>
                    <span style={{fontSize:8,color:"#A8A8B0"}}>{REPORT_ELABELS[lvl-1]}</span>
                  </div>
                ))}
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:"transparent",border:"1px solid #D8D5D0"}}/>
                  <span style={{fontSize:8,color:"#A8A8B0"}}>No entry</span>
                </div>
              </div>
              <div style={{background:"#FAF9F6",borderRadius:14,padding:"12px",border:"1px solid #EEEBE6"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
                  {dayLabels.map((l,i)=><div key={i} style={{textAlign:"center",fontSize:8,color:"#C0C0C0",fontWeight:700}}>{l}</div>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                  {Array.from({length:calOffset},(_,i)=><div key={"e"+i}/>)}
                  {Array.from({length:daysInMonth},(_,i)=>{
                    const d=i+1;
                    const key=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                    const entry=allData[key];
                    const lvl=entry?.energyLevel;
                    const isFuture=d>now.getDate();
                    const fill=lvl&&!isFuture?REPORT_ECOLS[lvl]:null;
                    return (
                      <div key={d} style={{
                        height:26,borderRadius:"50%",
                        background:fill||"transparent",
                        border:isFuture?"1px solid #F0F0F0":fill?"none":"1px solid #E8E4DE",
                        display:"flex",alignItems:"center",justifyContent:"center",
                      }}>
                        <span style={{fontSize:9,fontWeight:600,color:fill?"#1E293B":isFuture?"#D8D8D8":"#C0C0C0"}}>{d}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── SECTION 3: Biophysical Trends ── */}
            <div style={{marginBottom:28}}>
              <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>III. Biophysical Trends</p>
              <p style={{fontSize:11,color:"#A8A8B0",marginBottom:14}}>Last 14 days</p>

              {/* 3a: Mood trend line */}
              <p style={{fontSize:9,fontWeight:700,color:"#A8A8B0",marginBottom:6,letterSpacing:".06em"}}>MOOD SCORE</p>
              <div style={{background:"#FAF9F6",borderRadius:14,padding:"12px 12px 8px",border:"1px solid #EEEBE6",marginBottom:12}}>
                <svg width="100%" viewBox="0 0 300 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="rMoodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F28C8C" stopOpacity=".20"/>
                      <stop offset="100%" stopColor="#F28C8C" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Zone bands */}
                  <rect x="0" y="0" width="300" height="22" fill="rgba(134,167,137,.08)"/>
                  <rect x="0" y="22" width="300" height="20" fill="rgba(235,235,235,.12)"/>
                  <rect x="0" y="42" width="300" height="28" fill="rgba(242,140,140,.06)"/>
                  {/* Gridlines */}
                  {[20,40,60,80].map(v=>{
                    const y = 70 - (v/100)*70;
                    return <line key={v} x1="0" y1={y} x2="300" y2={y} stroke="#E8E4DE" strokeWidth="0.5" strokeDasharray="3 2"/>;
                  })}
                  {/* Mood spline */}
                  {(() => {
                    const pts = trendDays.map((d,i)=>({
                      x: (i/(trendDays.length-1))*290+5,
                      y: d.entry?.moodScore ? 70-(((d.entry.moodScore-1)/4)*70) : null
                    })).filter(p=>p.y!==null);
                    if(pts.length<2) return null;
                    const path = pts.reduce((acc,p,i,arr)=>{
                      if(i===0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                      const prev=arr[i-1];
                      return `${acc} C${(prev.x+(p.x-prev.x)/3).toFixed(1)},${prev.y.toFixed(1)} ${(prev.x+2*(p.x-prev.x)/3).toFixed(1)},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                    },'');
                    const area=`${path} L${pts[pts.length-1].x},70 L${pts[0].x},70 Z`;
                    return <>
                      <path d={area} fill="url(#rMoodGrad)"/>
                      <path d={path} fill="none" stroke="#F28C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#F28C8C" stroke="#fff" strokeWidth="1"/>)}
                    </>;
                  })()}
                </svg>
                <div style={{display:"flex",gap:2,marginTop:2}}>
                  {trendDays.map((d,i)=>(
                    <div key={i} style={{flex:1,textAlign:"center",fontSize:7,color:"#C0C0C0"}}>{i%3===0?d.label:""}</div>
                  ))}
                </div>
                <div style={{display:"flex",gap:4,marginTop:6,alignItems:"center"}}>
                  <div style={{width:14,height:2,borderRadius:1,background:"#F28C8C"}}/>
                  <span style={{fontSize:8,color:"#A8A8B0"}}>Mood score (1–5 scale)</span>
                </div>
              </div>

              {/* 3b: Sleep bar chart — standalone */}
              <p style={{fontSize:9,fontWeight:700,color:"#A8A8B0",marginBottom:6,letterSpacing:".06em"}}>SLEEP DURATION</p>
              <div style={{background:"#FAF9F6",borderRadius:14,padding:"12px 12px 8px",border:"1px solid #EEEBE6",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"flex-end",gap:2,height:60}}>
                  {trendDays.map((d,i)=>{
                    const h=d.entry?.sleepHrs||0;
                    const barH=h?`${(h/maxSleep*100).toFixed(0)}%`:"0%";
                    const col=h>=7?"#4A8FA8":h>0?"#E9A178":"transparent";
                    return (
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",justifyContent:"flex-end",gap:1}}>
                        <span style={{fontSize:6,color:"#C0C0C0",lineHeight:1}}>{h>0?h:""}</span>
                        <div style={{width:"100%",borderRadius:"2px 2px 0 0",background:col,height:barH,minHeight:h?3:0}}/>
                      </div>
                    );
                  })}
                </div>
                <div style={{display:"flex",gap:2,marginTop:4}}>
                  {trendDays.map((d,i)=>(
                    <div key={i} style={{flex:1,textAlign:"center",fontSize:7,color:"#C0C0C0"}}>{i%3===0?d.label:""}</div>
                  ))}
                </div>
                <div style={{display:"flex",gap:12,marginTop:6}}>
                  {[["#4A8FA8","≥7h — Optimal"],["#E9A178","<7h — Below target"]].map(([c,l])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:10,height:8,borderRadius:2,background:c}}/>
                      <span style={{fontSize:8,color:"#A8A8B0"}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3c: Energy line chart */}
              <p style={{fontSize:9,fontWeight:700,color:"#A8A8B0",marginBottom:6,letterSpacing:".06em"}}>ENERGY LEVELS</p>
              <div style={{background:"#FAF9F6",borderRadius:14,padding:"12px 12px 8px",border:"1px solid #EEEBE6"}}>
                <svg width="100%" viewBox="0 0 300 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="rEnergyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4A017" stopOpacity=".20"/>
                      <stop offset="100%" stopColor="#D4A017" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[20,40,60,80].map(v=>{
                    const y=70-(v/100)*70;
                    return <line key={v} x1="0" y1={y} x2="300" y2={y} stroke="#E8E4DE" strokeWidth="0.5" strokeDasharray="3 2"/>;
                  })}
                  {(() => {
                    const pts=trendDays.map((d,i)=>({
                      x:(i/(trendDays.length-1))*290+5,
                      y:d.entry?.energyLevel?70-(((d.entry.energyLevel-1)/4)*70):null,
                      lvl:d.entry?.energyLevel
                    })).filter(p=>p.y!==null);
                    if(pts.length<2) return null;
                    const path=pts.reduce((acc,p,i,arr)=>{
                      if(i===0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                      const prev=arr[i-1];
                      return `${acc} C${(prev.x+(p.x-prev.x)/3).toFixed(1)},${prev.y.toFixed(1)} ${(prev.x+2*(p.x-prev.x)/3).toFixed(1)},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                    },'');
                    const area=`${path} L${pts[pts.length-1].x},70 L${pts[0].x},70 Z`;
                    return <>
                      <path d={area} fill="url(#rEnergyGrad)"/>
                      <path d={path} fill="none" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={2.5} fill={REPORT_ECOLS[p.lvl]||"#D4A017"} stroke="#fff" strokeWidth="1"/>)}
                    </>;
                  })()}
                </svg>
                <div style={{display:"flex",gap:2,marginTop:2}}>
                  {trendDays.map((d,i)=>(
                    <div key={i} style={{flex:1,textAlign:"center",fontSize:7,color:"#C0C0C0"}}>{i%3===0?d.label:""}</div>
                  ))}
                </div>
                <div style={{display:"flex",gap:4,marginTop:6,alignItems:"center"}}>
                  <div style={{width:14,height:2,borderRadius:1,background:"#D4A017"}}/>
                  <span style={{fontSize:8,color:"#A8A8B0"}}>Energy level (Depleted → High)</span>
                </div>
              </div>
            </div>

            {/* ── SECTION 4: Reflection Vault Themes ── */}
            <div style={{marginBottom:36}}>
              <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>IV. Reflection Vault Themes</p>
              {topTags.length > 0 ? (
                <div style={{background:"#FAF9F6",borderRadius:16,padding:"18px 20px",border:"1px solid #F0F0F0"}}>
                  <p style={{fontSize:12,fontWeight:600,color:"#71717A",marginBottom:12}}>Top cognitive & emotional themes this period:</p>
                  {topTags.map(([tag,count],i)=>{
                    const meta = THOUGHT_TAGS.find(t=>t.label===tag);
                    const pct = Math.round(count/vault.length*100);
                    return (
                      <div key={tag} style={{marginBottom:i<topTags.length-1?12:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:14}}>{meta?.emoji||"📝"}</span>
                            <span style={{fontSize:13,fontWeight:600,color:"#1E293B"}}>{tag}</span>
                          </div>
                          <span style={{fontSize:11,color:meta?.accent||"#B0B0B0",fontWeight:700}}>{count} {count===1?"entry":"entries"}</span>
                        </div>
                        <div style={{height:4,background:"#F0F0F0",borderRadius:100}}>
                          <div style={{height:"100%",width:`${pct}%`,background:meta?.accent||"#F28C8C",borderRadius:100}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{padding:"20px",background:"#FAF9F6",borderRadius:16,textAlign:"center",border:"1px solid #F0F0F0"}}>
                  <p style={{fontSize:13,color:"#A8A8B0"}}>No vault entries yet this period.</p>
                </div>
              )}
            </div>

            {/* ── SECTION 5: Activity Summary ── */}
            <div style={{marginBottom:28}}>
              <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>V. Activity Summary</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[
                  { label:"Check-ins logged", val:moodEntries.length, icon:"📊", color:"#F28C8C" },
                  { label:"Guided journals", val:journalCount, icon:"📓", color:"#B68A20" },
                  { label:"Vault entries", val:vault.length, icon:"🔒", color:"#7B3FA0" },
                ].map(({label,val,icon,color})=>(
                  <div key={label} style={{textAlign:"center",padding:"14px 8px",borderRadius:12,background:"#FAF9F6",border:"1px solid #EEEBE6"}}>
                    <span style={{fontSize:22}}>{icon}</span>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color,lineHeight:1,margin:"6px 0 3px"}}>{val}</p>
                    <p style={{fontSize:9,color:"#A8A8B0",lineHeight:1.4}}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 6: Habit Tracker ── */}
            <div style={{marginBottom:36}}>
              <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>VI. Habit Tracker</p>
              <div style={{background:"#FAF9F6",borderRadius:14,padding:"16px 18px",border:"1px solid #EEEBE6"}}>
                <div style={{display:"flex",gap:4,marginBottom:10}}>
                  <div style={{flex:"0 0 120px"}}/>
                  {["M","T","W","T","F","S","S"].map((l,i)=>(
                    <div key={i} style={{flex:1,textAlign:"center",fontSize:8,color:"#C0C0C0",fontWeight:700}}>{l}</div>
                  ))}
                  <div style={{flex:"0 0 36px",textAlign:"right",fontSize:8,color:"#C0C0C0",fontWeight:700}}>Pct</div>
                </div>
                {habitReportData.map((h,hi)=>(
                  <div key={h.name} style={{display:"flex",gap:4,alignItems:"center",marginBottom:hi<habitReportData.length-1?10:0}}>
                    <div style={{flex:"0 0 120px",display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:12}}>{h.emoji}</span>
                      <span style={{fontSize:9,color:"#1E293B",fontWeight:600,lineHeight:1.3}}>{h.name}</span>
                    </div>
                    {h.days.map((done,i)=>(
                      <div key={i} style={{
                        flex:1,height:18,borderRadius:4,
                        background:done?h.accentColor:"#EDEAE6",
                        display:"flex",alignItems:"center",justifyContent:"center",
                      }}>
                        {done&&<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    ))}
                    <div style={{flex:"0 0 36px",textAlign:"right"}}>
                      <span style={{fontSize:9,fontWeight:700,color:h.pct>=70?h.accentColor:"#A8A8B0"}}>{h.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 7: Journal Entries ── */}
            {(() => {
              // Use real vault journal entries, fall back to sample entries for preview
              const journalEntries = vault.filter(v =>
                v.type === "journal" &&
                v.situation && v.thought && v.balanced && v.situation !== v.title &&
                (selectedJournalIds.length === 0 || selectedJournalIds.includes(v.id))
              ).slice(0, 5);
              const SAMPLE_ENTRIES = [
                {
                  title:"Work Stress",
                  tag:"Work",
                  technique:"Cognitive Restructuring",
                  date:now.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}),
                  color:"#FFF3CD", accent:"#B68A20",
                  situation:"My manager sent a last-minute message before a major client pitch, pointing out errors in three of my slides. I had worked on this for a week and felt blindsided.",
                  thought:"I always mess things up right when it counts. I'm going to embarrass myself in front of the whole team and the client is going to question our credibility.",
                  evidenceFor:"There were genuine errors on three slides. My manager's tone felt sharp, which made me feel like the whole deck was a failure.",
                  evidenceAgainst:"I've led 12 successful client presentations this year without issues. My manager said the core analysis and narrative were strong — only the formatting needed fixing. I corrected everything in 20 minutes and the client gave positive feedback after the meeting.",
                  balanced:"I caught and fixed the errors before they reached the client. One difficult moment doesn't erase a year of strong work. I can use this as a reminder to build in a review buffer next time, not as evidence that I'm incompetent.",
                  distortions:["All-or-Nothing Thinking","Fortune Telling","Mental Filter"],
                },
                {
                  title:"The Stress Script",
                  tag:"Resilience",
                  technique:"Stress Inoculation Training",
                  date:now.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}),
                  color:"#EDF1F7", accent:"#4A6A9A",
                  situation:"Quarterly board review in 48 hours. I'll be presenting Q1 revenue results and the revised growth strategy to six senior leaders. The numbers are below forecast.",
                  thought:"They're going to challenge me on every assumption. I'll lose my train of thought under pressure and look like I don't know what I'm talking about.",
                  evidenceFor:"The Q1 numbers are 8% below target, which is a real weakness I need to address. I've been challenged aggressively in board meetings before.",
                  evidenceAgainst:"I know this data better than anyone in the room. I've already prepared a clear explanation for the shortfall and a credible recovery plan. The CFO reviewed my deck and called it 'thorough and honest.'",
                  balanced:"A spike of adrenaline is just my body preparing for action. I will focus on the very next sentence. If I'm challenged, that's the board doing its job — not a verdict on my capability. I have prepared well. I will walk in with my script.",
                  distortions:["Catastrophizing","Emotional Reasoning","Fortune Telling"],
                },
              ];
              const entries = journalEntries.length >= 2 ? journalEntries : SAMPLE_ENTRIES;
              const isPreview = journalEntries.length < 2;
              return (
                <div style={{marginBottom:36}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",letterSpacing:".1em",textTransform:"uppercase"}}>VII. Journal Entries</p>
                    {isPreview && <span style={{fontSize:9,color:"#C0C0C0",fontStyle:"italic"}}>sample preview</span>}
                  </div>
                  {entries.map((entry,idx)=>{
                    const e = journalEntries.length >= 2 ? {
                      title: entry.title,
                      tag: entry.tag,
                      technique: entry.technique,
                      date: entry.date || now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
                      color: (() => { const j = GUIDED_JOURNALS.find(j=>j.id===entry.journalId); return j?.color||"#F5F5F5"; })(),
                      accent: (() => { const j = GUIDED_JOURNALS.find(j=>j.id===entry.journalId); return j?.accent||"#71717A"; })(),
                      situation: entry.situation || "",
                      thought: entry.thought || "",
                      evidenceFor: entry.evidenceFor || "",
                      evidenceAgainst: entry.evidenceAgainst || "",
                      balanced: entry.balanced || "",
                      distortions: entry.distortions || [],
                    } : entry;
                    return (
                      <div key={idx} style={{marginBottom:idx<entries.length-1?16:0,background:"#FAF9F6",borderRadius:16,border:`1px solid #EEEBE6`,overflow:"hidden"}}>
                        {/* Header */}
                        <div style={{padding:"14px 18px",background:e.color,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <p style={{fontSize:13,fontWeight:700,color:e.accent}}>{e.title}</p>
                            <p style={{fontSize:10,color:e.accent,opacity:.75}}>{e.technique} · {e.date}</p>
                          </div>
                          <span style={{fontSize:10,fontWeight:700,color:e.accent,background:"rgba(255,255,255,.5)",padding:"3px 10px",borderRadius:100}}>{e.tag}</span>
                        </div>
                        {/* Content */}
                        <div style={{padding:"14px 18px"}}>
                          {e.situation && (
                            <div style={{marginBottom:10}}>
                              <p style={{fontSize:9,fontWeight:700,color:"#A8A8B0",letterSpacing:".06em",textTransform:"uppercase",marginBottom:3}}>Situation</p>
                              <p style={{fontSize:12,color:"#1E293B",lineHeight:1.6}}>{e.situation}</p>
                            </div>
                          )}
                          {e.thought && (
                            <div style={{marginBottom:10,padding:"10px 12px",background:"rgba(242,140,140,.06)",borderRadius:10,borderLeft:"3px solid rgba(242,140,140,.4)"}}>
                              <p style={{fontSize:9,fontWeight:700,color:"#A8A8B0",letterSpacing:".06em",textTransform:"uppercase",marginBottom:3}}>Automatic Thought</p>
                              <p style={{fontSize:12,color:"#1E293B",lineHeight:1.6,fontStyle:"italic"}}>"{e.thought}"</p>
                            </div>
                          )}
                          {(e.evidenceFor||e.evidenceAgainst) && (
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                              {e.evidenceFor && (
                                <div style={{padding:"8px 10px",background:"rgba(242,140,140,.05)",borderRadius:8}}>
                                  <p style={{fontSize:9,fontWeight:700,color:"#C0392B",letterSpacing:".05em",marginBottom:2}}>SUPPORTS</p>
                                  <p style={{fontSize:11,color:"#71717A",lineHeight:1.5}}>{e.evidenceFor}</p>
                                </div>
                              )}
                              {e.evidenceAgainst && (
                                <div style={{padding:"8px 10px",background:"rgba(61,154,110,.05)",borderRadius:8}}>
                                  <p style={{fontSize:9,fontWeight:700,color:"#3D9A6E",letterSpacing:".05em",marginBottom:2}}>CHALLENGES</p>
                                  <p style={{fontSize:11,color:"#71717A",lineHeight:1.5}}>{e.evidenceAgainst}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {e.balanced && (
                            <div style={{padding:"10px 12px",background:"rgba(61,154,110,.07)",borderRadius:10,borderLeft:"3px solid #3D9A6E",marginBottom:e.distortions?.length?10:0}}>
                              <p style={{fontSize:9,fontWeight:700,color:"#3D9A6E",letterSpacing:".06em",textTransform:"uppercase",marginBottom:3}}>Balanced Thought</p>
                              <p style={{fontSize:12,color:"#1E293B",lineHeight:1.6}}>{e.balanced}</p>
                            </div>
                          )}
                          {e.distortions?.length > 0 && (
                            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
                              {e.distortions.map(d=>(
                                <span key={d} style={{fontSize:9,fontWeight:600,color:e.accent,background:e.color,padding:"2px 8px",borderRadius:100}}>{d}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* ── Biological Correlation Insight ── */}
            {avgMoodScore && avgSleep && (
              <div style={{marginBottom:36,padding:"20px 22px",background:"#F0F7FF",borderRadius:16,borderLeft:"4px solid #4A6FA8"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#4A6FA8",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8}}>Biological Correlation</p>
                <p style={{fontSize:14,color:"#1E293B",lineHeight:1.75}}>
                  Your mood tends to be <strong style={{color:moodFillC(avgMoodScore)}}>{moodLabel(avgMoodScore)}</strong> on average,
                  with <strong style={{color:avgSleep>=7?"#1A6A9A":"#D4702A"}}>{avgSleep}h</strong> average sleep.
                  {avgSleep < 7
                    ? " Research links sleep under 7h to elevated anxiety — prioritising rest may improve your overall wellbeing score."
                    : " Your sleep habits are supporting good mental health outcomes. Keep this up."
                  }
                </p>
              </div>
            )}

            {/* ── FOOTER ── */}
            <div style={{borderTop:"1px solid #F0F0F0",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <p style={{fontSize:9,color:"#C0C0C0",lineHeight:1.6}}>
                  Generated by <strong>Cope</strong> · {now.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
                </p>
                <p style={{fontSize:9,color:"#C0C0C0",lineHeight:1.6}}>
                  This report is a self-logging tool and is not a clinical diagnosis.<br/>
                  If you are in distress, please contact a qualified mental health professional.
                </p>
              </div>
              <img src={COPE_LOGO} alt="cope" style={{width:28,height:28,objectFit:"contain",opacity:.4}}/>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InsightsScreen = ({ checkIns, lastMood, cycleDay, allData, setAllData, vault, userName }) => {
  const realNow = new Date();
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(false); }, []);

  /* ── State ── */
  const [range,       setRange]       = useState("1m");
  const [monthOffset, setMonthOffset] = useState(0);
  const [trendRange,  setTrendRange]  = useState("1m");
  const [calView,     setCalView]     = useState("mood"); // "mood" | "energy"
  const [hoveredPt,   setHoveredPt]   = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [shareStep,   setShareStep]   = useState(null); // null | "method" | "configure"
  const [shareMethod, setShareMethod] = useState(null); // "team" | "self" | "pdf"
  const [showReport,  setShowReport]  = useState(false);
  const [showJournalPicker, setShowJournalPicker] = useState(false);
  const [selectedJournalIds, setSelectedJournalIds] = useState([]);
  const [shareSections, setShareSections] = useState({
    moodMap: true, trendChart: true, sleepSync: true,
    cycleContext: true, thoughtRecords: false,
  });
  const [shareFrom, setShareFrom] = useState("");
  const [shareTo,   setShareTo]   = useState("");
  const toggleSection = (k) => setShareSections(prev=>({...prev,[k]:!prev[k]}));
  const openShare = () => { setShareStep("method"); setShareMethod(null); setShareFrom(""); setShareTo(""); };
  const closeShare = () => { setShareStep(null); setShareMethod(null); };

  // Entry edit state
  const [editDay,    setEditDay]    = useState(null);
  const [editEntry,  setEditEntry]  = useState(null);
  const [eScore,     setEScore]     = useState(3);    // moodScore 1-5
  const [eAnxiety,   setEAnxiety]   = useState(3);    // anxietyScore 1-5
  const [eEmotions,  setEEmotions]  = useState([]);   // string[]
  const [eSleep,     setESleep]     = useState(7);    // hours
  const [eSleepQ,    setESleepQ]    = useState(null); // 1-5
  const [eEnergy,    setEEnergy]    = useState(null); // 1-5
  const [eNote,      setENote]      = useState("");
  const [eCycle,     setECycle]     = useState(false);

  /* ── Derived ── */
  const viewDate   = new Date(realNow.getFullYear(), realNow.getMonth() + monthOffset, 1);
  const viewYear   = viewDate.getFullYear();
  const viewMonth  = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString("en-US", { month:"long", year:"numeric" });
  const monthPfx   = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-`;
  const monthData  = {};
  Object.entries(allData).forEach(([k,v]) => { if (k.startsWith(monthPfx)) monthData[parseInt(k.slice(-2))] = v; });
  const isCurrentMonth = monthOffset === 0;
  const calToday = isCurrentMonth ? realNow.getDate() : 32;

  /* ── Cycle ── */
  const cyclePhase = getCyclePhase(cycleDay);

  /* ── Trend data builder ── */
  const buildTrend = (r) => {
    const seed = [62,74,55,80,68,85,77,58,71,66,82,70,45,78,63,88,72,60,76,84,57,69,81,65,73,90,55,67,79,71,64,68,75,83,60,72];
    if (r === "7d") return MOOD_HISTORY.map(d => ({ label:d.day, score:d.score, note:d.note||null }));
    if (r === "1m") {
      const dim = new Date(realNow.getFullYear(), realNow.getMonth()+1, 0).getDate();
      return Array.from({length:dim}, (_,i) => ({ label:(i+1)%7===0||i===0?String(i+1):"", score:seed[i%seed.length], note:null }));
    }
    if (r === "3m") return Array.from({length:13},(_,i)=>({ label:i%4===0?["Jan","Feb","Mar"][Math.floor(i/4)]||"":"", score:seed[(i*3)%seed.length], note:null }));
    return [];
  };

  /* ── Habit data ── */
  const SLEEP_DATA_L = [
    { day:"Mon", hrs:6.5, mood:62, meds:true,  habits:true  },
    { day:"Tue", hrs:5.0, mood:45, meds:false, habits:true  },
    { day:"Wed", hrs:7.5, mood:71, meds:true,  habits:false },
    { day:"Thu", hrs:8.0, mood:80, meds:true,  habits:true  },
    { day:"Fri", hrs:7.0, mood:74, meds:true,  habits:true  },
    { day:"Sat", hrs:9.0, mood:88, meds:true,  habits:true  },
    { day:"Sun", hrs:7.5, mood:66, meds:false, habits:true  },
  ];
  const moodByDay = SLEEP_DATA_L.map(d=>d.mood);
  const goodSleep = SLEEP_DATA_L.filter(d=>d.hrs>=7);
  const poorSleep = SLEEP_DATA_L.filter(d=>d.hrs<7);
  const avgMoodGood = goodSleep.length ? Math.round(goodSleep.reduce((a,d)=>a+d.mood,0)/goodSleep.length) : 0;
  const avgMoodPoor = poorSleep.length ? Math.round(poorSleep.reduce((a,d)=>a+d.mood,0)/poorSleep.length) : 0;
  const avgSleep = (SLEEP_DATA_L.reduce((a,d)=>a+d.hrs,0)/SLEEP_DATA_L.length).toFixed(1);

  /* ── Energy data (from real allData, last 7 days) ── */
  const ENERGY_LABELS = ["Depleted","Low","Neutral","Good","High"];
  const ENERGY_EMOJIS = ["🪫","😓","😐","⚡","🔥"];
  const ENERGY_COLORS = ["#C0392B","#D4702A","#71717A","#7A9A30","#C8900A"];
  const energyWeekData = (() => {
    const now = realNow;
    const dow = now.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    return Array.from({length:7},(_,i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      const entry = allData[key];
      return {
        day: ["M","T","W","T","F","S","S"][i],
        energy: entry?.energyLevel || null,
        mood: entry?.moodScore || null,
        isFuture: d > now,
      };
    });
  })();
  const energyLogged = energyWeekData.filter(d=>d.energy && !d.isFuture);
  const avgEnergyWeek = energyLogged.length
    ? +(energyLogged.reduce((a,d)=>a+d.energy,0)/energyLogged.length).toFixed(1) : null;
  const avgEnergyRounded = avgEnergyWeek ? Math.round(avgEnergyWeek) : null;


  /* ── Open / save day ── */
  const openDaySheet = (d, entry) => {
    setEditDay(d); setEditEntry(entry||null);
    setEScore(entry?.moodScore || 3);
    setEAnxiety(entry?.anxietyScore || 3);
    setEEmotions(entry?.emotions || []);
    setESleep(entry?.sleepHrs || 7);
    setESleepQ(entry?.sleepQuality || null);
    setEEnergy(entry?.energyLevel || null);
    setENote(entry?.note && entry.note!=="Back-logged" ? entry.note : "");
    setECycle(entry?.cycle || false);
    setSelectedDay(d);
  };
  const saveDayEntry = () => {
    const score = [20,40,60,80,100][eScore-1];
    const key = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(editDay).padStart(2,"0")}`;
    setAllData(prev=>({...prev,[key]:{
      score, moodScore:eScore, anxietyScore:eAnxiety,
      emotions:eEmotions, sleepHrs:eSleep, sleepQuality:eSleepQ,
      energyLevel:eEnergy, note:eNote.trim()||null, cycle:eCycle
    }}));
    setEditDay(null);
  };
  const deleteDayEntry = () => {
    const key = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(editDay).padStart(2,"0")}`;
    setAllData(prev=>{const n={...prev};delete n[key];return n;});
    setEditDay(null); setSelectedDay(null);
  };

  const editDate = editDay ? new Date(viewYear, viewMonth, editDay).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}) : "";
  const selEntry = selectedDay ? monthData[selectedDay] : null;

  /* ── Trend chart helper ── */
  const trendData = buildTrend(trendRange);
  const svgW=320; const svgH=140; const pL=6; const pR=6; const pT=28; const pB=18;
  const xStep=(svgW-pL-pR)/Math.max(trendData.length-1,1);
  const yRng=svgH-pT-pB;
  const toX=i=>pL+i*xStep;
  const toY=s=>pT+yRng-(s/100)*yRng;
  const linePts=trendData.map((d,i)=>({x:toX(i),y:toY(d.score),...d}));
  // Smooth cubic bezier spline
  const spline = linePts.reduce((acc,p,i,arr)=>{
    if(i===0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    const prev=arr[i-1];
    const cp1x=(prev.x+(p.x-prev.x)/3).toFixed(1);
    const cp1y=prev.y.toFixed(1);
    const cp2x=(prev.x+2*(p.x-prev.x)/3).toFixed(1);
    const cp2y=p.y.toFixed(1);
    return `${acc} C${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  },'');
  const linePath = spline;
  const areaPath=`${linePath} L${linePts[linePts.length-1].x},${svgH-pB} L${linePts[0].x},${svgH-pB} Z`;

  // ── Energy overlay — all ranges, from real allData, scaled 1-5 → 0-100 ──
  const energyLinePts = (() => {
    const now = realNow;
    if (trendRange === "7d") {
      const dow = now.getDay();
      const mondayOffset = dow === 0 ? -6 : 1 - dow;
      return Array.from({length:7},(_,i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + i);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        const entry = allData[key];
        const lvl = entry?.energyLevel || null;
        const score = lvl ? ((lvl - 1) / 4) * 100 : null;
        return { x: toX(i), y: score !== null ? toY(score) : null, score };
      });
    }
    if (trendRange === "1m") {
      const dim = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
      return Array.from({length:dim},(_,i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), i+1);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        const entry = allData[key];
        const lvl = entry?.energyLevel || null;
        const score = lvl ? ((lvl - 1) / 4) * 100 : null;
        return { x: toX(i), y: score !== null ? toY(score) : null, score };
      });
    }
    if (trendRange === "3m") {
      return Array.from({length:13},(_,i) => {
        // Each point = roughly 7-day avg going back
        const dayOffset = (12 - i) * 7;
        const weekScores = [];
        for (let j = 0; j < 7; j++) {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset + j);
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
          const entry = allData[key];
          if (entry?.energyLevel) weekScores.push(entry.energyLevel);
        }
        const avgLvl = weekScores.length ? weekScores.reduce((a,v)=>a+v,0)/weekScores.length : null;
        const score = avgLvl ? ((avgLvl - 1) / 4) * 100 : null;
        return { x: toX(i), y: score !== null ? toY(score) : null, score };
      });
    }
    return [];
  })();
  const energySplinePts = energyLinePts.filter(p => p.score !== null);
  const energySpline = energySplinePts.length >= 2
    ? energySplinePts.reduce((acc,p,i,arr) => {
        if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        const prev = arr[i-1];
        const cp1x = (prev.x + (p.x - prev.x)/3).toFixed(1);
        const cp2x = (prev.x + 2*(p.x - prev.x)/3).toFixed(1);
        return `${acc} C${cp1x},${prev.y.toFixed(1)} ${cp2x},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }, '')
    : null;

  /* ── Trend stats ── */
  const tScores = trendData.map(d=>d.score);
  const tPeak=Math.max(...tScores), tLow=Math.min(...tScores), tAvg=Math.round(tScores.reduce((a,v)=>a+v,0)/tScores.length);

  /* ── Weekly averages ── */
  const weekAvgData = (() => {
    const now = realNow;
    const dow = now.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const weekDays = Array.from({length:7},(_,i)=>{
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + i);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    });
    const entries = weekDays.map(k => allData[k]).filter(Boolean);
    if (!entries.length) return null;
    const avgMs   = Math.min(5,Math.max(1,Math.round(entries.reduce((a,e)=>a+(e.moodScore||3),0)/entries.length)));
    const avgAx   = Math.min(5,Math.max(1,Math.round(entries.reduce((a,e)=>a+(e.anxietyScore||3),0)/entries.length)));
    const sleepE  = entries.filter(e=>e.sleepHrs);
    const avgSleep= sleepE.length ? +(sleepE.reduce((a,e)=>a+e.sleepHrs,0)/sleepE.length).toFixed(1) : null;
    const sleepQE = entries.filter(e=>e.sleepQuality);
    const avgSleepQ=sleepQE.length ? Math.round(sleepQE.reduce((a,e)=>a+e.sleepQuality,0)/sleepQE.length) : null;
    const energyE = entries.filter(e=>e.energyLevel);
    const avgEnergy=energyE.length ? Math.round(energyE.reduce((a,e)=>a+e.energyLevel,0)/energyE.length) : null;
    return { avgMs, avgAx, avgSleep, avgSleepQ, avgEnergy, count: entries.length };
  })();

  if (loading) return (
    <div className="screen active"><InsightsSkeleton/></div>
  );

  return (
    <>
      <div className="screen active">
        <div style={{ padding:"52px 24px 120px" }}>

          {/* ── Header ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
            <div>
              <h1 className="serif" style={{ fontSize:26, color:"#1E293B", marginBottom:2 }}>Your <em>Insights</em></h1>
              <p style={{ fontSize:12, color:"#A8A8B0" }}>
                {new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}
              </p>
            </div>
            <button onClick={openShare} style={{
              background:"transparent", border:"1.5px solid #E0DDD8", borderRadius:100, padding:"7px 16px",
              color:"#71717A", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6,
              fontFamily:"Jost,sans-serif", marginTop:4,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Share
            </button>
          </div>

          {/* ── Stats row ── */}
          <div className="stagger-card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <p style={{fontSize:12,fontWeight:600,color:"#A8A8B0",letterSpacing:".05em"}}>This week</p>

          </div>
          {/* ── Row 1: Mood + Anxiety ── */}
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            {/* Avg Mood */}
            <div className="card card-glass" style={{flex:1,padding:"14px 10px",display:"flex",alignItems:"center",gap:10}}>
              {weekAvgData ? (
                <>
                  <div style={{width:40,height:40,borderRadius:"50%",background:FACE_FILLS[weekAvgData.avgMs],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg viewBox="0 0 24 24" width="62%" height="62%">
                      {FACES.find(f=>f.score===weekAvgData.avgMs)?.eyes}
                      {FACES.find(f=>f.score===weekAvgData.avgMs)?.mouth}
                    </svg>
                  </div>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:FACE_FILLS[weekAvgData.avgMs]}}>{FACE_LABELS[weekAvgData.avgMs]}</p>
                    <p style={{fontSize:10,color:"#A8A8B0"}}>Avg mood</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"#F0F0F0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:18,color:"#D0D0D0"}}>—</span>
                  </div>
                  <div><p style={{fontSize:12,fontWeight:600,color:"#D0D0D0"}}>No data</p><p style={{fontSize:10,color:"#A8A8B0"}}>Avg mood</p></div>
                </>
              )}
            </div>
            {/* Avg Anxiety */}
            <div className="card card-glass" style={{flex:1,padding:"14px 10px",display:"flex",alignItems:"center",gap:10}}>
              {weekAvgData?.avgAx ? (() => {
                const axColors = ["#3D9A6E","#7A9A30","#B68A20","#D4702A","#C0392B"];
                const axLabels = ["None","Mild","Moderate","High","Severe"];
                const axEmojis = ["😌","🙂","😐","😰","😱"];
                const idx = weekAvgData.avgAx - 1;
                return <>
                  <div style={{width:40,height:40,borderRadius:"50%",background:`${axColors[idx]}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>
                    {axEmojis[idx]}
                  </div>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:axColors[idx]}}>{axLabels[idx]}</p>
                    <p style={{fontSize:10,color:"#A8A8B0"}}>Avg anxiety</p>
                  </div>
                </>;
              })() : (
                <>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"#F0F0F0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:18,color:"#D0D0D0"}}>—</span>
                  </div>
                  <div><p style={{fontSize:12,fontWeight:600,color:"#D0D0D0"}}>No data</p><p style={{fontSize:10,color:"#A8A8B0"}}>Avg anxiety</p></div>
                </>
              )}
            </div>
          </div>

          {/* ── Row 2: Sleep + Energy + Check-ins ── */}
          <div style={{ display:"flex", gap:10, marginBottom:24 }}>
            {/* Sleep */}
            <div className="card card-glass" style={{flex:1,textAlign:"center",padding:"13px 6px"}}>
              {weekAvgData?.avgSleep ? (
                <>
                  <p style={{fontSize:20,fontWeight:700,color:"#1A6A9A",fontFamily:"'Playfair Display',serif",lineHeight:1}}>{weekAvgData.avgSleep}h</p>
                  <p style={{fontSize:9,color:"#A8A8B0",marginTop:3}}>Avg sleep</p>
                  {weekAvgData.avgSleepQ && (
                    <span style={{fontSize:9,fontWeight:700,color:"#1A6A9A",marginTop:2,display:"block"}}>
                      {["😫","😔","😐","😌","😄"][weekAvgData.avgSleepQ-1]} {["Terrible","Poor","Okay","Good","Great"][weekAvgData.avgSleepQ-1]}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <p style={{fontSize:20,fontWeight:700,color:"#D0D0D0",lineHeight:1}}>—</p>
                  <p style={{fontSize:9,color:"#A8A8B0",marginTop:3}}>Avg sleep</p>
                </>
              )}
            </div>
            {/* Energy */}
            <div className="card card-glass" style={{flex:1,textAlign:"center",padding:"13px 6px"}}>
              {weekAvgData?.avgEnergy ? (
                <>
                  <p style={{fontSize:22,lineHeight:1,marginBottom:2}}>{["🪫","😓","😐","⚡","🔥"][weekAvgData.avgEnergy-1]}</p>
                  <p style={{fontSize:9,color:"#A8A8B0",marginTop:3}}>Avg energy</p>
                  <span style={{fontSize:9,fontWeight:700,color:"#D4702A",marginTop:2,display:"block"}}>
                    {["Depleted","Low","Neutral","Good","High"][weekAvgData.avgEnergy-1]}
                  </span>
                </>
              ) : (
                <>
                  <p style={{fontSize:20,fontWeight:700,color:"#D0D0D0",lineHeight:1}}>—</p>
                  <p style={{fontSize:9,color:"#A8A8B0",marginTop:3}}>Avg energy</p>
                </>
              )}
            </div>
            {/* Check-ins */}
            <div className="card card-glass" style={{flex:1,textAlign:"center",padding:"13px 6px"}}>
              <p style={{fontSize:24,fontWeight:700,color:"#1E293B",fontFamily:"'Playfair Display',serif",lineHeight:1}}>{checkIns||7}</p>
              <p style={{fontSize:9,color:"#A8A8B0",marginTop:3}}>Check-ins</p>
              <span style={{fontSize:9,color:"#F28C8C",fontWeight:700,marginTop:2,display:"block"}}>this week 🔥</span>
            </div>
          </div>

          {/* ════ SECTION 1: MAP ════ */}
          <div className="stagger-card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            {/* Mood | Energy toggle */}
            <div style={{display:"flex",background:"#F0EFEC",borderRadius:100,padding:3,gap:2}}>
              {[["mood","Mood"],["energy","Energy"]].map(([v,l])=>(
                <div key={v} onClick={()=>setCalView(v)} style={{
                  padding:"5px 14px", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer",
                  background: calView===v ? "#fff" : "transparent",
                  color: calView===v ? "#1E293B" : "#A8A8B0",
                  boxShadow: calView===v ? "0 1px 4px rgba(0,0,0,.10)" : "none",
                  transition:"all .2s cubic-bezier(.4,0,.2,1)",
                }}>{l}</div>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div onClick={()=>setMonthOffset(o=>o-1)} style={{width:26,height:26,borderRadius:"50%",background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </div>
              <span style={{fontSize:11,color:"#1E293B",fontWeight:600,minWidth:96,textAlign:"center"}}>{monthLabel}</span>
              <div onClick={()=>monthOffset<0&&setMonthOffset(o=>o+1)} style={{width:26,height:26,borderRadius:"50%",background:monthOffset<0?"#F5F5F5":"#F0F0F0",display:"flex",alignItems:"center",justifyContent:"center",cursor:monthOffset<0?"pointer":"default",opacity:monthOffset<0?1:.3}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Contextual legend */}
          <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center",
            opacity: calView === "mood" ? 1 : 0,
            height: calView === "mood" ? "auto" : 0,
            overflow:"hidden",
            transition:"opacity .25s ease, height .25s ease",
          }}>
            {[["#B8AFA8","Terrible"],["#8FAE8A","Low"],["#5A8C6A","Okay"],["#7A9A30","Good"],["#C8900A","Great"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:3}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:8,color:"#B0B0B0"}}>{l}</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"transparent",border:"1.5px solid #DDDAD6"}}/>
              <span style={{fontSize:8,color:"#B0B0B0"}}>No entry</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:18,height:8,borderRadius:100,background:"rgba(242,140,140,.2)"}}/>
              <span style={{fontSize:8,color:"#B0B0B0"}}>Period days</span>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap",alignItems:"center",
            opacity: calView === "energy" ? 1 : 0,
            height: calView === "energy" ? "auto" : 0,
            overflow:"hidden",
            transition:"opacity .25s ease, height .25s ease",
          }}>
            {[["#CC7E85","Depleted"],["#E9A178","Low"],["#D1D5DB","Neutral"],["#86A789","Good"],["#D4A017","High"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:3}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:8,color:"#B0B0B0"}}>{l}</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"transparent",border:"1.5px solid #DDDAD6"}}/>
              <span style={{fontSize:8,color:"#B0B0B0"}}>No entry</span>
            </div>
          </div>

          <div className="card" style={{marginBottom:6,padding:"16px 12px",transition:"background .25s ease"}}>
            <MoodCalendar monthData={monthData} viewYear={viewYear} viewMonth={viewMonth} today={calToday}
              onDayTap={(d,entry)=>openDaySheet(d,entry)} mode={calView} />
            <p style={{fontSize:10,color:"#A8A8B0",textAlign:"center",marginTop:10}}>
              {calView === "mood" ? "Tap any day to log or edit · cycle shown as pink track" : "Tap any day to log or edit · energy levels shown as fill color"}
            </p>
          </div>

          {/* Selected day detail inline */}
          {selectedDay && selEntry && (
            <div className="card" style={{marginBottom:6,padding:"14px 16px",background:"rgba(242,140,140,.04)",border:"1px solid rgba(242,140,140,.15)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <p style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>
                  {new Date(viewYear,viewMonth,selectedDay).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                </p>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {selEntry.cycle && <span style={{fontSize:10}}>🌙</span>}
                  {selEntry.moodScore && (
                    <div style={{width:28,height:28,borderRadius:"50%",background:FACE_FILLS[selEntry.moodScore],display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <svg viewBox="0 0 24 24" width="65%" height="65%">
                        {FACES.find(f=>f.score===selEntry.moodScore)?.eyes}
                        {FACES.find(f=>f.score===selEntry.moodScore)?.mouth}
                      </svg>
                    </div>
                  )}
                  <span style={{fontSize:12,fontWeight:700,color:selEntry.moodScore?FACE_FILLS[selEntry.moodScore]:"#B0B0B0"}}>{selEntry.moodScore?FACE_LABELS[selEntry.moodScore]:""}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                {selEntry.sleepHrs && <span style={{fontSize:10,color:"#71717A",background:"#F5F5F5",padding:"2px 8px",borderRadius:100}}>😴 {selEntry.sleepHrs}h sleep</span>}
                {selEntry.energyLevel && <span style={{fontSize:10,color:"#71717A",background:"#F5F5F5",padding:"2px 8px",borderRadius:100}}>{["🪫","😓","😐","⚡","🔥"][selEntry.energyLevel-1]} energy</span>}
                {selEntry.anxietyScore && <span style={{fontSize:10,color:"#71717A",background:"#F5F5F5",padding:"2px 8px",borderRadius:100}}>anxiety {selEntry.anxietyScore}/5</span>}
              </div>
              {selEntry.emotions?.length>0 && <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>{selEntry.emotions.slice(0,4).map(e=><span key={e} style={{fontSize:10,color:"#F28C8C",background:"rgba(242,140,140,.1)",padding:"2px 8px",borderRadius:100}}>{e}</span>)}</div>}
              {selEntry.note && <p style={{fontSize:12,color:"#71717A",marginTop:2}}>{selEntry.note}</p>}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button onClick={()=>openDaySheet(selectedDay,selEntry)} style={{flex:1,padding:"8px",background:"linear-gradient(180deg,#F28C8C 0%,#E06B6B 100%)",border:"none",borderRadius:10,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Edit</button>
                <button onClick={()=>setSelectedDay(null)} style={{padding:"8px 16px",background:"#F5F5F5",border:"none",borderRadius:10,color:"#71717A",fontSize:12,cursor:"pointer"}}>Dismiss</button>
              </div>
            </div>
          )}

          <div style={{height:24}}/>

          {/* ════ SECTION 2: TREND CHART ════ */}
          <div className="stagger-card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:12,fontWeight:600,color:"#A8A8B0",letterSpacing:".05em"}}>Trend</p>
            <div style={{display:"flex",gap:3,background:"#F5F5F5",borderRadius:100,padding:"3px"}}>
              {[["7d","7D"],["1m","1M"],["3m","3M"]].map(([v,l])=>(
                <div key={v} onClick={()=>{setTrendRange(v);setHoveredPt(null);}} style={{
                  padding:"4px 11px",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer",
                  background:trendRange===v?"#fff":"transparent",
                  color:trendRange===v?"#222222":"#B0B0B0",
                  boxShadow:trendRange===v?"0 1px 4px rgba(0,0,0,.1)":"none",
                  transition:"all .18s",
                }}>{l}</div>
              ))}
            </div>
          </div>

          <div className="card" style={{marginBottom:8,padding:"16px 14px 10px"}}>
            <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{overflow:"visible"}}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F28C8C" stopOpacity=".20"/>
                  <stop offset="80%" stopColor="#F28C8C" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A017" stopOpacity=".15"/>
                  <stop offset="100%" stopColor="#D4A017" stopOpacity="0"/>
                </linearGradient>
                <clipPath id="tClip"><rect x={pL} y={0} width={svgW-pL-pR} height={svgH}/></clipPath>
              </defs>
              {/* Zone bands */}
              <rect x={pL} y={pT} width={svgW-pL-pR} height={toY(75)-pT} fill="rgba(149,201,165,.08)" clipPath="url(#tClip)"/>
              <rect x={pL} y={toY(75)} width={svgW-pL-pR} height={toY(45)-toY(75)} fill="rgba(240,240,240,.12)" clipPath="url(#tClip)"/>
              <rect x={pL} y={toY(45)} width={svgW-pL-pR} height={svgH-pB-toY(45)} fill="rgba(245,199,106,.08)" clipPath="url(#tClip)"/>
              {/* Grid lines */}
              {[25,50,75].map(v=>{const yy=toY(v);return <line key={v} x1={pL} y1={yy} x2={svgW-pR} y2={yy} stroke="#EDEAE6" strokeWidth="1" strokeDasharray="4 3"/>;} )}
              {/* Mood area + line */}
              <path d={areaPath} fill="url(#moodGrad)" clipPath="url(#tClip)"/>
              <path d={linePath} fill="none" stroke="#F28C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Energy line — scaled 1-5 → 0-100, only 7d */}
              {energySpline && <>
                <path d={`${energySpline} L${energySplinePts[energySplinePts.length-1].x},${svgH-pB} L${energySplinePts[0].x},${svgH-pB} Z`}
                  fill="url(#energyGrad)" clipPath="url(#tClip)"/>
                <path d={energySpline} fill="none" stroke="#D4A017" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </>}
              {/* Hover crosshair */}
              {hoveredPt!==null&&<line x1={linePts[hoveredPt].x} y1={pT} x2={linePts[hoveredPt].x} y2={svgH-pB} stroke="#D0D0D0" strokeWidth="1" strokeDasharray="3 3"/>}
              {/* Tap targets + dots on hover */}
              {linePts.map((p,i)=>(
                <g key={i} style={{cursor:"pointer"}}
                  onMouseEnter={()=>setHoveredPt(i)} onMouseLeave={()=>setHoveredPt(null)}
                  onClick={()=>setHoveredPt(hp=>hp===i?null:i)}>
                  <circle cx={p.x} cy={p.y} r={12} fill="transparent"/>
                  {(hoveredPt===i||p.note) && <>
                    {p.note&&<circle cx={p.x} cy={p.y} r={9} fill="rgba(245,199,106,.2)"/>}
                    <circle cx={p.x} cy={p.y} r={hoveredPt===i?5:3.5} fill={p.note?"#F5C76A":"#F28C8C"} stroke="#fff" strokeWidth="2"/>
                    {energyLinePts[i]?.score!=null && <circle cx={p.x} cy={energyLinePts[i].y} r={4} fill="#D4A017" stroke="#fff" strokeWidth="2"/>}
                  </>}
                </g>
              ))}
              {/* Tooltip */}
              {hoveredPt!==null&&(()=>{
                const p=linePts[hoveredPt];
                const ep=energyLinePts[hoveredPt];
                const tx=Math.min(Math.max(p.x-32,0),svgW-70);
                const hasE = ep?.score!=null;
                const boxH = hasE ? 38 : 26;
                return <g>
                  <rect x={tx} y={p.y-boxH-6} width={66} height={boxH} rx={7} fill="#1E293B" opacity=".9"/>
                  <text x={tx+33} y={p.y-boxH+6} textAnchor="middle" fontSize="8.5" fill="#A8A8B0" fontFamily="Jost">{trendData[hoveredPt].label||`#${hoveredPt+1}`}</text>
                  <text x={tx+33} y={p.y-boxH+17} textAnchor="middle" fontSize="10" fontWeight="700" fill="#F28C8C" fontFamily="Jost">● {trendData[hoveredPt].score} mood</text>
                  {hasE&&<text x={tx+33} y={p.y-boxH+28} textAnchor="middle" fontSize="10" fontWeight="700" fill="#D4A017" fontFamily="Jost">● {["Dep","Low","Neu","Good","High"][Math.round(((ep.score/100)*4))]} energy</text>}
                </g>;
              })()}
              {/* Date labels */}
              {trendData.map((d,i)=>d.label?<text key={i} x={toX(i)} y={svgH} textAnchor="middle" fontSize="9.5" fill="#B0B0B0" fontFamily="Jost">{d.label}</text>:null)}
            </svg>
            {/* Legend */}
            <div style={{display:"flex",gap:16,padding:"8px 0 2px",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:16,height:2,borderRadius:1,background:"#F28C8C"}}/>
                <span style={{fontSize:9,color:"#A8A8B0"}}>Mood</span>
              </div>
              {energySpline&&(
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:16,height:2,borderRadius:1,background:"#D4A017"}}/>
                  <span style={{fontSize:9,color:"#A8A8B0"}}>Energy</span>
                </div>
              )}
            </div>
            {/* Stats strip */}
            <div style={{display:"flex",gap:0,paddingTop:8,borderTop:"1px solid #F5F5F5",marginTop:2}}>
              {[["↑","Peak",tPeak],["~","Avg",tAvg],["↓","Low",tLow]].map(([s,l,v])=>(
                <div key={l} style={{flex:1,textAlign:"center"}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>{s} {v}</p>
                  <p style={{fontSize:9,color:"#A8A8B0",marginTop:2}}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{height:24}}/>

          {/* ════ SECTION 3: BIOPHYSICAL INSIGHTS ════ */}
          <p style={{fontSize:12,fontWeight:600,color:"#A8A8B0",letterSpacing:".05em",marginBottom:12}}>Biophysical insights</p>

          {/* Sleep Sync card */}
          <div className="card" style={{marginBottom:12,padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:12,background:"rgba(168,213,194,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🌙</div>
                <div>
                  <p style={{fontSize:14,fontWeight:700,color:"#1E293B"}}>Sleep Sync</p>
                  <p style={{fontSize:11,color:"#A8A8B0"}}>Avg {avgSleep}h · +{avgMoodGood-avgMoodPoor} pts on 7h+ nights</p>
                </div>
              </div>
              <span style={{fontSize:20,fontWeight:700,color:"#3D9A6E",fontFamily:"'Playfair Display',serif"}}>{avgSleep}h</span>
            </div>
            {/* Sleep bar chart */}
            <div style={{display:"flex",gap:5,alignItems:"flex-end",height:48,marginBottom:6}}>
              {SLEEP_DATA_L.map((d,i)=>{
                const h=d.hrs; const maxH=10; const barH=Math.round((h/maxH)*44);
                // Muted coral scale: ≥7h deep coral · 6-7h soft coral · <6h blush
                const col=h>=7?"#D4866E":h>=6?"#E8A99A":"#F4C8C0";
                return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{width:"100%",height:barH,borderRadius:"4px 4px 0 0",background:col}}/>
                  <span style={{fontSize:8,color:"#A8A8B0"}}>{d.day[0]}</span>
                </div>;
              })}
            </div>
            <div style={{display:"flex",gap:10}}>
              {[["#D4866E","7h+  Good"],["#E8A99A","6–7h  OK"],["#F4C8C0","<6h  Low"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:8,height:8,borderRadius:2,background:c}}/>
                  <span style={{fontSize:9,color:"#A8A8B0"}}>{l}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Cycle Context card */}
          <div className="card" style={{marginBottom:12,padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:12,background:"rgba(242,140,140,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                  {cyclePhase?cyclePhase.emoji:"🌙"}
                </div>
                <div>
                  <p style={{fontSize:14,fontWeight:700,color:"#1E293B"}}>Cycle Context</p>
                  <p style={{fontSize:11,color:"#A8A8B0"}}>{cyclePhase?`${cyclePhase.name} · Day ${cycleDay}`:"No cycle logged"}</p>
                </div>
              </div>
              {cycleDay&&<span style={{fontSize:11,color:"#A8A8B0",background:"#F5F5F5",padding:"3px 10px",borderRadius:100}}>Day {cycleDay}</span>}
            </div>
            {cyclePhase ? (
              <>
                <p style={{fontSize:12,color:"#71717A",lineHeight:1.6,marginBottom:12}}>{cyclePhase.note}</p>
                {/* 28-day phase bar */}
                <div style={{position:"relative",height:14,borderRadius:100,background:"#F0F0F0",overflow:"hidden",marginBottom:8}}>
                  {CYCLE_PHASES_I.map(p=>{
                    const start=(p.days[0]-1)/28*100;
                    const width=p.days.length/28*100;
                    return <div key={p.name} style={{position:"absolute",left:`${start}%`,width:`${width}%`,height:"100%",background:p.color,opacity:.4}}/>;
                  })}
                  <div style={{position:"absolute",left:`${(cycleDay-1)/28*100}%`,top:0,width:3,height:"100%",background:cyclePhase.color,borderRadius:2}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  {CYCLE_PHASES_I.map(p=><span key={p.name} style={{fontSize:9,color:"#A8A8B0"}}>{p.emoji} {p.name}</span>)}
                </div>
              </>
            ) : (
              <p style={{fontSize:12,color:"#A8A8B0",lineHeight:1.5}}>
                Tag cycle days on the Mood Map to see hormonal context here. Your care team uses this to distinguish biological shifts from psychological triggers.
              </p>
            )}
          </div>

          <div style={{height:24}}/>

          {/* ════ SECTION 4: HABIT TRACKER ════ */}
          <p style={{fontSize:12,fontWeight:600,color:"#A8A8B0",letterSpacing:".05em",marginBottom:12}}>This week's habits</p>
          <div className="card" style={{marginBottom:12,padding:"0 20px"}}>
            {HABIT_IMPACT_CONFIG.map((h, hi) => (
              <div key={h.name} style={{paddingTop:14,paddingBottom:14,borderBottom:hi<HABIT_IMPACT_CONFIG.length-1?"1px solid #F5F5F5":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:32,height:32,borderRadius:10,background:`${h.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{h.emoji}</div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:600,color:"#1E293B"}}>{h.name}</p>
                    <p style={{fontSize:10,color:"#A8A8B0"}}>{h.days.filter(Boolean).length}/7 days this week</p>
                  </div>
                  <div style={{width:36,height:36,position:"relative",flexShrink:0}}>
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F0F0F0" strokeWidth="3.5"/>
                      <circle cx="18" cy="18" r="14" fill="none" stroke={h.accentColor} strokeWidth="3.5"
                        strokeDasharray={`${2*Math.PI*14}`}
                        strokeDashoffset={`${2*Math.PI*14*(1-h.days.filter(Boolean).length/7)}`}
                        strokeLinecap="round" transform="rotate(-90 18 18)"/>
                    </svg>
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:9,fontWeight:700,color:h.accentColor}}>{Math.round(h.days.filter(Boolean).length/7*100)}%</span>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:4}}>
                  {["M","T","W","T","F","S","S"].map((day,i)=>(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{width:"100%",aspectRatio:1,borderRadius:6,background:h.days[i]?h.color:"rgba(0,0,0,.05)",
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {h.days[i] && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={h.accentColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span style={{fontSize:8,color:"#C0C0C0"}}>{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Day entry/edit sheet ── */}
      {editDay&&(
        <div className="overlay-enter" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"flex-end"}} onClick={()=>setEditDay(null)}>
          <div className="sheet-enter glass" style={{width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"24px 24px 0 0",padding:"20px 24px 48px",maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"#E0E0E0",borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <p style={{fontSize:10,color:"#A8A8B0",textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{editEntry?"Edit entry":"Log entry"}</p>
                <h2 className="serif" style={{fontSize:18,color:"#1E293B"}}><em>{editDate}</em></h2>
              </div>
              {editEntry&&<button onClick={deleteDayEntry} style={{background:"none",border:"1px solid #FFE0E0",borderRadius:10,padding:"5px 12px",fontSize:11,color:"#F28C8C",cursor:"pointer"}}>Delete</button>}
            </div>

            {/* Mood */}
            <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".05em",textTransform:"uppercase",marginBottom:10}}>Mood</p>
            <div style={{display:"flex",justifyContent:"space-between",gap:6,marginBottom:18}}>
              {FACES.map(f=>{
                const on=eScore===f.score;
                return <div key={f.score} onClick={()=>setEScore(f.score)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
                  <div style={{width:"100%",aspectRatio:1,borderRadius:"50%",background:on?f.fill:f.bg,display:"flex",alignItems:"center",justifyContent:"center",transform:on?"scale(1.12)":"scale(1)",transition:"all .2s cubic-bezier(.34,1.56,.64,1)",boxShadow:on?`0 4px 14px ${f.fill}55`:"none"}}>
                    <svg viewBox="0 0 24 24" width="65%" height="65%">{f.eyes}{f.mouth}{f.tear}</svg>
                  </div>
                  <span style={{fontSize:8,color:on?f.fill:"#B0B0B0",fontWeight:on?700:400}}>{f.label}</span>
                </div>;
              })}
            </div>

            {/* Anxiety */}
            <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".05em",textTransform:"uppercase",marginBottom:8}}>Anxiety Level</p>
            <div style={{marginBottom:18}}>
              <input type="range" min="1" max="5" step="1" value={eAnxiety} onChange={e=>setEAnxiety(+e.target.value)}
                className="g-slider" style={{"--v":`${(eAnxiety-1)/4*100}%`,width:"100%"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:9,color:"#A8A8B0"}}>None</span>
                <span style={{fontSize:9,color:"#F28C8C",fontWeight:700}}>
                  {["None","Mild","Moderate","High","Severe"][eAnxiety-1]}
                </span>
                <span style={{fontSize:9,color:"#A8A8B0"}}>Severe</span>
              </div>
            </div>

            {/* Emotions */}
            <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".05em",textTransform:"uppercase",marginBottom:8}}>Emotions</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:18}}>
              {["Anxious","Sad","Angry","Overwhelmed","Hopeless","Guilty","Fearful","Lonely","Tired","Numb","Hopeful","Grateful","Peaceful","Grounded","Motivated"].map(e=>{
                const on=eEmotions.includes(e);
                return <div key={e} onClick={()=>setEEmotions(prev=>on?prev.filter(x=>x!==e):[...prev,e])}
                  style={{padding:"6px 13px",borderRadius:100,fontSize:12,fontWeight:500,cursor:"pointer",userSelect:"none",
                    background:on?"#F28C8C":"#F2F2F2",color:on?"#fff":"#717171",
                    transition:"all .18s cubic-bezier(.34,1.56,.64,1)",transform:on?"scale(1.04)":"scale(1)"}}>
                  {e}
                </div>;
              })}
            </div>

            {/* Sleep */}
            <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".05em",textTransform:"uppercase",marginBottom:6}}>Sleep</p>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
              <span style={{fontSize:26,fontWeight:700,color:"#3D7A5E",fontFamily:"'Playfair Display',serif",minWidth:42}}>{eSleep}h</span>
              <input type="range" min="3" max="12" step="0.5" value={eSleep} onChange={e=>setESleep(+e.target.value)}
                className="g-slider" style={{"--v":`${((eSleep-3)/9*100).toFixed(1)}%`,flex:1}}/>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:18}}>
              {[["😫","Terrible"],["😔","Poor"],["😐","Okay"],["😌","Good"],["😄","Great"]].map(([em,label],i)=>{
                const on=eSleepQ===i+1;
                return <div key={i} onClick={()=>setESleepQ(i+1)} style={{flex:1,textAlign:"center",cursor:"pointer",
                  padding:"8px 0",borderRadius:12,fontSize:18,
                  background:on?"rgba(242,140,140,.08)":"#F5F5F5",
                  border:`1.5px solid ${on?"#F28C8C":"transparent"}`,
                  transform:on?"scale(1.06)":"scale(1)",transition:"all .18s cubic-bezier(.34,1.56,.64,1)"}}>
                  <div>{em}</div>
                  <div style={{fontSize:8,color:on?"#F28C8C":"#B0B0B0",fontWeight:600,marginTop:3}}>{label}</div>
                </div>;
              })}
            </div>

            {/* Energy */}
            <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".05em",textTransform:"uppercase",marginBottom:8}}>Energy</p>
            <div style={{display:"flex",gap:6,marginBottom:18}}>
              {[["🪫","Depleted"],["😓","Low"],["😐","Neutral"],["⚡","Good"],["🔥","High"]].map(([em,label],i)=>{
                const on=eEnergy===i+1;
                return <div key={i} onClick={()=>setEEnergy(i+1)} style={{flex:1,textAlign:"center",cursor:"pointer",
                  padding:"10px 0",borderRadius:12,fontSize:20,
                  background:on?"rgba(242,140,140,.08)":"#F5F5F5",
                  border:`1.5px solid ${on?"#F28C8C":"transparent"}`,
                  transform:on?"scale(1.06)":"scale(1)",transition:"all .18s cubic-bezier(.34,1.56,.64,1)"}}>
                  <div>{em}</div>
                  <div style={{fontSize:8,color:on?"#F28C8C":"#B0B0B0",fontWeight:600,marginTop:3}}>{label}</div>
                </div>;
              })}
            </div>

            {/* Notes */}
            <input placeholder="Add a note (optional)..." value={eNote} onChange={e=>setENote(e.target.value)}
              style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"1.5px solid #F0F0F0",fontSize:13,color:"#1E293B",background:"#FAF9F6",outline:"none",fontFamily:"Jost,sans-serif",boxSizing:"border-box",marginBottom:12}}/>

            {/* Cycle toggle */}
            <div onClick={()=>setECycle(b=>!b)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:12,marginBottom:18,cursor:"pointer",background:eCycle?"rgba(242,140,140,.06)":"#F9F9F9",border:eCycle?"1px solid rgba(242,140,140,.25)":"1px solid #F0F0F0",transition:"all .2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🌙</span>
                <div><p style={{fontSize:12,fontWeight:600,color:"#1E293B"}}>Cycle / Period day</p><p style={{fontSize:10,color:"#71717A",marginTop:1}}>Tag for cycle context</p></div>
              </div>
              <div style={{width:38,height:20,borderRadius:100,background:eCycle?"#F28C8C":"#E0E0E0",position:"relative",transition:"background .2s",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:eCycle?20:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
              </div>
            </div>

            <button className="btn btn-p" onClick={saveDayEntry} style={{fontSize:15,padding:"14px"}}>{editEntry?"Update Entry":"Save Entry"}</button>
          </div>
        </div>
      )}


      {/* ── Insight Report Modal ── */}
      {showReport && (
        <InsightReport
          allData={allData}
          vault={vault}
          checkIns={checkIns}
          userName={userName}
          selectedJournalIds={selectedJournalIds}
          onClose={()=>setShowReport(false)}
        />
      )}

      {/* ── Journal Picker Modal ── */}
      {showJournalPicker && (() => {
        const journalEntries = vault.filter(v => v.type === "journal");
        const toggle = (id) => setSelectedJournalIds(prev =>
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
        const allSelected = journalEntries.length > 0 && journalEntries.every(v => selectedJournalIds.includes(v.id));
        const toggleAll = () => setSelectedJournalIds(allSelected ? [] : journalEntries.map(v => v.id));
        return (
          <div className="overlay-enter" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"flex-end"}}
            onClick={()=>setShowJournalPicker(false)}>
            <div className="sheet-enter glass" style={{width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"24px 24px 0 0",maxHeight:"88vh",display:"flex",flexDirection:"column",paddingBottom:0}}
              onClick={e=>e.stopPropagation()}>

              {/* Handle */}
              <div style={{width:36,height:4,borderRadius:2,background:"rgba(0,0,0,.12)",margin:"14px auto 0"}}/>

              {/* Header */}
              <div style={{padding:"18px 22px 14px",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                <p style={{fontSize:16,fontWeight:700,color:"#1E293B",marginBottom:3}}>Include Journal Entries</p>
                <p style={{fontSize:12,color:"#A8A8B0"}}>Choose which entries appear in the PDF report.</p>
              </div>

              {/* Select All row */}
              {journalEntries.length > 0 && (
                <div onClick={toggleAll} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 22px",cursor:"pointer",background:"rgba(242,140,140,.04)",borderBottom:"1px solid rgba(0,0,0,.05)"}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#71717A"}}>Select all</span>
                  <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${allSelected?"#F28C8C":"#D0CCC8"}`,background:allSelected?"#F28C8C":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                    {allSelected && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              )}

              {/* Entry list */}
              <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
                {journalEntries.length === 0 ? (
                  <div style={{padding:"40px 22px",textAlign:"center"}}>
                    <p style={{fontSize:32,marginBottom:10}}>📓</p>
                    <p style={{fontSize:14,fontWeight:600,color:"#1E293B",marginBottom:6}}>No journal entries yet</p>
                    <p style={{fontSize:12,color:"#A8A8B0",lineHeight:1.6}}>Complete a guided journal session and it will appear here for you to include in your report.</p>
                  </div>
                ) : (
                  journalEntries.map((entry, i) => {
                    const jMeta = GUIDED_JOURNALS.find(j => j.id === entry.journalId);
                    const isChecked = selectedJournalIds.includes(entry.id);
                    const entryDate = entry.date ? new Date(entry.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}) : "—";
                    return (
                      <div key={entry.id} onClick={() => toggle(entry.id)}
                        style={{display:"flex",alignItems:"center",gap:14,padding:"14px 22px",borderBottom:i < journalEntries.length-1?"1px solid rgba(0,0,0,.05)":"none",cursor:"pointer",background:isChecked?"rgba(242,140,140,.04)":"transparent",transition:"background .12s"}}>
                        {/* Colour swatch */}
                        <div style={{width:40,height:40,borderRadius:12,background:jMeta?.color||"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                          {jMeta?.emoji||"📝"}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:13,fontWeight:600,color:"#1E293B",marginBottom:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{entry.title || jMeta?.title || "Journal Entry"}</p>
                          <p style={{fontSize:11,color:"#A8A8B0"}}>{jMeta?.tag||"General"} · {entryDate}</p>
                          {entry.situation && <p style={{fontSize:11,color:"#71717A",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontStyle:"italic"}}>"{entry.situation}"</p>}
                        </div>
                        {/* Checkbox */}
                        <div style={{width:22,height:22,borderRadius:7,border:`2px solid ${isChecked?"#F28C8C":"#D0CCC8"}`,background:isChecked?"#F28C8C":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                          {isChecked && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l4 4 6-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer CTA */}
              <div style={{padding:"16px 22px 36px",borderTop:"1px solid rgba(0,0,0,.07)",background:"rgba(255,255,255,.95)"}}>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setShowJournalPicker(false)}
                    style={{flex:1,padding:"13px",borderRadius:14,border:"1.5px solid #E0DDD8",background:"transparent",fontSize:14,fontWeight:600,color:"#71717A",cursor:"pointer"}}>
                    Cancel
                  </button>
                  <button onClick={()=>{ setShowJournalPicker(false); setShowReport(true); }}
                    style={{flex:2,padding:"13px",borderRadius:14,border:"none",background:"#F28C8C",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Generate Report
                    {selectedJournalIds.length > 0 && <span style={{background:"rgba(255,255,255,.3)",borderRadius:20,padding:"1px 7px",fontSize:12}}>{selectedJournalIds.length}</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Share Sheet ── */}
      {shareStep && (
        <div className="overlay-enter" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"flex-end"}}
          onClick={closeShare}>
          <div className="sheet-enter glass" style={{width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"24px 24px 0 0",maxHeight:"92vh",overflowY:"auto",paddingBottom:48}}
            onClick={e=>e.stopPropagation()}>

            {/* Handle + nav */}
            <div style={{padding:"20px 24px 0"}}>
              <div style={{width:40,height:4,background:"#E0E0E0",borderRadius:2,margin:"0 auto 16px"}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                {shareStep==="configure" && (
                  <div onClick={()=>setShareStep("method")} style={{width:32,height:32,borderRadius:"50%",background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </div>
                )}
                <div>
                  <h2 className="serif" style={{fontSize:20,color:"#1E293B"}}>
                    <em>{shareStep==="method" ? "Share Report" : "Customise Report"}</em>
                  </h2>
                  <p style={{fontSize:11,color:"#A8A8B0",marginTop:2}}>
                    {shareStep==="method" ? "Choose how to send your insights" : `Sending to ${shareMethod==="team"?"Care Team":"Myself"}`}
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div style={{display:"flex",gap:6,marginBottom:24}}>
                {["Method","Customise","Send"].map((l,i)=>{
                  const done = (shareStep==="method"&&i===0)||(shareStep==="configure"&&i<=1);
                  const active = (shareStep==="method"&&i===0)||(shareStep==="configure"&&i===1);
                  return <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:done?"#F28C8C":"#F0F0F0",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:9,color:done?"#fff":"#B0B0B0",fontWeight:700}}>{i+1}</span>
                    </div>
                    <span style={{fontSize:9,color:active?"#222222":"#B0B0B0",fontWeight:active?600:400}}>{l}</span>
                    {i<2&&<div style={{width:16,height:1,background:"#E8E8E8"}}/>}
                  </div>;
                })}
              </div>
            </div>

            <div style={{padding:"0 24px"}}>

              {/* ── STEP 1: Method ── */}
              {shareStep==="method" && (
                <>
                  {[
                    {id:"team", icon:"👨‍⚕️", label:"Send to Care Team",  sub:"Email or message your therapist directly"},
                    {id:"self", icon:"📧",   label:"Send to Myself",      sub:"Save a copy to your inbox"},
                    {id:"pdf",  icon:"📄",   label:"Download PDF",        sub:"Save offline to Files or Drive"},
                  ].map(({id,icon,label,sub})=>(
                    <div key={id} onClick={()=>{
                        if(id==="pdf"){
                          closeShare();
                          const journalEntries = vault.filter(v=>v.type==="journal");
                          setSelectedJournalIds(journalEntries.map(v=>v.id));
                          setShowJournalPicker(true);
                          return;
                        }
                        setShareMethod(id); setShareStep("configure");
                      }}
                      style={{display:"flex",alignItems:"center",gap:14,padding:"16px 0",borderBottom:"1px solid #F5F5F5",cursor:"pointer"}}>
                      <div style={{width:44,height:44,borderRadius:14,background:"rgba(242,140,140,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
                      <div style={{flex:1}}>
                        <p style={{fontSize:14,fontWeight:600,color:"#1E293B"}}>{label}</p>
                        <p style={{fontSize:11,color:"#A8A8B0",marginTop:2}}>{sub}</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  ))}
                  <button onClick={closeShare} style={{width:"100%",marginTop:16,background:"none",border:"none",fontSize:13,color:"#A8A8B0",cursor:"pointer",padding:"10px"}}>Cancel</button>
                </>
              )}

              {/* ── STEP 2: Configure ── */}
              {shareStep==="configure" && (
                <>
                  {/* What to include */}
                  <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".06em",textTransform:"uppercase",marginBottom:14}}>What to include</p>
                  <div className="card" style={{marginBottom:20,padding:"0 16px"}}>
                    {[
                      {key:"moodMap",       emoji:"🗓",  label:"Mood Map",          sub:"Monthly calendar overview"},
                      {key:"trendChart",    emoji:"📈",  label:"Trend Chart",        sub:"Mood score over time"},
                      {key:"sleepSync",     emoji:"🌙",  label:"Sleep Sync",         sub:"Sleep & mood correlation"},
                      {key:"cycleContext",  emoji:"🌕",  label:"Cycle Context",      sub:"Hormonal phase data"},
                      {key:"thoughtRecords",emoji:"📝",  label:"Thought Records",    sub:"CBT reflection entries"},
                    ].map(({key,emoji,label,sub},i,arr)=>(
                      <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:i<arr.length-1?"1px solid #F8F8F8":"none"}}>
                        <div style={{width:34,height:34,borderRadius:10,background:"rgba(242,140,140,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{emoji}</div>
                        <div style={{flex:1}}>
                          <p style={{fontSize:13,fontWeight:600,color:"#1E293B"}}>{label}</p>
                          <p style={{fontSize:11,color:"#A8A8B0",marginTop:1}}>{sub}</p>
                        </div>
                        <div onClick={()=>toggleSection(key)} style={{width:42,height:24,borderRadius:100,background:shareSections[key]?"#F28C8C":"#E0E0E0",position:"relative",transition:"background .2s",cursor:"pointer",flexShrink:0}}>
                          <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:shareSections[key]?20:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time period */}
                  <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Time Period</p>
                  <p style={{fontSize:11,color:"#A8A8B0",marginBottom:14}}>Select a date range to include in the report</p>
                  <div style={{display:"flex",gap:8,marginBottom:14}}>
                    {[["7d","Last 7 days"],["1m","Last month"],["3m","Last 3 months"],["custom","Custom"]].map(([v,l])=>(
                      <div key={v} onClick={()=>setShareFrom(v)}
                        style={{flex:1,padding:"9px 4px",borderRadius:12,border:shareFrom===v?"1.5px solid #F28C8C":"1.5px solid #F0F0F0",background:shareFrom===v?"rgba(242,140,140,.06)":"#fff",textAlign:"center",cursor:"pointer",transition:"all .15s"}}>
                        <p style={{fontSize:10,fontWeight:700,color:shareFrom===v?"#F28C8C":"#717171"}}>{l}</p>
                      </div>
                    ))}
                  </div>

                  {shareFrom==="custom" && (
                    <div style={{display:"flex",gap:10,marginBottom:16}}>
                      {[["From","shareFrom"],["To","shareTo"]].map(([label])=>(
                        <div key={label} style={{flex:1}}>
                          <p style={{fontSize:10,color:"#A8A8B0",marginBottom:5,fontWeight:600}}>{label}</p>
                          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:12,border:"1.5px solid #F0F0F0",background:"#FAF9F6"}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span style={{fontSize:12,color:"#A8A8B0"}}>Select date</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary of selections */}
                  <div style={{padding:"12px 14px",borderRadius:14,background:"rgba(242,140,140,.05)",border:"1px solid rgba(242,140,140,.12)",marginBottom:20}}>
                    <p style={{fontSize:11,color:"#71717A",lineHeight:1.6}}>
                      <strong style={{color:"#1E293B"}}>{Object.values(shareSections).filter(Boolean).length} sections</strong> selected
                      {shareFrom ? ` · ${shareFrom==="7d"?"Last 7 days":shareFrom==="1m"?"Last month":shareFrom==="3m"?"Last 3 months":"Custom range"}` : " · No time range set"}
                    </p>
                  </div>

                  <button className="btn btn-p" onClick={closeShare}
                    style={{fontSize:15,padding:"15px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                    {shareMethod==="team" ? "Send to Care Team" : "Send to Myself"}
                  </button>
                  <button onClick={closeShare} style={{width:"100%",marginTop:10,background:"none",border:"none",fontSize:13,color:"#A8A8B0",cursor:"pointer",padding:"8px"}}>Cancel</button>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};



/* ─── REFLECTION VAULT ─── */
const ReflectionVault = ({ goBack, vault, navigate }) => {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(false); }, []);
  const tags = ["All", ...new Set(vault.map(v => v.tag))];
  const filtered = filter === "All" ? vault : vault.filter(v => v.tag === filter);

  if (loading) return <div className="screen active"><VaultSkeleton/></div>;

  return (
    <div className="screen active">
      <div style={{ padding:"56px 24px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div className="back-btn" onClick={expanded !== null ? () => setExpanded(null) : goBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            {expanded !== null ? "All Insights" : "Back"}
          </div>
          {expanded === null && (
            <button onClick={() => navigate("thought")} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"8px 16px", borderRadius:100, border:"none",
              background:"#F28C8C", color:"#fff",
              fontSize:13, fontWeight:600, cursor:"pointer",
              boxShadow:"0 4px 14px rgba(242,140,140,.35)",
              transition:"all .15s"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Record
            </button>
          )}
        </div>

        <h1 className="serif" style={{ fontSize:28, marginTop:20, color:"#1E293B" }}>
          {expanded !== null ? "Insight" : <>Your <em>Reflections</em></>}
        </h1>
        <p style={{ fontSize:13, color:"#71717A", marginTop:5, marginBottom:20 }}>
          {expanded !== null ? vault.find(v=>v.id===expanded)?.date : `${vault.length} saved insight${vault.length!==1?"s":""} — return here when you need perspective`}
        </p>

        {/* Expanded view */}
        {expanded !== null ? (() => {
          const item = vault.find(v => v.id === expanded);
          if (!item) return null;
          if (item.type === "journal") return (
            <div style={{animation:"ob-fade .2s ease both"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <span style={{fontSize:28}}>{GUIDED_JOURNALS.find(j=>j.id===item.journalId)?.emoji||"📓"}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:700,color:item.accent||"#B68A20"}}>{item.title}</p>
                  <p style={{fontSize:11,color:"#A8A8B0"}}>{item.date} · {item.wordCount||0} words</p>
                </div>
                <span className="pill" style={{background:item.color,color:item.accent,marginLeft:"auto"}}>{item.tag}</span>
              </div>
              {(item.distortions||[]).length>0 && (
                <div style={{marginBottom:12,padding:"10px 14px",background:`${item.accent||"#B68A20"}12`,borderRadius:12}}>
                  <p style={{fontSize:10,fontWeight:700,color:item.accent,marginBottom:6}}>PATTERNS ADDRESSED</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {item.distortions.map(d=><span key={d} style={{fontSize:11,color:item.accent,background:`${item.accent}22`,padding:"3px 10px",borderRadius:100,fontWeight:600}}>{d}</span>)}
                  </div>
                </div>
              )}
              {item.answers && Object.entries(item.answers).map(([i,a])=> a ? (
                <div key={i} className="card" style={{marginBottom:10,borderLeft:`3px solid ${item.accent||"#B68A20"}`}}>
                  <p style={{fontSize:10,fontWeight:700,color:"#A8A8B0",textTransform:"uppercase",letterSpacing:".04em",marginBottom:5}}>
                    {GUIDED_JOURNALS.find(j=>j.id===item.journalId)?.steps[i]?.q||`Step ${+i+1}`}
                  </p>
                  <p style={{fontSize:13,color:"#1E293B",lineHeight:1.65}}>{a}</p>
                </div>
              ) : null)}
            </div>
          );
          if (item.type === "expressive") return (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <span style={{ fontSize:28 }}>&#x1F4D3;</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:item.accent }}>Free Write</p>
                  <p style={{ fontSize:11, color:"#A8A8B0" }}>{item.date}</p>
                </div>
                <span className="pill" style={{ background:item.color, color:item.accent, marginLeft:"auto" }}>{item.tag}</span>
              </div>
              <div className="card" style={{ marginBottom:16, borderLeft:`4px solid ${item.accent}`, background:item.color }}>
                <p style={{ fontSize:15, color:"#1E293B", lineHeight:1.95, fontFamily:"'Playfair Display',serif", whiteSpace:"pre-wrap" }}>{item.balanced}</p>
              </div>
              <div style={{ padding:"12px 16px", background:"rgba(182,138,32,.06)", borderRadius:14, textAlign:"center" }}>
                <p style={{ fontSize:13, color:"#B68A20", lineHeight:1.65 }}>&#x1F4A1; Putting feelings into words reduces their intensity. This took courage.</p>
              </div>
            </div>
          );
          return (
            <div>
              {/* Step 1 — Situation */}
              <div className="card" style={{ marginBottom:12, borderLeft:`4px solid ${item.accent}` }}>
                <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginBottom:6 }}>The Situation</p>
                <p style={{ fontSize:14, color:"#1E293B", lineHeight:1.6 }}>{item.situation}</p>
              </div>

              {/* Step 2 — Automatic thought */}
              <div className="card" style={{ marginBottom:12, background:"#FAF9F6" }}>
                <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginBottom:6 }}>The Thought That Hurt</p>
                <p style={{ fontSize:14, color:"#71717A", lineHeight:1.6, fontStyle:"italic" }}>"{item.thought}"</p>
              </div>

              {/* Step 3 — Emotions + intensity */}
              {(item.emotions?.length > 0 || item.intensity != null) && (
                <div className="card" style={{ marginBottom:12 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginBottom:10 }}>Emotions</p>
                  {item.emotions?.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:item.intensity!=null?12:0 }}>
                      {item.emotions.map(e => (
                        <span key={e} style={{ padding:"4px 12px", borderRadius:100, background:`${item.color}`, color:item.accent, fontSize:12, fontWeight:600 }}>{e}</span>
                      ))}
                    </div>
                  )}
                  {item.intensity != null && (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:11, color:"#A8A8B0" }}>Distress intensity</span>
                        <span style={{ fontSize:11, fontWeight:700, color:item.accent }}>{item.intensity}%</span>
                      </div>
                      <div style={{ height:5, background:"#F0F0F0", borderRadius:100 }}>
                        <div style={{ height:"100%", width:`${item.intensity}%`, background:item.accent, borderRadius:100 }}/>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4 — Evidence */}
              {(item.evidenceFor || item.evidenceAgainst) && (
                <div className="card" style={{ marginBottom:12 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginBottom:12 }}>Examining the Evidence</p>
                  {item.evidenceFor && (
                    <div style={{ marginBottom:10 }}>
                      <p style={{ fontSize:11, fontWeight:600, color:"#F28C8C", marginBottom:4 }}>Supports the thought</p>
                      <p style={{ fontSize:13, color:"#71717A", lineHeight:1.6 }}>{item.evidenceFor}</p>
                    </div>
                  )}
                  {item.evidenceAgainst && (
                    <div style={{ paddingTop:item.evidenceFor?10:0, borderTop:item.evidenceFor?"1px solid #F5F5F5":"none" }}>
                      <p style={{ fontSize:11, fontWeight:600, color:"#3D9A6E", marginBottom:4 }}>Challenges the thought</p>
                      <p style={{ fontSize:13, color:"#71717A", lineHeight:1.6 }}>{item.evidenceAgainst}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5 — Balanced perspective hero card */}
              <div className="card" style={{ background:`${item.color}`, borderLeft:`4px solid ${item.accent}`, marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  <p style={{ fontSize:11, fontWeight:700, color:item.accent, letterSpacing:".05em", textTransform:"uppercase" }}>Your Balanced Perspective</p>
                </div>
                <p style={{ fontSize:15, color:"#1E293B", lineHeight:1.75, fontFamily:"'Playfair Display',serif", fontStyle:"italic" }}>"{item.balanced}"</p>
              </div>

              {/* Closing affirmation */}
              <div style={{ padding:"12px 16px", background:"rgba(242,140,140,.06)", borderRadius:14, textAlign:"center", marginBottom:8 }}>
                <p style={{ fontSize:13, color:"#F28C8C", lineHeight:1.6 }}>💡 You wrote this when you were thinking clearly. Trust your past self.</p>
              </div>
            </div>
          );
        })() : (
          <div>
            {/* Tag filter */}
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:4, marginBottom:18 }}>
              {tags.map(t => {
                const meta = THOUGHT_TAGS.find(x => x.label === t);
                return (
                  <div key={t} onClick={() => setFilter(t)} style={{
                    flexShrink:0, padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer",
                    background: filter===t ? (meta?.accent || "#3D7A5E") : "#fff",
                    color: filter===t ? "#fff" : "#7A7570",
                    border:`1.5px solid ${filter===t ? (meta?.accent || "#3D7A5E") : "#DDD9D0"}`,
                    transition:"all .2s"
                  }}>{t === "All" ? "All" : `${meta?.emoji || ""} ${t}`}</div>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 24px 40px", animation:"ob-fade .5s ease both" }}>
                {/* Botanical SVG illustration */}
                <svg width="110" height="110" viewBox="0 0 120 120" fill="none" style={{ margin:"0 auto 32px", display:"block" }}>
                  <circle cx="60" cy="60" r="52" fill="rgba(242,140,140,.06)"/>
                  <path d="M60 88 C60 88 60 52 60 40" stroke="#D4C5BB" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M60 72 C60 72 48 64 44 56 C52 56 60 64 60 72" fill="rgba(196,210,188,.5)" stroke="#C4D2BC" strokeWidth="1"/>
                  <path d="M60 64 C60 64 72 56 76 48 C68 48 60 56 60 64" fill="rgba(196,210,188,.4)" stroke="#C4D2BC" strokeWidth="1"/>
                  <path d="M60 55 C60 55 50 46 50 38 C57 40 62 48 60 55" fill="rgba(212,193,183,.4)" stroke="#D4C1BB" strokeWidth="1"/>
                  <circle cx="60" cy="38" r="5" fill="rgba(242,140,140,.25)" stroke="rgba(242,140,140,.4)" strokeWidth="1"/>
                </svg>
                {/* Daily rotating quote */}
                {(() => {
                  const quotes = [
                    { text:"The unexamined life is not worth living.", author:"Socrates" },
                    { text:"You don't have to control your thoughts; you just have to stop letting them control you.", author:"Dan Millman" },
                    { text:"Between stimulus and response there is a space. In that space is our power.", author:"Viktor Frankl" },
                    { text:"Feelings are just visitors. Let them come and go.", author:"Mooji" },
                    { text:"What we think, we become.", author:"Buddha" },
                  ];
                  const q = quotes[new Date().getDate() % quotes.length];
                  return (
                    <div style={{ maxWidth:270, margin:"0 auto 28px" }}>
                      <p className="quote-text" style={{ fontSize:15, marginBottom:10 }}>"{q.text}"</p>
                      <p style={{ fontSize:11, color:"#C4C4C4", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase" }}>— {q.author}</p>
                    </div>
                  );
                })()}
                <p style={{ fontSize:13, color:"#A8A8B0", lineHeight:1.75, marginBottom:24 }}>
                  Your reflections will appear here.<br/>Every thought you examine becomes<br/>a little lighter.
                </p>
                <button onClick={()=>navigate("thought")} style={{
                  padding:"12px 28px", borderRadius:100, background:"#F28C8C",
                  border:"none", color:"#fff", fontSize:13, fontWeight:700,
                  cursor:"pointer", boxShadow:"0 4px 18px rgba(242,140,140,.28)",
                  fontFamily:"Jost,sans-serif",
                }}>
                  Begin your first reflection →
                </button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {filtered.map((item, i) => (
                  <div key={item.id} className="card card-press vault-card cs-item"
                    style={{ animationDelay:`${i*.07}s`, borderLeft:`4px solid ${item.accent}`, cursor:"pointer" }}
                    onClick={() => setExpanded(item.id)}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <span className="pill" style={{ background:item.color, color:item.accent }}>{item.tag}</span>
                      <span style={{ fontSize:11, color:"#9A9490" }}>{item.date}</span>
                    </div>
                    {item.type === "expressive"
                      ? <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                          <span style={{ fontSize:16 }}>&#x1F4D3;</span>
                          <span style={{ fontSize:11, fontWeight:700, color:item.accent, letterSpacing:".06em", textTransform:"uppercase" }}>Free Write</span>
                        </div>
                      : <p style={{ fontSize:13, color:"#6B6560", fontStyle:"italic", marginBottom:10 }}>"{item.thought}"</p>
                    }
                    {/* Preview */}
                    <div style={{ padding:"10px 12px", background:item.type==="expressive"?`${item.color}`:"rgba(61,122,94,.06)", borderRadius:10 }}>
                      <p style={{ fontSize:13, color:item.type==="expressive"?item.accent:"#3D7A5E", lineHeight:1.6 }}>
                        {item.balanced.length > 90 ? item.balanced.slice(0,90)+"…" : item.balanced}
                      </p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", marginTop:10, gap:4 }}>
                      <span style={{ fontSize:12, color:item.type==="expressive"?item.accent:"#3D7A5E", fontWeight:600 }}>
                        {item.type==="expressive" ? "Read full entry" : "Read full insight"}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={item.type==="expressive"?item.accent:"#3D7A5E"} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── HOME SCREEN ─── */

/* ─── GUIDED JOURNAL SCREEN ─── */
const GuidedJournalScreen = ({ goBack, journal, onSave }) => {
  const [step,       setStep]       = useState(0);
  const [answers,    setAnswers]    = useState({});
  const [hintOpen,   setHintOpen]   = useState(false);
  const [hintIdx,    setHintIdx]    = useState(0);
  const [done,       setDone]       = useState(false);
  // Stress Script specific state
  const [ssEvent,    setSsEvent]    = useState("");
  const [ssFear,     setSsFear]     = useState("");
  const [ssScript,   setSsScript]   = useState("");
  const [ssAnxPre,   setSsAnxPre]   = useState(5);
  const [ssAnxPost,  setSsAnxPost]  = useState(3);
  const isStressScript = journal?.stressScript === true;

  const j = journal;
  const total = j.steps.length;
  const current = j.steps[step];
  const wordCount = Object.values(answers).join(" ").trim().split(/\s+/).filter(Boolean).length;

  const goNext = () => {
    if (step < total - 1) {
      setStep(s => s + 1);
      setHintOpen(false);
      setHintIdx(0);
    } else {
      setDone(true);
    }
  };
  const goPrev = () => {
    if (step > 0) {
      setStep(s => s - 1);
      setHintOpen(false);
    }
  };

  const handleSave = () => {
    const summary = Object.entries(answers)
      .map(([i, a]) => `**${j.steps[i].q}**\n${a}`)
      .join("\n\n");
    onSave({
      type:"journal",
      journalId: j.id,
      tag: j.tag,
      title: j.title,
      technique: j.technique,
      distortions: j.distortions,
      wordCount,
      answers,
      situation: j.title,
      thought: answers[0] || "",
      emotions: [],
      intensity: null,
      evidenceFor: answers[1] || "",
      evidenceAgainst: answers[2] || "",
      balanced: answers[total-1] || "",
      note: summary,
    });
    goBack();
  };

  // ── Summary screen ──
  if (done) return (
    <div className="screen active" style={{background:"#FAF9F6"}}>
      <div style={{padding:"52px 24px 40px"}}>
        <button onClick={goBack} style={{background:"none",border:"none",cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          <span style={{fontSize:13,color:"#71717A"}}>Back</span>
        </button>

        {/* Completion header */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:72,height:72,borderRadius:24,background:j.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px",boxShadow:`0 8px 28px ${j.accent}55`}}>
            {j.emoji}
          </div>
          <h1 className="serif" style={{fontSize:26,color:"#1E293B",marginBottom:6}}><em>Well done</em></h1>
          <p style={{fontSize:14,color:"#71717A",lineHeight:1.6}}>You completed the <strong>{j.title}</strong> journal.</p>
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:10,marginBottom:24}}>
          {[
            {val:`${wordCount}`, label:"words written",  color:"#3D9A6E"},
            {val:`${total}`,     label:"prompts explored", color:j.accent},
            {val:`${j.distortions.length}`, label:"patterns addressed", color:"#7B3FA0"},
          ].map(({val,label,color})=>(
            <div key={label} className="card" style={{flex:1,textAlign:"center",padding:"14px 6px"}}>
              <p style={{fontSize:22,fontWeight:700,color,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{val}</p>
              <p style={{fontSize:9,color:"#A8A8B0",marginTop:4,lineHeight:1.4}}>{label}</p>
            </div>
          ))}
        </div>

        {/* CBT patterns addressed */}
        <div className="card" style={{marginBottom:16,padding:"16px 18px"}}>
          <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".05em",textTransform:"uppercase",marginBottom:12}}>CBT Patterns Addressed</p>
          <p style={{fontSize:12,color:"#71717A",marginBottom:10}}>This journal targets these common thinking patterns:</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {j.distortions.map(d=>(
              <span key={d} style={{fontSize:12,fontWeight:600,color:j.accent,background:`${j.accent}18`,padding:"5px 12px",borderRadius:100}}>{d}</span>
            ))}
          </div>
          <div style={{marginTop:14,padding:"10px 12px",background:"rgba(61,154,110,.07)",borderRadius:10,borderLeft:"3px solid #3D9A6E"}}>
            <p style={{fontSize:11,fontWeight:700,color:"#3D9A6E",marginBottom:2}}>Technique used</p>
            <p style={{fontSize:12,color:"#3D9A6E"}}>{j.technique}</p>
          </div>
        </div>

        {/* Answers review */}
        <div className="card" style={{marginBottom:24,padding:"16px 18px"}}>
          <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",letterSpacing:".05em",textTransform:"uppercase",marginBottom:14}}>Your Reflections</p>
          {j.steps.map((s,i) => answers[i] ? (
            <div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<j.steps.length-1?"1px solid #F0F0F0":"none"}}>
              <p style={{fontSize:11,fontWeight:600,color:"#A8A8B0",marginBottom:4}}>{s.q}</p>
              <p style={{fontSize:13,color:"#1E293B",lineHeight:1.6}}>{answers[i]}</p>
            </div>
          ) : null)}
        </div>

        <button className="btn btn-p" onClick={handleSave} style={{fontSize:15,padding:"15px"}}>
          Keep this reflection →
        </button>
      </div>
    </div>
  );

  // ── Question screen ──
  return (
    <div className="screen active" style={{background:"#FAF9F6"}}>
      {/* Progress bar */}
      <div style={{position:"fixed",top:0,left:0,right:0,height:3,background:"#F0F0F0",zIndex:50}}>
        <div style={{height:"100%",width:`${((step+1)/total)*100}%`,background:j.accent,transition:"width .4s cubic-bezier(.4,0,.2,1)",borderRadius:"0 2px 2px 0"}}/>
      </div>

      <div style={{padding:"52px 24px 40px"}}>
        {/* Nav row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <button onClick={step===0?goBack:goPrev} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,padding:0}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            <span style={{fontSize:13,color:"#71717A"}}>{step===0?"Close":"Back"}</span>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:"#A8A8B0",fontWeight:600}}>{step+1} of {total}</span>
            <div style={{width:28,height:28,borderRadius:10,background:j.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{j.emoji}</div>
          </div>
        </div>

        {/* Question — key forces remount → clean enter animation each step */}
        <div key={step} className="step-enter">
          <p style={{fontSize:11,fontWeight:700,color:j.accent,letterSpacing:".05em",textTransform:"uppercase",marginBottom:10}}>{j.title}</p>
          <h2 className="serif" style={{fontSize:22,color:"#1E293B",lineHeight:1.45,marginBottom:20}}>
            <em>{current.q}</em>
          </h2>

          {/* ── STRESS SCRIPT custom steps ── */}
          {isStressScript ? (
            <div style={{marginBottom:20}}>
              {/* Step 1: Split event / fear */}
              {step === 0 && (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div>
                    <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",marginBottom:6,letterSpacing:".04em",textTransform:"uppercase"}}>The Event</p>
                    <input value={ssEvent} onChange={e=>setSsEvent(e.target.value)}
                      placeholder="e.g. Presentation to leadership"
                      style={{width:"100%",borderRadius:14,border:"1.5px solid #EBEBEB",padding:"13px 16px",fontSize:14,color:"#1E293B",background:"#fff",outline:"none",fontFamily:"Jost,sans-serif",boxSizing:"border-box",transition:"border-color .18s"}}
                      onFocus={e=>e.target.style.borderColor=j.accent} onBlur={e=>e.target.style.borderColor="#EBEBEB"}/>
                  </div>
                  <div>
                    <p style={{fontSize:11,fontWeight:700,color:"#A8A8B0",marginBottom:6,letterSpacing:".04em",textTransform:"uppercase"}}>The Fear (your mind's story)</p>
                    <textarea value={ssFear} onChange={e=>setSsFear(e.target.value)}
                      placeholder="e.g. I'll blank out and look incompetent"
                      rows={3}
                      style={{width:"100%",borderRadius:14,border:"1.5px solid #EBEBEB",padding:"13px 16px",fontSize:14,lineHeight:1.6,color:"#1E293B",background:"#fff",outline:"none",fontFamily:"Jost,sans-serif",resize:"none",boxSizing:"border-box",transition:"border-color .18s"}}
                      onFocus={e=>e.target.style.borderColor=j.accent} onBlur={e=>e.target.style.borderColor="#EBEBEB"}/>
                  </div>
                  {(ssEvent||ssFear) && (
                    <div style={{padding:"12px 16px",background:`${j.accent}0D`,borderRadius:12,borderLeft:`3px solid ${j.accent}`}}>
                      <p style={{fontSize:12,color:j.accent,fontWeight:600}}>Cope asks: Is this fear a fact, or an interpretation?</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Script builder with inspiration chips */}
              {step === 1 && (
                <div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
                    {["Focus on the next task","This is just a temporary spike","I have what I need","One breath, one step","I've handled hard things before"].map(chip=>(
                      <button key={chip} onClick={()=>setSsScript(s=>s?(s+" "+chip):chip)}
                        style={{padding:"6px 12px",borderRadius:100,fontSize:11,fontWeight:600,cursor:"pointer",
                          border:`1.5px solid ${j.accent}44`,background:`${j.accent}0D`,color:j.accent,fontFamily:"Jost,sans-serif"}}>
                        + {chip}
                      </button>
                    ))}
                  </div>
                  <textarea value={ssScript} onChange={e=>setSsScript(e.target.value)}
                    placeholder="Write your confrontation statement here, or tap chips above to build it..."
                    rows={5}
                    style={{width:"100%",borderRadius:14,border:"1.5px solid #EBEBEB",padding:"14px 16px",
                      fontSize:15,lineHeight:1.75,color:"#1E293B",background:"#fff",
                      outline:"none",fontFamily:"'Playfair Display',serif",fontStyle:"italic",
                      resize:"none",boxSizing:"border-box",transition:"border-color .18s"}}
                    onFocus={e=>e.target.style.borderColor=j.accent} onBlur={e=>e.target.style.borderColor="#EBEBEB"}/>
                  {ssScript && <p style={{fontSize:11,color:"#A8A8B0",marginTop:6,textAlign:"right"}}>{ssScript.trim().split(/\s+/).filter(Boolean).length} words</p>}
                </div>
              )}

              {/* Step 3: Anxiety slider + safety valve */}
              {step === 2 && (
                <div>
                  <p style={{fontSize:12,color:"#71717A",marginBottom:8}}>Current anxiety level</p>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                    <span style={{fontSize:12,color:"#A8A8B0"}}>Calm</span>
                    <input type="range" min={1} max={10} value={ssAnxPre} onChange={e=>setSsAnxPre(+e.target.value)}
                      className="g-slider" style={{"--v":`${(ssAnxPre-1)/9*100}%`,flex:1}}/>
                    <span style={{fontSize:12,color:"#A8A8B0"}}>Peak</span>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:j.accent,minWidth:28,textAlign:"right"}}>{ssAnxPre}</span>
                  </div>
                  <div style={{marginBottom:14,padding:"12px 16px",background:`${j.accent}0D`,borderRadius:12,border:`1px solid ${j.accent}22`}}>
                    <p style={{fontSize:12,color:j.accent,lineHeight:1.6,fontStyle:"italic"}}>"I can handle this feeling. It is just my body's way of preparing for action."</p>
                  </div>
                  <textarea value={answers[step]||""}
                    onChange={e=>setAnswers(prev=>({...prev,[step]:e.target.value}))}
                    placeholder="My safety valve in the moment will be..."
                    rows={4}
                    style={{width:"100%",borderRadius:14,border:"1.5px solid #EBEBEB",padding:"14px 16px",fontSize:14,lineHeight:1.65,color:"#1E293B",background:"#fff",outline:"none",fontFamily:"Jost,sans-serif",resize:"none",boxSizing:"border-box",transition:"border-color .18s"}}
                    onFocus={e=>e.target.style.borderColor=j.accent} onBlur={e=>e.target.style.borderColor="#EBEBEB"}/>
                </div>
              )}

              {/* Step 4: Post-anxiety re-rate + delta + self-credit */}
              {step === 3 && (
                <div>
                  <p style={{fontSize:12,color:"#71717A",marginBottom:8}}>Anxiety now, after scripting your plan</p>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                    <span style={{fontSize:12,color:"#A8A8B0"}}>Calm</span>
                    <input type="range" min={1} max={10} value={ssAnxPost} onChange={e=>setSsAnxPost(+e.target.value)}
                      className="g-slider" style={{"--v":`${(ssAnxPost-1)/9*100}%`,flex:1}}/>
                    <span style={{fontSize:12,color:"#A8A8B0"}}>Peak</span>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:j.accent,minWidth:28,textAlign:"right"}}>{ssAnxPost}</span>
                  </div>
                  {/* Delta card */}
                  {(() => {
                    const delta = ssAnxPre - ssAnxPost;
                    const pct = ssAnxPre > 0 ? Math.round(delta/ssAnxPre*100) : 0;
                    const improved = delta > 0;
                    return (
                      <div style={{padding:"14px 18px",borderRadius:14,marginBottom:16,
                        background: improved ? "rgba(61,154,110,.08)" : `${j.accent}0D`,
                        border:`1px solid ${improved?"rgba(61,154,110,.2)":j.accent+"22"}`}}>
                        <p style={{fontSize:12,fontWeight:700,color:improved?"#3D9A6E":j.accent,marginBottom:2}}>
                          {improved ? `⚡ Anxiety ↓ ${Math.abs(delta)} pts (${pct}% reduction)` : delta < 0 ? "⚠ Anxiety ↑ — your safety valve needs practice" : "→ Holding steady — that's still strength"}
                        </p>
                        <p style={{fontSize:11,color:"#71717A"}}>{ssAnxPre} → {ssAnxPost} · This script will be saved to your vault</p>
                      </div>
                    );
                  })()}
                  <textarea value={answers[step]||""}
                    onChange={e=>setAnswers(prev=>({...prev,[step]:e.target.value}))}
                    placeholder="Give yourself credit: I showed up for myself by..."
                    rows={4}
                    style={{width:"100%",borderRadius:14,border:"1.5px solid #EBEBEB",padding:"14px 16px",fontSize:14,lineHeight:1.65,color:"#1E293B",background:"#fff",outline:"none",fontFamily:"Jost,sans-serif",resize:"none",boxSizing:"border-box",transition:"border-color .18s"}}
                    onFocus={e=>e.target.style.borderColor=j.accent} onBlur={e=>e.target.style.borderColor="#EBEBEB"}/>
                </div>
              )}
            </div>
          ) : (
            /* ── Standard journal text area ── */
            <div style={{position:"relative",marginBottom:16}}>
              <textarea
                value={answers[step]||""}
                onChange={e=>setAnswers(prev=>({...prev,[step]:e.target.value}))}
                placeholder={current.hint}
                rows={5}
                style={{
                  width:"100%", borderRadius:18, border:"1.5px solid #EBEBEB",
                  padding:"16px", fontSize:15, lineHeight:1.7, color:"#1E293B",
                  background:"#fff", outline:"none", fontFamily:"Jost,sans-serif",
                  resize:"none", boxSizing:"border-box",
                  boxShadow:"0 2px 12px rgba(0,0,0,.04)",
                  transition:"border-color .18s",
                }}
                onFocus={e=>e.target.style.borderColor=j.accent}
                onBlur={e=>e.target.style.borderColor="#EBEBEB"}
              />
              <span style={{position:"absolute",bottom:10,right:14,fontSize:10,color:"#C0C0C0"}}>
                {(answers[step]||"").trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          )}

          {/* Get a Hint — standard journals only */}
          {!isStressScript && (
            <div style={{marginBottom:24}}>
              <button onClick={()=>{setHintOpen(b=>!b); setHintIdx(0);}}
                style={{background:"none",border:"1.5px solid #EBEBEB",borderRadius:100,padding:"7px 16px",fontSize:12,color:"#71717A",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"Jost,sans-serif"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {hintOpen ? "Hide hints" : "Get a hint"}
              </button>
              {hintOpen && (
                <div style={{marginTop:10,borderRadius:14,background:`${j.accent}10`,border:`1.5px solid ${j.accent}30`,padding:"14px 16px",animation:"ob-fade .18s ease both"}}>
                  <p style={{fontSize:12,fontWeight:700,color:j.accent,marginBottom:6}}>Reflection prompt {hintIdx+1} of {current.prompts.length}</p>
                  <p style={{fontSize:13,color:"#1E293B",lineHeight:1.65}}>{current.prompts[hintIdx]}</p>
                  {current.prompts.length > 1 && (
                    <button onClick={()=>setHintIdx(h=>(h+1)%current.prompts.length)}
                      style={{marginTop:10,background:"none",border:"none",cursor:"pointer",fontSize:12,color:j.accent,fontWeight:600,padding:0,fontFamily:"Jost,sans-serif"}}>
                      Next prompt →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Socratic prompts for Stress Script */}
          {isStressScript && current.prompts?.length > 0 && (
            <div style={{marginBottom:20}}>
              <button onClick={()=>{setHintOpen(b=>!b);setHintIdx(0);}}
                style={{background:"none",border:`1.5px solid ${j.accent}44`,borderRadius:100,padding:"7px 16px",fontSize:12,color:j.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"Jost,sans-serif",marginBottom:hintOpen?10:0}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={j.accent} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {hintOpen?"Hide Socratic prompt":"Socratic prompt"}
              </button>
              {hintOpen && (
                <div style={{borderRadius:14,background:`${j.accent}0D`,border:`1.5px solid ${j.accent}22`,padding:"12px 16px",animation:"ob-fade .18s ease both"}}>
                  <p style={{fontSize:13,color:j.accent,lineHeight:1.65,fontStyle:"italic"}}>{current.prompts[hintIdx]}</p>
                  {current.prompts.length > 1 && (
                    <button onClick={()=>setHintIdx(h=>(h+1)%current.prompts.length)}
                      style={{marginTop:8,background:"none",border:"none",cursor:"pointer",fontSize:12,color:j.accent,fontWeight:600,padding:0,fontFamily:"Jost,sans-serif"}}>
                      Next →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Next / Finish */}
          <button className="btn btn-p" onClick={goNext}
            style={{fontSize:15,padding:"15px",background:j.accent,boxShadow:`0 6px 20px ${j.accent}44`}}>
            {step < total - 1 ? "Continue →" : isStressScript ? "Save my script →" : "See my insights →"}
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ navigate, checkIns, userName = "there", lastMood }) => {
  const hour = new Date().getHours();
  const baseGreet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const lastSleep = lastMood?.sleepHrs;
  const lastMs    = lastMood?.moodScore;
  const contextGreet = (() => {
    if (hour >= 22) return "Still up?";
    if (hour >= 6 && hour < 9 && lastSleep && lastSleep < 6) return "A little tired today?";
    if (lastMs === 1 || lastMs === 2) return "Glad you're here.";
    if (lastMs === 5) return "You're glowing today.";
    return baseGreet;
  })();
  const contextSub = (() => {
    if (lastSleep && lastSleep < 6 && hour < 12) return "You logged a restless night — a 2-minute breathe might help.";
    if (lastMs === 1 || lastMs === 2) return "It takes courage to check in on days like this.";
    if (lastMs === 5) return "Capture what's working — it's data too.";
    return null;
  })();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  const [moodBg, setMoodBg] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);


  // Dynamic primary action based on time of day
  const primaryAction = hour >= 18
    ? { screen:"reflection", title:"Evening Reflection", sub:"A quiet moment to close your day", icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> }
    : checkIns === 0
    ? { screen:"checkin", title:"How are you feeling?", sub:"Log today's mood — takes 60 seconds", icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
    : { screen:"breathe", title:"Take a moment", sub:"Find your center with a breathing exercise", icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> };

  const secondaryActions = [
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B68A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, title:"Thought", sub:"CBT worksheet", screen:"thought", bg:"#FFFBF0" },
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>, title:"Coping", sub:"Ground yourself", screen:"coping", bg:"#FAF5FF" },
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4702A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h.01M14 17h.01M17 14h.01M17 17h.01"/></svg>, title:"Rituals", sub:"Meds & more", screen:"medicine", bg:"#FFF7F2" },
    { icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A7F93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>, title:"Reflection", sub:"Your insights", screen:"reflection", bg:"#F0FAFA" },
  ];

  if (loading) return <div className="screen active"><HomeSkeleton/></div>;

  // Mood → background tint palette
  // Mood bloom: radial gradient from center, expressive but not dark
  const MOOD_BLOOMS = {
    1: "radial-gradient(ellipse at 50% 40%, rgba(170,145,138,.18) 0%, transparent 72%)",  // Depleted — warm ash
    2: "radial-gradient(ellipse at 50% 40%, rgba(100,150,120,.16) 0%, transparent 72%)",  // Low — sage
    3: "radial-gradient(ellipse at 50% 40%, rgba(90,130,106,.13) 0%, transparent 72%)",   // Okay — grounded sage
    4: "radial-gradient(ellipse at 50% 40%, rgba(140,180,60,.15) 0%, transparent 72%)",   // Good — lively green
    5: "radial-gradient(ellipse at 50% 40%, rgba(220,165,20,.20) 0%, transparent 65%)",   // Great — warm golden bloom
  };

  return (
    <div className="screen active" style={{ background:"transparent" }}>
      {/* Ambient mesh gradient — always present */}
      <div className="mesh-bg"/>
      {/* Mood bloom overlay — appears on hover/tap */}
      {moodBg && <div className="mood-bloom" style={{ background:MOOD_BLOOMS[moodBg] || moodBg }}/>}
      <div style={{ padding:"56px 24px 24px", position:"relative", zIndex:2 }}>

        {/* Header with streak inline */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <div>
            <p style={{ fontSize:13, color:"#9A9A9A", fontWeight:500 }}>{contextGreet}, {userName} ✦</p>
            <h1 className="serif" style={{ fontSize:28, color:"#1A1A1A", lineHeight:1.2, marginTop:4 }}>How are you<br/><em>feeling today?</em></h1>
            {contextSub && <p style={{ fontSize:12, color:"#F28C8C", marginTop:6, lineHeight:1.6, maxWidth:240, fontWeight:500 }}>{contextSub}</p>}
          </div>
          {/* Streak badge — compact, in header */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, paddingTop:4 }}>
            <div style={{ width:42, height:42, borderRadius:14, background:"rgba(242,140,140,.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:22 }}>🔥</span>
            </div>
            <span style={{ fontSize:10, fontWeight:700, color:"#F28C8C" }}>7 days</span>
          </div>
        </div>

        {/* Quick mood tap row — frosted glass floating dock */}
        <div style={{
          marginBottom:20, padding:"18px 20px",
          background:"rgba(255,255,255,.62)",
          backdropFilter:"blur(22px) saturate(180%)",
          WebkitBackdropFilter:"blur(22px) saturate(180%)",
          borderRadius:22,
          border:"1px solid rgba(255,255,255,.55)",
          boxShadow:"0 4px 24px rgba(0,0,0,.07), 0 1px 0 rgba(255,255,255,.7) inset",
        }}>
          <p style={{ fontSize:12, color:"#71717A", marginBottom:12 }}>Quick mood — tap to log</p>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            {/* Emotion arc — subtle arc line behind faces */}
            {(() => {
              const GLOW_COLS = {1:"rgba(180,145,138,.5)",2:"rgba(100,175,140,.5)",3:"rgba(90,140,106,.5)",4:"rgba(140,180,60,.5)",5:"rgba(220,165,20,.55)"};
              return FACES.map(f => {
                const isSelected = selectedMood === f.score;
                const glowCol = GLOW_COLS[f.score];
                return (
                  <div key={f.score}
                    onClick={() => { setMoodBg(f.score); setSelectedMood(f.score); haptic.light(); setTimeout(()=>navigate("checkin"),220); }}
                    onMouseEnter={() => { setMoodBg(f.score); }}
                    onMouseLeave={() => { setMoodBg(null); }}
                    style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer" }}>
                    <div style={{
                      width:42, height:42, borderRadius:"50%",
                      background: isSelected ? f.fill : f.bg,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease, background .22s ease",
                      transform: isSelected ? "scale(1.14)" : "scale(1)",
                      boxShadow: isSelected ? `0 0 0 4px ${glowCol}` : "none",
                      "--glow-col": glowCol,
                    }}>
                      <svg viewBox="0 0 24 24" width="62%" height="62%"
                        style={{ filter: isSelected ? "drop-shadow(0 0 3px rgba(255,255,255,.6))" : "none" }}>
                        {f.eyes}{f.mouth}{f.tear}
                      </svg>
                    </div>
                    {/* Arc dot below selected face */}
                    <div style={{
                      width: isSelected ? 6 : 4, height: isSelected ? 6 : 4,
                      borderRadius:"50%",
                      background: isSelected ? f.fill : "#E8E5E0",
                      transition:"all .22s ease",
                      boxShadow: isSelected ? `0 0 6px ${glowCol}` : "none",
                    }}/>
                    <span style={{ fontSize:9, color: isSelected ? "#1E293B" : "#A8A8B0", fontWeight: isSelected ? 700 : 500, marginTop:-2 }}>{f.label}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Breathe strip — frosted glass with pulsing Start pill */}
        <div style={{
          marginBottom:20, padding:"14px 20px",
          background:"rgba(235,242,255,.72)",
          backdropFilter:"blur(18px) saturate(160%)",
          WebkitBackdropFilter:"blur(18px) saturate(160%)",
          borderRadius:20,
          border:"1px solid rgba(74,111,168,.18)",
          boxShadow:"0 2px 16px rgba(74,111,168,.10)",
          display:"flex", alignItems:"center", gap:14, cursor:"pointer",
        }} onClick={() => navigate("breathe")}>
          <div style={{ width:40, height:40, borderRadius:14, background:"rgba(74,111,168,.14)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6FA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:14, fontWeight:600, color:"#1E293B" }}>Breathe</p>
            <p style={{ fontSize:12, color:"#71717A" }}>Find your center · 1 min</p>
          </div>
          {/* Pulsing semi-transparent pill */}
          <div className="breathe-pill" style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"7px 16px",
            background:"rgba(74,111,168,.82)",
            backdropFilter:"blur(8px)",
            WebkitBackdropFilter:"blur(8px)",
            borderRadius:100,
            border:"1px solid rgba(255,255,255,.3)",
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>Start</span>
          </div>
        </div>

        {/* Secondary 2×2 grid */}
        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:12 }}>More Tools</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:28 }}>
          {secondaryActions.map(({ icon, title, sub, screen, bg }) => (
            <div key={screen} className="card card-press card-glass-tinted" style={{ background:bg, padding:"16px" }} onClick={() => navigate(screen)}>
              <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,.7)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
                {icon}
              </div>
              <p style={{ fontWeight:600, fontSize:13, color:"#1E293B", lineHeight:1.3 }}>{title}</p>
              <p style={{ fontSize:11, color:"#71717A", marginTop:3, lineHeight:1.4 }}>{sub}</p>
            </div>
          ))}
        </div>


        {/* This Week — mini Mood Map */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase" }}>This Week</p>
          <span style={{ fontSize:12, color:"#F28C8C", fontWeight:600, cursor:"pointer" }} onClick={() => navigate("insights")}>View all →</span>
        </div>
        <div className="card" style={{ padding:"16px 14px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:5 }}>
            {MOOD_HISTORY.map((d,i) => {
              const now = new Date();
              const dayOfWeek = (now.getDay() + 6) % 7;
              const isFuture = i > dayOfWeek;
              const isToday = i === dayOfWeek;
              // Derive moodScore from score for color lookup (same logic as generateMonthData)
              const ms = d.score <= 20 ? 1 : d.score <= 40 ? 2 : d.score <= 60 ? 3 : d.score <= 80 ? 4 : 5;
              const fill = FACE_FILLS[ms];
              const bg = isFuture ? "transparent" : fill;
              const border = isFuture ? "1.5px solid #F0F0F0" : isToday ? `2.5px solid ${fill}` : "none";
              const textCol = isFuture ? "#D0D0D0" : "#fff";
              return (
                <div key={i} onClick={() => navigate("insights")} style={{ cursor:"pointer" }}>
                  <div style={{
                    height:42, borderRadius:10, background:bg, border,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1,
                    boxShadow: isToday && !isFuture ? `0 3px 10px ${fill}55` : "none",
                    transition:"transform .15s",
                  }}>
                    {!isFuture ? (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          {FACES.find(f=>f.score===ms)?.eyes}
                          {FACES.find(f=>f.score===ms)?.mouth}
                        </svg>
                        <span style={{ fontSize:8, fontWeight:700, color:textCol, lineHeight:1 }}>{FACE_LABELS[ms]}</span>
                      </>
                    ) : null}
                  </div>
                  <p style={{ fontSize:9, color:"#A8A8B0", textAlign:"center", marginTop:4 }}>{d.day}</p>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize:11, color:"#A8A8B0", textAlign:"center", marginTop:10 }}>Tap a day to log missed entries</p>
        </div>

        {checkIns > 0 && (
          <div className="card" style={{ marginTop:10, display:"flex", alignItems:"center", gap:12, padding:"13px 18px" }}>
            <span style={{fontSize:20}}>✅</span>
            <p style={{fontSize:13,color:"#1E293B"}}><strong>{checkIns}</strong> check-in{checkIns!==1?"s":""} this session</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── MEDICINE TRACKER ─── */
const CYCLE_PHASES_I = [
  { name:"Menstrual",   days:[1,2,3,4,5],       color:"#F28C8C", bg:"rgba(242,140,140,.1)",  emoji:"🌑", note:"Energy may be lower. Rest is restorative, not lazy." },
  { name:"Follicular",  days:[6,7,8,9,10,11,12,13], color:"#F5C76A", bg:"rgba(245,199,106,.12)", emoji:"🌒", note:"Rising estrogen lifts mood & cognition. Great time for difficult conversations." },
  { name:"Ovulatory",   days:[14],               color:"#3D9A6E", bg:"rgba(61,154,110,.1)",  emoji:"🌕", note:"Peak energy & confidence. Feelings of connection are heightened." },
  { name:"Luteal",      days:[15,16,17,18,19,20,21,22,23,24,25,26,27,28], color:"#7B3FA0", bg:"rgba(123,63,160,.1)", emoji:"🌘", note:"PMS window. Anxiety & irritability can spike — this is hormonal, not a character flaw." },
];

const getCyclePhase = (day) => {
  if (!day || day < 1) return null;
  return CYCLE_PHASES_I.find(p => p.days.includes(day)) || CYCLE_PHASES_I[3];
};

const MedicineTracker = ({ goBack, rituals, setRituals }) => {
  const [meds,     setMeds]     = useState(DEFAULT_MEDS);
  const [section,  setSection]  = useState("meds");    // meds | rituals
  const [addMode,  setAddMode]  = useState(null);      // null | "med" | "ritual"
  const [editId,   setEditId]   = useState(null);      // id being edited
  const [view,     setView]     = useState("today");
  const nowHour = new Date().getHours();

  // ── new med/ritual form state ──
  const emptyMed     = { name:"", dose:"", time:"Morning", scheduledHour:8, missedAfterHours:2, emoji:"💊" };
  const emptyRitual  = { label:"", time:"Morning", emoji:"🌿" };
  const [newMed,    setNewMed]    = useState(emptyMed);
  const [newRitual, setNewRitual] = useState(emptyRitual);

  // ── edit buffer ──
  const [editBuf, setEditBuf] = useState({});

  const TIMES  = ["Morning","Afternoon","Evening","Bedtime","As needed"];
  const MED_EMOJIS  = ["💊","💙","🔵","🟡","🔴","🟢","🟠","⚪"];
  const RIT_EMOJIS  = ["🌿","🚶","🧘","📝","📵","🚿","💧","🥗","🏃","🌅","🎨","📖","🎵","🌱","🛁"];
  const COLORS = ["#E8D5F5","#D1ECF1","#FFF3CD","#D4EDDA","#FFECEC","#FDE8D0","#D1ECF1","#E8F0FF"];

  const isMissed = (m) => {
    if (m.taken) return false;
    if (m.scheduledHour == null) return false;
    return nowHour >= m.scheduledHour + (m.missedAfterHours || 2);
  };
  const missedCount  = meds.filter(m => isMissed(m)).length;
  const takenCount   = meds.filter(m => m.taken).length;
  const adherence    = meds.length ? Math.round(takenCount / meds.length * 100) : 0;
  const ritDone      = rituals.filter(r => r.done).length;
  const weekDays     = ["M","T","W","T","F","S","S"];
  const fakeWeek     = () => weekDays.map(d => ({ d, taken: Math.random() > 0.25 }));

  // ── actions ──
  const toggleMed     = id => setMeds(p => p.map(m => m.id===id ? {...m, taken:!m.taken} : m));
  const toggleRitual  = id => setRituals(p => p.map(r => r.id===id ? {...r, done:!r.done} : r));
  const removeMed     = id => setMeds(p => p.filter(m => m.id!==id));
  const removeRitual  = id => setRituals(p => p.filter(r => r.id!==id));

  const addMed = () => {
    if (!newMed.name.trim()) return;
    setMeds(p => [...p, { id:Date.now(), ...newMed, color:COLORS[p.length % COLORS.length], taken:false }]);
    setNewMed(emptyMed); setAddMode(null);
  };
  const addRitual = () => {
    if (!newRitual.label.trim()) return;
    setRituals(p => [...p, { id:Date.now(), ...newRitual, color:COLORS[p.length % COLORS.length], done:false }]);
    setNewRitual(emptyRitual); setAddMode(null);
  };

  const startEdit = (item, type) => {
    setEditId(item.id);
    setEditBuf({ ...item, _type: type });
  };
  const saveEdit = () => {
    if (editBuf._type === "med") {
      setMeds(p => p.map(m => m.id===editId ? { ...editBuf } : m));
    } else {
      setRituals(p => p.map(r => r.id===editId ? { ...editBuf } : r));
    }
    setEditId(null); setEditBuf({});
  };
  const cancelEdit = () => { setEditId(null); setEditBuf({}); };

  // ── shared chip picker ──
  const ChipRow = ({ label, options, value, onPick }) => (
    <div style={{ marginBottom:14 }}>
      <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:8 }}>{label}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {options.map(o => (
          <div key={o} onClick={() => onPick(o)}
            style={{ padding:"6px 13px", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer",
              background: value===o?"#F28C8C":"#F5F5F5", color:value===o?"#fff":"#717171",
              border:`1.5px solid ${value===o?"#F28C8C":"transparent"}`, transition:"all .15s" }}>
            {o}
          </div>
        ))}
      </div>
    </div>
  );
  const EmojiPicker = ({ emojis, value, onPick }) => (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
      {emojis.map(e => (
        <div key={e} onClick={() => onPick(e)}
          style={{ width:36, height:36, borderRadius:10, cursor:"pointer", fontSize:18,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:`2px solid ${value===e?"#F28C8C":"#E8E8E8"}`,
            background: value===e?"rgba(242,140,140,.1)":"#fff" }}>
          {e}
        </div>
      ))}
    </div>
  );

  // ── inline edit form ──
  const EditForm = ({ buf, setBuf, type }) => (
    <div style={{ padding:"14px 16px", background:"#FFFDF9", borderRadius:14, border:"1.5px solid #F28C8C22", marginBottom:10 }}>
      <Field label={type==="med" ? "Medication name" : "Ritual name"}
        value={type==="med" ? buf.name : buf.label}
        onChange={v => setBuf(b => type==="med" ? {...b, name:v} : {...b, label:v})} />
      {type === "med" && (
        <Field label="Dosage (e.g. 50mg)" value={buf.dose||""} onChange={v => setBuf(b=>({...b,dose:v}))} />
      )}
      <ChipRow label="Time" options={TIMES} value={buf.time} onPick={v=>setBuf(b=>({...b,time:v}))} />
      {type === "med" && (
        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:6 }}>Scheduled hr</p>
            <input type="number" min="0" max="23" value={buf.scheduledHour??8}
              onChange={e=>setBuf(b=>({...b,scheduledHour:+e.target.value}))}
              style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #E8E8E8", fontSize:13, fontFamily:"Jost,sans-serif", outline:"none" }} />
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:6 }}>Alert after (hrs)</p>
            <input type="number" min="0.5" max="12" step="0.5" value={buf.missedAfterHours??2}
              onChange={e=>setBuf(b=>({...b,missedAfterHours:+e.target.value}))}
              style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #E8E8E8", fontSize:13, fontFamily:"Jost,sans-serif", outline:"none" }} />
          </div>
        </div>
      )}
      <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:8 }}>Icon</p>
      <EmojiPicker emojis={type==="med" ? MED_EMOJIS : RIT_EMOJIS} value={buf.emoji} onPick={v=>setBuf(b=>({...b,emoji:v}))} />
      <div style={{ display:"flex", gap:8 }}>
        <button className="btn btn-s" style={{ flex:1, fontSize:13 }} onClick={cancelEdit}>Cancel</button>
        <button className="btn btn-p" style={{ flex:2, fontSize:13 }} onClick={saveEdit}>Save changes</button>
      </div>
    </div>
  );

  return (
    <div className="screen active">
      <div style={{ padding:"56px 24px 24px" }}>
        <div className="back-btn" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </div>

        <h1 className="serif" style={{ fontSize:28, color:"#1E293B", marginTop:18, marginBottom:6 }}>Daily<br/><em>Rituals</em></h1>

        {/* Section tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:20, marginTop:14 }}>
          {[["meds","Medications"],["rituals","Rituals"]].map(([id,label]) => (
            <button key={id} onClick={() => { setSection(id); setAddMode(null); setEditId(null); }} style={{
              flex:1, padding:"9px 0", border:"1.5px solid", borderRadius:14, fontSize:13, fontWeight:600, cursor:"pointer",
              borderColor: section===id?"#F28C8C":"#E8E8E8",
              background: section===id?"#F28C8C":"transparent",
              color: section===id?"#fff":"#717171", transition:"all .2s"
            }}>{label}</button>
          ))}
        </div>

        {/* ═══════════ MEDICATIONS SECTION ═══════════ */}
        {section === "meds" && (
          <div>
            {/* Missed banner */}
            {missedCount > 0 && (
              <div style={{ marginBottom:14, padding:"12px 16px", borderRadius:14, background:"rgba(231,76,60,.08)", border:"1.5px solid rgba(231,76,60,.25)", display:"flex", alignItems:"center", gap:10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#C0392B" }}>Missed dose{missedCount > 1 ? "s" : ""}</p>
                  <p style={{ fontSize:11, color:"#E74C3C", marginTop:1 }}>{missedCount} medication{missedCount>1?" were":" was"} not logged on time.</p>
                </div>
              </div>
            )}

            {/* Today / Week toggle */}
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>
              {["today","week"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding:"7px 18px", border:"1.5px solid", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer",
                  borderColor: view===v?"#F28C8C":"#E8E8E8",
                  background: view===v?"#F28C8C":"transparent",
                  color: view===v?"#fff":"#717171", transition:"all .2s"
                }}>{v === "today" ? "Today" : "This Week"}</button>
              ))}
            </div>

            {/* Summary ring */}
            <div className="card" style={{ marginBottom:16, display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ position:"relative", width:66, height:66, flexShrink:0 }}>
                <svg width="66" height="66" viewBox="0 0 66 66">
                  <circle cx="33" cy="33" r="26" fill="none" stroke="#F5F5F5" strokeWidth="6"/>
                  <circle cx="33" cy="33" r="26" fill="none" stroke={missedCount>0?"#E74C3C":"#F28C8C"} strokeWidth="6"
                    strokeDasharray={`${2*Math.PI*26}`}
                    strokeDashoffset={`${2*Math.PI*26*(1-adherence/100)}`}
                    strokeLinecap="round" transform="rotate(-90 33 33)"
                    style={{transition:"stroke-dashoffset .6s ease"}}/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:missedCount>0?"#E74C3C":"#F28C8C" }}>{adherence}%</span>
                </div>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:16, fontWeight:700, color:"#222" }}>{takenCount}/{meds.length} taken today</p>
                <p style={{ fontSize:12, color: missedCount>0?"#E74C3C":"#717171", marginTop:3 }}>
                  {adherence===100 ? "🌟 Perfect!" : missedCount>0 ? `⚠️ ${missedCount} overdue` : "Keep it up!"}
                </p>
              </div>
              <button onClick={() => setAddMode(m => m==="med" ? null : "med")} style={{
                width:36, height:36, borderRadius:12, border:"none", cursor:"pointer", flexShrink:0,
                background: addMode==="med"?"#E04040":"#F28C8C", color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 12px rgba(242,140,140,.35)", transition:"all .2s"
              }}>
                {addMode==="med"
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                }
              </button>
            </div>

            {/* Add med form */}
            {addMode === "med" && (
              <div className="card" style={{ marginBottom:16 }}>
                <p style={{ fontSize:13, fontWeight:700, color:"#F28C8C", marginBottom:12 }}>New Medication</p>
                <Field label="Medication name" value={newMed.name} onChange={v => setNewMed(p=>({...p,name:v}))} />
                <Field label="Dosage (e.g. 50mg)" value={newMed.dose} onChange={v => setNewMed(p=>({...p,dose:v}))} />
                <ChipRow label="Time of Day" options={TIMES} value={newMed.time} onPick={v=>setNewMed(p=>({...p,time:v}))} />
                <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:6 }}>Scheduled hr</p>
                    <input type="number" min="0" max="23" value={newMed.scheduledHour}
                      onChange={e=>setNewMed(p=>({...p,scheduledHour:+e.target.value}))}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:12, border:"1.5px solid #E8E8E8", fontSize:14, fontFamily:"Jost,sans-serif", outline:"none" }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:6 }}>Alert after (hrs)</p>
                    <input type="number" min="0.5" max="12" step="0.5" value={newMed.missedAfterHours}
                      onChange={e=>setNewMed(p=>({...p,missedAfterHours:+e.target.value}))}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:12, border:"1.5px solid #E8E8E8", fontSize:14, fontFamily:"Jost,sans-serif", outline:"none" }} />
                  </div>
                </div>
                <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:8 }}>Icon</p>
                <EmojiPicker emojis={MED_EMOJIS} value={newMed.emoji} onPick={v=>setNewMed(p=>({...p,emoji:v}))} />
                <button className="btn btn-p" onClick={addMed}>Add Medication</button>
              </div>
            )}

            {/* Med list */}
            {view === "today" ? (
              <div>
                {meds.length === 0 && addMode!=="med" ? (
                  <div style={{ textAlign:"center", padding:"40px 20px", color:"#A8A8B0" }}>
                    <p style={{ fontSize:32, marginBottom:10 }}>💊</p>
                    <p style={{ fontSize:14 }}>No medications added yet</p>
                  </div>
                ) : meds.map((m, idx) => {
                  const missed = isMissed(m);
                  const isEditing = editId === m.id;
                  return (
                    <div key={m.id}>
                      {(idx===0||meds[idx-1].time!==m.time) && (
                        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginTop:idx===0?0:14, marginBottom:8 }}>{m.time}</p>
                      )}
                      {isEditing ? (
                        <EditForm buf={editBuf} setBuf={setEditBuf} type="med" />
                      ) : (
                        <div className="card" style={{ marginBottom:10, opacity:m.taken?0.75:1, transition:"opacity .3s", border:missed?"1.5px solid rgba(231,76,60,.3)":"1.5px solid transparent" }}>
                          {missed && (
                            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 8px", background:"rgba(231,76,60,.07)", borderRadius:8, marginBottom:10 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="3" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                              <p style={{ fontSize:10, fontWeight:700, color:"#C0392B" }}>MISSED — {m.missedAfterHours}h past scheduled time</p>
                            </div>
                          )}
                          <div className="med-row">
                            <div className="med-pill" style={{ background:missed?"rgba(231,76,60,.1)":m.color }}>{m.emoji}</div>
                            <div style={{ flex:1 }}>
                              <p style={{ fontSize:15, fontWeight:600, color:missed?"#C0392B":"#222", textDecoration:m.taken?"line-through":"none" }}>{m.name}</p>
                              <p style={{ fontSize:12, color:"#71717A", marginTop:2 }}>{m.dose} · {m.time}{m.scheduledHour!=null?` (${m.scheduledHour}:00)`:""}</p>
                            </div>
                            <div onClick={() => startEdit(m, "med")} style={{ padding:"6px", cursor:"pointer", opacity:.5, marginRight:2 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </div>
                            <button className={`med-toggle ${m.taken?"on":"off"}`} onClick={() => toggleMed(m.id)} />
                            <div onClick={() => removeMed(m.id)} style={{ marginLeft:8, cursor:"pointer", padding:4, opacity:.35 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                {meds.map(m => {
                  const week = fakeWeek();
                  const wTaken = week.filter(d=>d.taken).length;
                  return (
                    <div key={m.id} className="card" style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                        <div className="med-pill" style={{ background:m.color }}>{m.emoji}</div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:14, fontWeight:600, color:"#222" }}>{m.name} <span style={{ fontWeight:400, color:"#71717A" }}>{m.dose}</span></p>
                          <p style={{ fontSize:11, color:"#71717A", marginTop:1 }}>{wTaken}/7 days this week</p>
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:"#F28C8C" }}>{Math.round(wTaken/7*100)}%</span>
                      </div>
                      <div style={{ display:"flex", gap:4 }}>
                        {week.map((d,i) => (
                          <div key={i} style={{ flex:1, textAlign:"center" }}>
                            <div style={{ width:"100%", aspectRatio:1, borderRadius:8, background:d.taken?"#F28C8C":"#F0F0F0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                              {d.taken && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <p style={{ fontSize:9, color:"#A8A8B0", marginTop:4 }}>{d.d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ RITUALS SECTION ═══════════ */}
        {section === "rituals" && (
          <div>
            {/* Summary strip */}
            <div className="card" style={{ marginBottom:16, display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ position:"relative", width:66, height:66, flexShrink:0 }}>
                <svg width="66" height="66" viewBox="0 0 66 66">
                  <circle cx="33" cy="33" r="26" fill="none" stroke="#F5F5F5" strokeWidth="6"/>
                  <circle cx="33" cy="33" r="26" fill="none" stroke="#3D9A6E" strokeWidth="6"
                    strokeDasharray={`${2*Math.PI*26}`}
                    strokeDashoffset={`${2*Math.PI*26*(1-(rituals.length ? ritDone/rituals.length : 0))}`}
                    strokeLinecap="round" transform="rotate(-90 33 33)"
                    style={{transition:"stroke-dashoffset .6s ease"}}/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#3D9A6E" }}>{rituals.length ? Math.round(ritDone/rituals.length*100) : 0}%</span>
                </div>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:16, fontWeight:700, color:"#222" }}>{ritDone}/{rituals.length} done today</p>
                <p style={{ fontSize:12, color:"#71717A", marginTop:3 }}>
                  {ritDone===rituals.length && rituals.length>0 ? "🌟 All done!" : "Keep going!"}
                </p>
              </div>
              <button onClick={() => setAddMode(m => m==="ritual" ? null : "ritual")} style={{
                width:36, height:36, borderRadius:12, border:"none", cursor:"pointer", flexShrink:0,
                background: addMode==="ritual"?"#E04040":"#3D9A6E", color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 12px rgba(61,154,110,.3)", transition:"all .2s"
              }}>
                {addMode==="ritual"
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                }
              </button>
            </div>

            {/* Add ritual form */}
            {addMode === "ritual" && (
              <div className="card" style={{ marginBottom:16 }}>
                <p style={{ fontSize:13, fontWeight:700, color:"#3D9A6E", marginBottom:12 }}>New Ritual</p>
                <Field label="Ritual name" value={newRitual.label} onChange={v => setNewRitual(p=>({...p,label:v}))} />
                <ChipRow label="Time of Day" options={TIMES} value={newRitual.time} onPick={v=>setNewRitual(p=>({...p,time:v}))} />
                <p style={{ fontSize:11, fontWeight:600, color:"#A8A8B0", letterSpacing:".04em", textTransform:"uppercase", marginBottom:8 }}>Icon</p>
                <EmojiPicker emojis={RIT_EMOJIS} value={newRitual.emoji} onPick={v=>setNewRitual(p=>({...p,emoji:v}))} />
                <button className="btn btn-p" style={{ background:"#3D9A6E", boxShadow:"0 8px 20px rgba(61,154,110,.3)" }} onClick={addRitual}>Add Ritual</button>
              </div>
            )}

            {/* Ritual list grouped by time */}
            {rituals.length === 0 && addMode !== "ritual" ? (
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#A8A8B0" }}>
                <p style={{ fontSize:32, marginBottom:10 }}>🌿</p>
                <p style={{ fontSize:14 }}>No rituals yet — add one above</p>
              </div>
            ) : (
              <div>
                {TIMES.map(time => {
                  const group = rituals.filter(r => r.time === time);
                  if (!group.length) return null;
                  return (
                    <div key={time}>
                      <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginBottom:8, marginTop:4 }}>{time}</p>
                      {group.map(r => {
                        const isEditing = editId === r.id;
                        return (
                          <div key={r.id}>
                            {isEditing ? (
                              <EditForm buf={editBuf} setBuf={setEditBuf} type="ritual" />
                            ) : (
                              <div className="card" style={{ marginBottom:10, opacity:r.done?0.8:1, transition:"opacity .3s" }}>
                                <div className="med-row">
                                  <div className="med-pill" style={{ background:r.color }}>{r.emoji}</div>
                                  <div style={{ flex:1 }}>
                                    <p style={{ fontSize:15, fontWeight:600, color:"#222", textDecoration:r.done?"line-through":"none" }}>{r.label}</p>
                                    <p style={{ fontSize:12, color:"#71717A", marginTop:2 }}>{r.time}</p>
                                  </div>
                                  <div onClick={() => startEdit(r, "ritual")} style={{ padding:"6px", cursor:"pointer", opacity:.5, marginRight:2 }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                  </div>
                                  <button className={`med-toggle ${r.done?"on":"off"}`} onClick={() => toggleRitual(r.id)} />
                                  <div onClick={() => removeRitual(r.id)} style={{ marginLeft:8, cursor:"pointer", padding:4, opacity:.35 }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── BIOPHYSICAL LOG ─── */
const CYCLE_PHASES = [
  { name:"Menstruation", days:"1-5",   color:"#FFECEC", accent:"#C0392B", icon:"\uD83D\uDD34", desc:"Rest, warmth, and gentleness. Energy is lowest — honour it." },
  { name:"Follicular",   days:"6-13",  color:"#FFF3CD", accent:"#B68A20", icon:"\uD83C\uDF31", desc:"Energy rises. Good days for new starts and social connection." },
  { name:"Ovulatory",    days:"14",    color:"#D4EDDA", accent:"#3D7A5E", icon:"\u2728",        desc:"Peak energy and confidence. You may feel most yourself." },
  { name:"Luteal",       days:"15-28", color:"#E8D5F5", accent:"#7B3FA0", icon:"\uD83C\uDF15", desc:"Wind down. Sensitivity rises — protect your energy." },
];

const BiophysicalLog = ({ goBack }) => {
  const [cycleDay, setCycleDay]         = useState(14);
  const [periodOn, setPeriodOn]         = useState(false);
  const [sleepHrs, setSleepHrs]         = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [energy, setEnergy]             = useState(3);
  const [bodyNotes, setBodyNotes]       = useState("");
  const [saved, setSaved]               = useState(false);

  const getPhase = (d) => {
    if (d <= 5)  return CYCLE_PHASES[0];
    if (d <= 13) return CYCLE_PHASES[1];
    if (d === 14) return CYCLE_PHASES[2];
    return CYCLE_PHASES[3];
  };
  const phase = getPhase(cycleDay);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 1800); };

  const RatingRow = ({ label, value, onChange, emojis }) => (
    <div style={{ marginBottom:20 }}>
      <p style={{ fontSize:13, fontWeight:600, color:"#71717A", marginBottom:10 }}>{label}</p>
      <div style={{ display:"flex", gap:8 }}>
        {emojis.map((e,i)=>(
          <div key={i} onClick={()=>onChange(i+1)}
            style={{ flex:1, padding:"10px 0", borderRadius:14, textAlign:"center", fontSize:22, cursor:"pointer",
              background: value===i+1?"rgba(242,140,140,.08)":"#F5F5F5",
              border: value===i+1?"1.5px solid #F28C8C":"1.5px solid transparent",
              transform: value===i+1?"scale(1.08)":"scale(1)",
              transition:"all .18s cubic-bezier(.34,1.56,.64,1)"
            }}>{e}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="screen active">
      <div style={{ padding:"56px 24px 32px" }}>
        <div className="back-btn" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </div>

        <h1 className="serif" style={{ fontSize:28, marginTop:18, color:"#1E293B" }}>Biophysical<br/><em>Log</em></h1>
        <p style={{ fontSize:13, color:"#A8A8B0", marginTop:5, marginBottom:24 }}>Your body is a baseline, not a habit.</p>

        {/* Cycle tracker */}
        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Menstrual Cycle</p>
        <div className="card" style={{ marginBottom:16, background:phase.color, borderLeft:`4px solid ${phase.accent}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:"rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{phase.icon}</div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:phase.accent }}>{phase.name} phase</p>
              <p style={{ fontSize:11, color:phase.accent, opacity:.75 }}>Day {cycleDay} &middot; Days {phase.days}</p>
            </div>
            <div onClick={()=>setPeriodOn(b=>!b)}
              style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, padding:"5px 10px", borderRadius:100, cursor:"pointer",
                background: periodOn?"rgba(192,57,43,.12)":"rgba(255,255,255,.5)",
                border:`1px solid ${periodOn?"rgba(192,57,43,.3)":"rgba(255,255,255,.8)"}`
              }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:periodOn?"#C0392B":"#ccc" }}/>
              <span style={{ fontSize:11, fontWeight:700, color:periodOn?"#C0392B":"#888" }}>Period</span>
            </div>
          </div>
          <p style={{ fontSize:12, color:phase.accent, lineHeight:1.6, opacity:.85, marginBottom:14 }}>{phase.desc}</p>
          <div style={{ marginBottom:4 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, color:phase.accent, fontWeight:600 }}>Cycle day</span>
              <span style={{ fontSize:15, fontWeight:700, color:phase.accent }}>{cycleDay}</span>
            </div>
            <input type="range" min="1" max="28" value={cycleDay} onChange={e=>setCycleDay(+e.target.value)}
              className="g-slider" style={{ "--v":`${((cycleDay-1)/27*100).toFixed(1)}%` }}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontSize:9, color:phase.accent, opacity:.6 }}>Day 1</span>
              <span style={{ fontSize:9, color:phase.accent, opacity:.6 }}>Day 28</span>
            </div>
          </div>
        </div>

        {/* 28-day timeline */}
        <div className="card" style={{ marginBottom:16 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".05em", textTransform:"uppercase", marginBottom:10 }}>28-Day Cycle Map</p>
          <div style={{ display:"flex", gap:2 }}>
            {Array.from({length:28},(_,i)=>i+1).map(d=>{
              const ph = getPhase(d);
              return (
                <div key={d} onClick={()=>setCycleDay(d)} style={{
                  flex:1, height:20, borderRadius:4,
                  background: d===cycleDay?"#F28C8C":ph.color,
                  border: d===cycleDay?"2px solid #F28C8C":"2px solid transparent",
                  cursor:"pointer", transition:"all .15s"
                }}/>
              );
            })}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            {CYCLE_PHASES.map(p=>(
              <div key={p.name} style={{ display:"flex", alignItems:"center", gap:3 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:p.accent }}/>
                <span style={{ fontSize:9, color:"#A8A8B0" }}>{p.name.slice(0,4)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep */}
        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Sleep</p>
        <div className="card" style={{ marginBottom:16 }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:14, color:"#71717A", fontWeight:500 }}>Hours slept</span>
              <span style={{ fontSize:24, fontWeight:700, color:"#1A6A9A", fontFamily:"'Playfair Display',serif" }}>{sleepHrs}h</span>
            </div>
            <input type="range" min="3" max="12" step="0.5" value={sleepHrs} onChange={e=>setSleepHrs(+e.target.value)}
              className="g-slider" style={{ "--v":`${((sleepHrs-3)/9*100).toFixed(1)}%` }}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontSize:11, color:"#A8A8B0" }}>3h</span>
              <span style={{ fontSize:11, color:"#A8A8B0" }}>12h</span>
            </div>
          </div>
          <RatingRow label="Sleep quality" value={sleepQuality} onChange={setSleepQuality}
            emojis={["\uD83D\uDE14","\uD83D\uDE15","\uD83D\uDE10","\uD83D\uDE42","\uD83D\uDE04"]} />
        </div>

        {/* Energy */}
        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Energy & Body</p>
        <div className="card" style={{ marginBottom:16 }}>
          <RatingRow label="Energy level today" value={energy} onChange={setEnergy}
            emojis={["\uD83E\uDDB4","\uD83D\uDE2A","\uD83D\uDE10","\uD83D\uDE0A","\u26A1"]} />
          <div className="fg" style={{ marginTop:8 }}>
            <textarea className="ft" rows={3} value={bodyNotes} onChange={e=>setBodyNotes(e.target.value)} placeholder=" "/>
            <label className="fl">Body notes (pain, tension, symptoms...)</label>
          </div>
        </div>

        <button className="btn btn-p" onClick={save} style={{ fontSize:15 }}>
          {saved ? "\u2713 Logged!" : "Save Body Log"}
        </button>
      </div>
    </div>
  );
};

/* ─── SETTINGS SCREEN ─── */
const SettingsScreen = ({ goBack, onSignOut }) => {
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifCheckin, setNotifCheckin] = useState(true);
  const [notifMeds, setNotifMeds] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [biometricsPending, setBiometricsPending] = useState(false);
  const [therapistEmail, setTherapistEmail] = useState("dr.morgan@therapist.com");
  const [addingClinician, setAddingClinician] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName,  setNewName]  = useState("");
  const [clinicians, setClinicians] = useState([
    { name:"Dr. Sarah Morgan", email:"dr.morgan@therapist.com", avatar:"SM" },
  ]);
  const [saved, setSaved] = useState(false);

  // Sleep sync state
  const [sleepSources, setSleepSources] = useState({
    appleHealth: false,
    appleWatch:  false,
    garmin:      false,
    fitbit:      false,
    whoop:       false,
    googleFit:   false,
  });
  const [connectingSource, setConnectingSource] = useState(null);

  const connectSource = (key) => {
    setConnectingSource(key);
    setTimeout(() => {
      setSleepSources(prev => ({ ...prev, [key]: !prev[key] }));
      setConnectingSource(null);
    }, 1200);
  };

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{
      width:48, height:27, borderRadius:100, background: value?"#F28C8C":"#E0E0E0",
      position:"relative", cursor:"pointer", flexShrink:0,
      transition:"background .22s", boxShadow: value?"0 2px 8px rgba(242,140,140,.3)":"none"
    }}>
      <div style={{
        position:"absolute", top:3, width:21, height:21, borderRadius:"50%",
        background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)",
        left: value ? 24 : 3, transition:"left .22s cubic-bezier(.34,1.56,.64,1)"
      }}/>
    </div>
  );

  const SettingRow = ({ icon, label, sub, children, last }) => (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom: last ? "none" : "1px solid #F5F5F5" }}>
      <div style={{ width:36, height:36, borderRadius:10, background:"#F5F5F5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:14, fontWeight:500, color:"#1E293B" }}>{label}</p>
        {sub && <p style={{ fontSize:12, color:"#71717A", marginTop:2 }}>{sub}</p>}
      </div>
      {children}
    </div>
  );

  const SLEEP_APPS = [
    { key:"appleHealth", icon:"❤️", name:"Apple Health",   sub:"Sync via HealthKit", color:"#FF3B6A" },
    { key:"appleWatch",  icon:"⌚", name:"Apple Watch",    sub:"Auto-detect sleep stages", color:"#1C1C2E" },
    { key:"garmin",      icon:"🟢", name:"Garmin Connect", sub:"Body Battery + sleep score", color:"#00A86B" },
    { key:"fitbit",      icon:"🔵", name:"Fitbit",         sub:"Sleep stages & score", color:"#4CC2C4" },
    { key:"whoop",       icon:"🟡", name:"WHOOP",          sub:"Recovery & strain data", color:"#C8A400" },
    { key:"googleFit",   icon:"🔴", name:"Google Fit",     sub:"Sync via Google account", color:"#EA4335" },
  ];

  const handleBiometrics = () => {
    if (biometrics) { setBiometrics(false); return; }
    setBiometricsPending(true);
    setTimeout(() => { setBiometrics(true); setBiometricsPending(false); }, 1200);
  };

  const addClinician = () => {
    if (!newEmail.trim()) return;
    const displayName = newName.trim() || newEmail.split("@")[0];
    const parts = displayName.split(" ");
    const initials = parts.length >= 2 ? (parts[0][0]+parts[parts.length-1][0]).toUpperCase() : displayName.slice(0,2).toUpperCase();
    setClinicians(prev => [...prev, { name: displayName, email: newEmail, avatar: initials }]);
    setNewEmail(""); setNewName(""); setAddingClinician(false);
  };

  const saveSettings = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };
  const connectedCount = Object.values(sleepSources).filter(Boolean).length;

  return (
    <div className="screen active">
      <div style={{ padding:"56px 24px 24px" }}>
        <div className="back-btn" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </div>

        {/* Profile header */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:20, marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:20, background:"linear-gradient(135deg,#F28C8C,#E87070)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 6px 20px rgba(242,140,140,.3)" }}>🌿</div>
          <div>
            <h1 className="serif" style={{ fontSize:24, color:"#1E293B" }}>Profile & <em>Settings</em></h1>
            <p style={{ fontSize:13, color:"#71717A", marginTop:3 }}>Manage your account & preferences</p>
          </div>
        </div>

        {/* Notifications */}
        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Notifications</p>
        <div className="card" style={{ marginBottom:24 }}>
          <SettingRow icon="⏰" label="Daily Reminders" sub="Check-in nudges at your set time">
            <Toggle value={notifReminders} onChange={setNotifReminders} />
          </SettingRow>
          <SettingRow icon="📊" label="Check-in Prompts" sub="Morning & evening reminders">
            <Toggle value={notifCheckin} onChange={setNotifCheckin} />
          </SettingRow>
          <SettingRow icon="💊" label="Medication Reminders" sub="Alerts when doses are due" last>
            <Toggle value={notifMeds} onChange={setNotifMeds} />
          </SettingRow>
        </div>

        {/* Security */}
        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Security & Privacy</p>
        <div className="card" style={{ marginBottom:24 }}>
          <SettingRow
            icon={biometrics ? "🔒" : "🔓"}
            label="Face ID / Biometrics"
            sub={biometrics ? "Enabled — app locked on close" : biometricsPending ? "Authenticating…" : "Require biometrics to open app"}>
            {biometricsPending ? (
              <div style={{ width:48, height:27, borderRadius:100, background:"rgba(242,140,140,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:14, height:14, borderRadius:"50%", border:"2px solid #F28C8C", borderTopColor:"transparent", animation:"ringPulse .8s linear infinite" }}/>
              </div>
            ) : (
              <Toggle value={biometrics} onChange={handleBiometrics} />
            )}
          </SettingRow>
          <SettingRow icon="🔐" label="App Lock" sub="Require auth after 5 min" last>
            <Toggle value={biometrics} onChange={() => {}} />
          </SettingRow>
        </div>

        {/* ── Sleep Sync ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase" }}>Sleep Sync</p>
          {connectedCount > 0 && (
            <span style={{ fontSize:11, fontWeight:700, color:"#F28C8C", background:"rgba(242,140,140,.1)", padding:"3px 10px", borderRadius:100 }}>
              {connectedCount} connected
            </span>
          )}
        </div>
        <div className="card" style={{ marginBottom:24, padding:"4px 20px" }}>
          <p style={{ fontSize:12, color:"#71717A", lineHeight:1.6, padding:"14px 0 6px", borderBottom:"1px solid #F5F5F5" }}>
            Connect a health or fitness app to automatically pull your sleep data into the Clinical Report.
          </p>
          {SLEEP_APPS.map((app, i) => {
            const isConnected = sleepSources[app.key];
            const isConnecting = connectingSource === app.key;
            return (
              <div key={app.key} style={{
                display:"flex", alignItems:"center", gap:14, padding:"14px 0",
                borderBottom: i < SLEEP_APPS.length - 1 ? "1px solid #F5F5F5" : "none"
              }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"#F5F5F5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{app.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:500, color:"#1E293B" }}>{app.name}</p>
                  <p style={{ fontSize:12, color: isConnected ? "#F28C8C" : "#717171", marginTop:2 }}>
                    {isConnected ? "✓ Connected" : app.sub}
                  </p>
                </div>
                {isConnecting ? (
                  <div style={{ width:70, height:30, borderRadius:100, background:"#F5F5F5", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", border:"2px solid #F28C8C", borderTopColor:"transparent", animation:"ringPulse .8s linear infinite" }}/>
                  </div>
                ) : (
                  <button onClick={() => connectSource(app.key)} style={{
                    padding:"6px 14px", borderRadius:100, border:"none", fontSize:12, fontWeight:600,
                    background: isConnected ? "rgba(242,140,140,.12)" : "#F28C8C",
                    color: isConnected ? "#F28C8C" : "#fff",
                    cursor:"pointer", transition:"all .18s", flexShrink:0
                  }}>
                    {isConnected ? "Disconnect" : "Connect"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Care Team */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase" }}>Care Team</p>
          <span onClick={() => setAddingClinician(s=>!s)} style={{ fontSize:12, color:"#F28C8C", fontWeight:600, cursor:"pointer" }}>
            {addingClinician ? "✕ Cancel" : "+ Add Clinician"}
          </span>
        </div>
        <div className="card" style={{ marginBottom: addingClinician ? 10 : 24 }}>
          {clinicians.map((c, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom: i < clinicians.length-1 ? "1px solid #F5F5F5":"none" }}>
              <div style={{ width:42, height:42, borderRadius:14, background:"linear-gradient(135deg,#F28C8C,#E87070)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>{c.avatar}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1E293B" }}>{c.name}</p>
                <p style={{ fontSize:12, color:"#A8A8B0", marginTop:2 }}>{c.email}</p>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ padding:"5px 10px", borderRadius:8, background:"rgba(242,140,140,.1)", fontSize:12, color:"#F28C8C", fontWeight:600, cursor:"pointer" }}>Message</div>
                <div onClick={() => setClinicians(prev=>prev.filter((_,j)=>j!==i))} style={{ padding:"5px 8px", borderRadius:8, background:"#FFECEC", fontSize:12, color:"#C0392B", cursor:"pointer" }}>✕</div>
              </div>
            </div>
          ))}
          {clinicians.length === 0 && (
            <p style={{ textAlign:"center", color:"#A8A8B0", fontSize:13, padding:"16px 0" }}>No care team members added yet</p>
          )}
        </div>

        {addingClinician && (
          <div className="add-med-form cs-item" style={{ marginBottom:24 }}>
            <p style={{ fontSize:13, fontWeight:700, color:"#F28C8C", marginBottom:12 }}>Add Care Team Member</p>
            <Field label="Full name" value={newName} onChange={setNewName} />
            <Field label="Email address" value={newEmail} onChange={setNewEmail} />
            <button className="btn btn-p" onClick={addClinician} style={{ marginTop:4 }}>Add to Care Team</button>
          </div>
        )}

        {/* Data sharing */}
        <p style={{ fontSize:11, fontWeight:700, color:"#A8A8B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Data & Reports</p>
        <div className="card" style={{ marginBottom:32 }}>
          <SettingRow icon="📤" label="Auto-share Reports" sub="Weekly summary sent to care team">
            <Toggle value={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow icon="📅" label="Report Frequency" sub="Weekly" last>
            <span style={{ fontSize:13, color:"#A8A8B0" }}>Weekly ›</span>
          </SettingRow>
        </div>

        <button className="btn btn-p" onClick={saveSettings} style={{ marginBottom:10, borderRadius:100 }}>
          {saved ? "✓ Settings Saved" : "Save Settings"}
        </button>
        <button className="btn btn-s" onClick={onSignOut} style={{ color:"#C0392B", borderColor:"#C0392B" }}>Sign Out</button>
      </div>
    </div>
  );
};

/* ─── LIBRARY SCREEN ─── */
const LibraryScreen = ({ goBack }) => {
  const [section, setSection] = useState(null);
  const [expandedTrap, setExpandedTrap] = useState(null);
  const [activeTag, setActiveTag] = useState("All");
  const [openRead, setOpenRead] = useState(null);

  const QUICK_READS = [
    // Cognitive Mastery
    { id:"lawyer",      tag:"Cognitive Mastery", emoji:"⚖️",  time:"2 min", title:"The Lawyer in Your Head", subtitle:"How to argue against your own negative biases.",
      body:"Your inner critic is a terrible lawyer — it only presents evidence for the prosecution. In CBT, we give the defence equal airtime. When a negative thought arises, ask: 'If I were defending myself in court, what evidence would I use?' You'll often find the case against you is weaker than it feels. The key is to treat your thoughts as hypotheses to test, not verdicts to accept." },
    { id:"fact-feeling", tag:"Cognitive Mastery", emoji:"🧪",  time:"2 min", title:"Fact vs. Feeling",        subtitle:"A 30-second rule to stop emotional reasoning.",
      body:"Emotional reasoning says: 'I feel it, therefore it's true.' The antidote is a 30-second pause. Ask: 'Is this a fact — something I could prove in court — or is this a feeling?' Feelings are valid and real, but they are not facts. 'I feel like a failure' is not evidence that you are one. This tiny linguistic distinction can interrupt a spiral before it starts." },
    { id:"spotlight",   tag:"Cognitive Mastery", emoji:"🔦",  time:"2 min", title:"The Spotlight Effect",    subtitle:"Why people aren't judging you as much as you think.",
      body:"We overestimate how much others notice our mistakes, appearance, or anxiety. This is the spotlight effect — we feel lit up on a stage, but most people are busy being the star of their own show. Research by Thomas Gilovich found that people consistently overestimate how much others notice and remember their blunders. The audience is largely distracted by their own concerns." },
    { id:"should",      tag:"Cognitive Mastery", emoji:"📋",  time:"2 min", title:'"Should" Statements',     subtitle:"How 'should' creates unnecessary guilt.",
      body:"'Should,' 'must,' and 'ought to' are linguistic trip wires. They imply a rule was broken — and when rules are broken, guilt or shame follow automatically. Try replacing 'I should have done that better' with 'I would have preferred to do that better.' The outcome is the same; the emotional weight is entirely different. 'Could' is even more empowering: it restores choice." },
    { id:"catastrophe", tag:"Cognitive Mastery", emoji:"🌪️",  time:"2 min", title:"Catastrophizing 101",     subtitle:"Why our brains prepare for the worst — and how to stop.",
      body:"The brain is wired for survival, not optimism. Catastrophizing — jumping to the worst-case scenario — evolved to keep us safe. But in modern life, it fires for emails and presentations as well as genuine threats. The fix: ask 'What's the realistic worst case? Could I survive it?' Then ask 'What's the realistic best case? And the most likely case?' Zoom out to see the full picture." },
    { id:"yet",         tag:"Cognitive Mastery", emoji:"🌱",  time:"2 min", title:"The Power of 'Yet'",      subtitle:"A simple word that builds a growth mindset.",
      body:"Carol Dweck's research on growth mindset shows that the word 'yet' is one of the most psychologically powerful additions to your vocabulary. 'I can't do this' becomes 'I can't do this yet.' It shifts the framing from a fixed identity statement to a temporary, changeable condition. The brain responds to this shift — it opens possibility rather than closing it." },
    { id:"labeling",    tag:"Cognitive Mastery", emoji:"🏷️",  time:"2 min", title:"Thought Labeling",        subtitle:"Why 'I am having the thought that…' creates instant relief.",
      body:"When a painful thought feels real and overwhelming, it's because you're fused with it. Defusion — a technique from ACT (Acceptance and Commitment Therapy) — creates distance. Try adding: 'I am having the thought that I am a failure.' The thought is still there, but now it's an observable event, not a truth. Your brain calms down because you've stopped treating the thought as reality." },
    // Biophysical Links
    { id:"vagus",       tag:"Biophysical Links", emoji:"🫀",  time:"2 min", title:"The Vagus Nerve",          subtitle:"Physical hacks to turn off fight-or-flight.",
      body:"The vagus nerve is the superhighway between your body and your brain's calm centre. You can activate it deliberately. Try a long, slow exhale (twice as long as the inhale) — this stimulates the vagus nerve and lowers heart rate within seconds. Cold water on your face, humming, and gargling also work. Your body has a built-in calm switch; these are the ways to flip it." },
    { id:"rem",         tag:"Biophysical Links", emoji:"🌙",  time:"2 min", title:"REM & Resilience",          subtitle:"How sleep deprivation makes thinking traps feel real.",
      body:"Sleep researcher Matthew Walker found that after sleep deprivation, the amygdala (the brain's fear centre) becomes 60% more reactive. Simultaneously, the prefrontal cortex — your rational, logical brain — goes offline. This is why everything feels more catastrophic after a poor night's sleep. Your thinking traps aren't worse; your ability to see through them is simply diminished." },
    { id:"blood-sugar", tag:"Biophysical Links", emoji:"🍎",  time:"2 min", title:"Blood Sugar & Mood",        subtitle:"Why 'hangry' is a real cognitive state.",
      body:"When blood sugar drops, the brain — which runs almost exclusively on glucose — starts to panic. Cortisol and adrenaline are released to raise blood sugar, triggering irritability, anxiety, and poor concentration. This is 'hangry': a genuine cognitive state where your emotional regulation is biologically impaired. Keeping blood sugar stable with regular meals isn't just physical health — it's mental health." },
    { id:"cortisol",    tag:"Biophysical Links", emoji:"⏰",  time:"2 min", title:"The Cortisol Spike",        subtitle:"Why we feel anxious in the morning — and how to move through it.",
      body:"Cortisol follows a natural daily rhythm, peaking about 30–45 minutes after waking. This Cortisol Awakening Response (CAR) is your body's biological alarm clock — it prepares you for the day by mobilising energy. But for people with anxiety, this spike can feel like dread or panic. Knowing it's biological helps you ride it without interpreting it as a sign something is wrong." },
    { id:"cycle",       tag:"Biophysical Links", emoji:"🌕",  time:"2 min", title:"Cycle Sensitivity",         subtitle:"How hormonal phases change your tolerance for stress.",
      body:"During the luteal phase (roughly days 15–28), progesterone rises and falls sharply. This hormonal turbulence increases the brain's sensitivity to stress and reduces the effectiveness of serotonin. Anxiety, irritability, and negative self-talk are more intense — not because circumstances changed, but because the biology changed. Tracking your cycle alongside your mood isn't just wellness; it's radical self-knowledge." },
    { id:"posture",     tag:"Biophysical Links", emoji:"🧘",  time:"2 min", title:"Posture & Power",            subtitle:"The link between how you sit and how confident you feel.",
      body:"Amy Cuddy's research on 'power posing' showed that expansive postures increase testosterone and decrease cortisol — measurably changing your hormonal state in minutes. But even beyond the posing, simple upright posture has been shown to improve mood and self-confidence. The mind-body connection runs in both directions: your body doesn't just respond to how you feel; it shapes how you feel." },
    // Modern Zen
    { id:"digital",     tag:"Modern Zen",        emoji:"📱",  time:"2 min", title:"Digital Minimalism",        subtitle:"How to set phone boundaries that protect your peace.",
      body:"Cal Newport defines digital minimalism as 'a philosophy of technology use in which you focus your online time on a small number of carefully selected and optimised activities.' Every notification is an interruption that costs you more than the second it takes to dismiss it — it fragments your attention for up to 23 minutes. Start with one boundary: no phone in the first 30 minutes of the morning. One boundary, consistently held, changes the whole day." },
    { id:"tidy",        tag:"Modern Zen",        emoji:"🧹",  time:"2 min", title:"The 5-Minute Tidy",         subtitle:"Why external order creates internal calm.",
      body:"The environment sends constant signals to the nervous system. Clutter activates low-level cortisol responses because the brain reads unfinished visual tasks as unresolved threats. Marie Kondo's insight isn't really about tidying — it's about creating an environment that doesn't constantly tax your nervous system. Five minutes of order each morning is a form of meditation: you're curating the signals your brain receives all day." },
    { id:"monotask",    tag:"Modern Zen",        emoji:"🎯",  time:"2 min", title:"Monotasking",                subtitle:"Why multitasking is actually high-speed anxiety.",
      body:"What we call multitasking is actually rapid task-switching, and the cognitive cost is enormous. Each switch costs mental energy and increases cortisol. Research from Stanford found that heavy multitaskers are worse at filtering irrelevant information and slower at task-switching than those who rarely multitask. The solution is intentional single-tasking: one task, a defined time, no switching. The brain calms down when it knows what it's supposed to be doing." },
    { id:"mornings",    tag:"Modern Zen",        emoji:"🌅",  time:"2 min", title:"Intentional Mornings",      subtitle:"The no-phone first hour and its effect on daily focus.",
      body:"The first hour of the day sets the neurological tone for everything that follows. Checking your phone immediately exposes your not-yet-fully-awake prefrontal cortex to the demands, comparisons, and anxieties of the social world. Neuroscientist Andrew Huberman recommends delaying phone use for at least 30 minutes — ideally getting morning sunlight first, which anchors your circadian rhythm and raises dopamine baseline for the day." },
    { id:"gratitude",   tag:"Modern Zen",        emoji:"✨",  time:"2 min", title:"The Gratitude Circuit",     subtitle:"The neuroscience of why counting wins actually works.",
      body:"Gratitude practice isn't spiritual bypassing — it's neuroscience. When you consciously note things you appreciate, the brain releases dopamine and serotonin, and the prefrontal cortex is activated. Over time, you're literally rewiring the brain's default mode toward noticing the positive rather than scanning for threats. The key is specificity: 'I'm grateful for the specific conversation I had with my friend today' is far more effective than 'I'm grateful for my friends.'" },
    // Crisis & Calm
    { id:"square",      tag:"Crisis & Calm",     emoji:"🟦",  time:"2 min", title:"Square Breathing",          subtitle:"The Navy SEAL technique for instant nervous system reset.",
      body:"Box breathing (used by US Navy SEALs and emergency responders) works in four equal counts: inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 4 times. The mechanism is physiological: slowing your breath stimulates the vagus nerve, activates the parasympathetic nervous system, and lowers cortisol. The military uses it because it works reliably under extreme stress — which means it will absolutely work for your anxiety." },
    { id:"anchor",      tag:"Crisis & Calm",     emoji:"⚓",  time:"2 min", title:"The Anchor Technique",      subtitle:"How to find your 'safe place' mentally during overwhelm.",
      body:"When anxiety peaks, the mind needs an anchor — something concrete and sensory to return to. Choose in advance: a physical sensation (both feet on the floor, the texture of your sleeve), a specific memory of safety, or a single calming word you repeat silently. The anchor's power comes from repeated use: the more you return to it in calm moments, the stronger the neural pathway becomes — so when you need it most, it's already there, waiting." },
    { id:"stress-script-read", tag:"Resilience", emoji:"⚡", time:"2 min", title:"The Stress Script", subtitle:"How to vaccinate your mind against stress before it hits.",
      body:"Stress usually catches us off guard. We spend our energy cleaning up the emotional mess after the crisis has already hit. But what if you could prepare your mind for a stressor before it even happens?\n\nThis is Stress Inoculation Training — the psychological equivalent of a dress rehearsal.\n\n**The 'What If' vs. the 'What Is'**\nAnxiety thrives on the unknown. When you anticipate a stressor — a difficult conversation, a big presentation — your brain constructs a horror movie of the future. The fix is to write it down. Turning a vague 'feeling of dread' into a concrete sentence ('I am worried I will lose my train of thought') moves the problem from your emotional centre — the amygdala — to your logic centre — the prefrontal cortex.\n\n**Drafting Your Script**\nResilience is not about being tough. It is about having a better internal monologue. Instead of letting your brain run its default Panic Script, you give it a new set of lines. Old script: 'I'm going to mess this up.' New script: 'I might feel a spike of adrenaline. That's just my body preparing for action. I will focus on the very next sentence.'\n\n**The Power of the Pivot**\nIn the heat of the moment, you don't need a ten-page manual. You need a Safety Valve — a single, grounding phrase you've pre-selected. Example: 'I can handle this feeling. It is temporary.'\n\nBy practising your response to a small dose of stress now, you build the psychological antibodies needed for the real thing. You aren't avoiding the challenge. You are simply changing your role from the victim of the stress to the architect of the response.\n\nA plan is the ultimate antidote to panic.", journalCta:"stress-script" },
  ];

  const QUICK_TAGS = ["All","Cognitive Mastery","Biophysical Links","Modern Zen","Crisis & Calm","Resilience"];
  const TAG_COLORS = {
    "Cognitive Mastery": { bg:"#FFF3E0", accent:"#B68A20" },
    "Biophysical Links": { bg:"#EAF4FF", accent:"#4A6FA8" },
    "Modern Zen":        { bg:"#EDF7ED", accent:"#3D7A5E" },
    "Crisis & Calm":     { bg:"#FFECEC", accent:"#C0392B" },
    "Resilience":        { bg:"#EDF1F7", accent:"#4A6A9A" },
  };

  const filteredReads = activeTag === "All"
    ? QUICK_READS
    : QUICK_READS.filter(r => r.tag === activeTag);

  const THINKING_TRAPS = [
    { name:"All-or-Nothing Thinking", emoji:"⚖️", color:"#FFECEC", accent:"#C0392B", desc:"Seeing things in black and white, with no middle ground.", example:"'If I'm not perfect, I'm a total failure.'", reframe:"Most situations live in the grey. What's a more balanced way to see this?" },
    { name:"Catastrophizing", emoji:"🌪️", color:"#FFF3CD", accent:"#B68A20", desc:"Blowing things out of proportion — imagining the worst possible outcome.", example:"'I made a mistake at work. I'm going to get fired.'", reframe:"What's the most realistic outcome? How likely is the worst case?" },
    { name:"Mind Reading", emoji:"🔮", color:"#E8D5F5", accent:"#7B3FA0", desc:"Assuming you know what others are thinking, usually negatively.", example:"'She didn't smile at me — she must hate me.'", reframe:"You can't read minds. What are other possible explanations?" },
    { name:"Fortune Telling", emoji:"🎱", color:"#D1ECF1", accent:"#1A7F93", desc:"Predicting the future negatively, as if it's already decided.", example:"'I know I'll mess up the interview.'", reframe:"The future isn't written. What evidence do you actually have?" },
    { name:"Emotional Reasoning", emoji:"💢", color:"#FDE8D0", accent:"#D4702A", desc:"Believing that because you feel something, it must be true.", example:"'I feel stupid, so I must be stupid.'", reframe:"Feelings are real, but they aren't facts. What do the facts say?" },
    { name:"Should Statements", emoji:"📋", color:"#E8F4EC", accent:"#3D7A5E", desc:"Rigid rules about how you or others must behave, leading to guilt or anger.", example:"'I should always be productive. I shouldn't need help.'", reframe:"Replace 'should' with 'could' — what would you prefer, without the pressure?" },
    { name:"Labelling", emoji:"🏷️", color:"#EDE8FF", accent:"#5B4FA0", desc:"Attaching a negative global label to yourself or others based on one event.", example:"'I forgot to reply. I'm a terrible friend.'", reframe:"One action doesn't define a person. What's a fairer description?" },
    { name:"Personalization", emoji:"🎯", color:"#FFECEC", accent:"#C0392B", desc:"Blaming yourself for things outside your control.", example:"'My friend is upset. It must be something I did.'", reframe:"Many factors shape outcomes. What else could be contributing?" },
    { name:"Mental Filter", emoji:"🔍", color:"#FFF3CD", accent:"#B68A20", desc:"Focusing on one negative detail while ignoring the bigger picture.", example:"'I got great feedback but one person had a criticism — the whole thing was a failure.'", reframe:"What would happen if you gave equal weight to the positives?" },
    { name:"Discounting the Positive", emoji:"🙈", color:"#D4EDDA", accent:"#3D7A5E", desc:"Dismissing good things as unimportant or not counting.", example:"'Anyone could have done that. It doesn't mean I'm capable.'", reframe:"Why don't the positives count? Would you say this to a friend?" },
  ];

  const CBT_BASICS = [
    { title:"What is CBT?", icon:"🧠", content:"Cognitive Behavioural Therapy (CBT) is one of the most evidence-based forms of therapy in the world. It's based on a simple but powerful idea: our thoughts, feelings, and behaviours are all connected. When we change how we think about something, we change how we feel — and what we do." },
    { title:"The Thought–Feeling–Behaviour Loop", icon:"🔄", content:"Every emotional experience starts with a situation. That situation triggers an automatic thought (often below conscious awareness). That thought creates a feeling. That feeling drives a behaviour. CBT teaches you to interrupt this loop — especially at the thought stage — by examining whether your thoughts are accurate and helpful." },
    { title:"Automatic Thoughts", icon:"⚡", content:"Automatic thoughts are fast, habitual mental reactions that happen without effort. They often feel like facts, but they're actually interpretations. The same situation (e.g. a friend doesn't text back) can produce very different automatic thoughts in different people — and very different emotional outcomes." },
    { title:"The Evidence Test", icon:"🔬", content:"When you notice a distressing thought, ask: What's the evidence FOR this thought? What's the evidence AGAINST it? Would a fair judge — looking at all the evidence — agree with my conclusion? This is the core skill of cognitive restructuring: replacing distorted thinking with balanced thinking." },
    { title:"Behavioural Activation", icon:"🌱", content:"Depression and anxiety often cause us to withdraw from activities that would actually help us feel better. Behavioural activation is the practice of deliberately scheduling small, meaningful activities — even when you don't feel like it. Action often comes before motivation, not after." },
    { title:"The 5-Column Record", icon:"📝", content:"The classic CBT worksheet: (1) Situation — what happened? (2) Automatic thought — what did your mind say? (3) Emotion — what did you feel, and how intensely? (4) Evidence for and against the thought. (5) Balanced thought — a fairer, more realistic perspective. This app's Thought Record is built on this structure." },
  ];

  const CRISIS = [
    { name:"Samaritans (UK)", number:"116 123", desc:"Free, 24/7. Call or email jo@samaritans.org", color:"#FFECEC", accent:"#C0392B" },
    { name:"Crisis Text Line", number:"Text HOME to 85258", desc:"Free, 24/7 text-based support (UK)", color:"#FFF3CD", accent:"#B68A20" },
    { name:"988 Suicide & Crisis Lifeline (US)", number:"Call or text 988", desc:"Free, 24/7 call and text support", color:"#E8D5F5", accent:"#7B3FA0" },
    { name:"MIND (UK)", number:"0300 123 3393", desc:"Mental health support and information", color:"#D4EDDA", accent:"#3D7A5E" },
    { name:"Shout", number:"Text SHOUT to 85258", desc:"UK's first 24/7 text crisis service", color:"#D1ECF1", accent:"#1A7F93" },
  ];

  const sections = [
    { id:"traps", emoji:"⚡", title:"Thinking Traps", sub:"10 common cognitive distortions", color:"#FFF3E0", accent:"#B68A20" },
    { id:"cbt", emoji:"🧠", title:"CBT Basics", sub:"How it works & why it helps", color:"#E8F0FF", accent:"#4A6FA8" },
    { id:"crisis", emoji:"🆘", title:"Crisis Resources", sub:"When you need immediate support", color:"#FFECEC", accent:"#C0392B" },
  ];

  // ── Quick Read full article ──
  if (openRead) {
    const r = openRead;
    const tc = TAG_COLORS[r.tag] || { bg:"#F5F5F5", accent:"#717171" };
    return (
      <div className="screen active">
        <div style={{ padding:"56px 20px 40px" }}>
          <div className="back-btn" onClick={() => setOpenRead(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F28C8C" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:100, background:tc.bg, marginTop:18, marginBottom:14 }}>
            <span style={{ fontSize:10, fontWeight:700, color:tc.accent, letterSpacing:".05em", textTransform:"uppercase" }}>{r.tag}</span>
            <span style={{ fontSize:10, color:tc.accent, opacity:.6 }}>· {r.time}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <span style={{ fontSize:36 }}>{r.emoji}</span>
            <h1 className="serif" style={{ fontSize:26, color:"#1E293B", lineHeight:1.2 }}><em>{r.title}</em></h1>
          </div>
          <p style={{ fontSize:14, color:"#71717A", marginBottom:28, lineHeight:1.6, fontStyle:"italic" }}>{r.subtitle}</p>
          <div style={{ borderLeft:"3px solid " + tc.accent, paddingLeft:18, marginBottom:24 }}>
            {r.body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize:15, color:"#1E293B", lineHeight:1.85, marginBottom: i < r.body.split('\n\n').length-1 ? 14 : 0,
                fontWeight: para.startsWith('**') ? 700 : 400 }}>
                {para.replace(/\*\*/g, '')}
              </p>
            ))}
          </div>
          <div style={{ padding:"14px 16px", background:tc.bg, borderRadius:14, marginBottom: r.journalCta ? 14 : 0 }}>
            <p style={{ fontSize:12, fontWeight:700, color:tc.accent, marginBottom:4 }}>💡 Reflect</p>
            <p style={{ fontSize:13, color:"#71717A", lineHeight:1.65 }}>How does this connect to something you've experienced recently?</p>
          </div>
          {r.journalCta && (
            <button onClick={()=>{ setOpenRead(null); navigate(r.journalCta); }}
              style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", cursor:"pointer",
                background:`linear-gradient(180deg,${tc.accent} 0%,${tc.accent}DD 100%)`,
                color:"#fff", fontSize:15, fontWeight:700, fontFamily:"Jost,sans-serif",
                boxShadow:`0 4px 18px ${tc.accent}44`, marginTop:0 }}>
              Ready to draft your first script? Open Journal →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Drill into a section
  if (section === "traps") return (
    <div className="screen active">
      <div style={{ padding:"56px 20px 24px" }}>
        <div className="back-btn" onClick={() => { setExpandedTrap(null); setSection(null); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Library
        </div>
        <h1 className="serif" style={{ fontSize:26, marginTop:18, marginBottom:6, color:"#1C1C2E" }}>Thinking <em>Traps</em></h1>
        <p style={{ fontSize:13, color:"#9A9490", marginBottom:22 }}>Tap any pattern to learn how to spot and reframe it.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {THINKING_TRAPS.map((t, i) => (
            <div key={t.name}>
              <div className="card card-press" style={{ borderLeft:`4px solid ${t.accent}`, background: expandedTrap===i ? t.color : "#fff" }}
                onClick={() => setExpandedTrap(expandedTrap===i ? null : i)}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:22 }}>{t.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:14, color:"#1C1C2E" }}>{t.name}</p>
                    <p style={{ fontSize:12, color:"#9A9490", marginTop:2 }}>{t.desc}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4AFA7" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transform: expandedTrap===i ? "rotate(180deg)":"rotate(0deg)", transition:"transform .2s" }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
                {expandedTrap === i && (
                  <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${t.accent}33` }}>
                    <p style={{ fontSize:12, fontWeight:700, color:"#9A9490", letterSpacing:".04em", textTransform:"uppercase", marginBottom:6 }}>Example thought</p>
                    <p style={{ fontSize:13, color:"#6B6560", fontStyle:"italic", marginBottom:14 }}>{t.example}</p>
                    <div style={{ padding:"10px 14px", background:"rgba(61,122,94,.07)", borderRadius:10 }}>
                      <p style={{ fontSize:12, fontWeight:700, color:"#3D7A5E", marginBottom:4, letterSpacing:".04em", textTransform:"uppercase" }}>💬 Reframe prompt</p>
                      <p style={{ fontSize:13, color:"#3D7A5E", lineHeight:1.6 }}>{t.reframe}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === "cbt") return (
    <div className="screen active">
      <div style={{ padding:"56px 20px 24px" }}>
        <div className="back-btn" onClick={() => setSection(null)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Library
        </div>
        <h1 className="serif" style={{ fontSize:26, marginTop:18, marginBottom:6, color:"#1C1C2E" }}>CBT <em>Basics</em></h1>
        <p style={{ fontSize:13, color:"#9A9490", marginBottom:22 }}>The science and skills behind this app.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {CBT_BASICS.map((b, i) => (
            <div key={b.title} className="card cs-item" style={{ animationDelay:`${i*.06}s` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:22 }}>{b.icon}</span>
                <p style={{ fontWeight:700, fontSize:15, color:"#1C1C2E" }}>{b.title}</p>
              </div>
              <p style={{ fontSize:13, color:"#6B6560", lineHeight:1.75 }}>{b.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === "crisis") return (
    <div className="screen active">
      <div style={{ padding:"56px 20px 24px" }}>
        <div className="back-btn" onClick={() => setSection(null)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Library
        </div>
        <h1 className="serif" style={{ fontSize:26, marginTop:18, marginBottom:6, color:"#1C1C2E" }}>Crisis <em>Resources</em></h1>
        <div style={{ padding:"14px 16px", background:"rgba(192,57,43,.07)", borderRadius:14, marginBottom:22, borderLeft:"4px solid #C0392B" }}>
          <p style={{ fontSize:13, color:"#C0392B", lineHeight:1.65 }}>If you're in immediate danger, call <strong>999 (UK)</strong> or <strong>911 (US)</strong> right away. You deserve support — reaching out is a sign of strength.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {CRISIS.map((c, i) => (
            <div key={c.name} className="card cs-item" style={{ animationDelay:`${i*.07}s`, borderLeft:`4px solid ${c.accent}`, background:c.color }}>
              <p style={{ fontWeight:700, fontSize:15, color:"#1C1C2E" }}>{c.name}</p>
              <p style={{ fontSize:18, fontWeight:700, color:c.accent, marginTop:6, fontFamily:"'Playfair Display',serif" }}>{c.number}</p>
              <p style={{ fontSize:12, color:"#6B6560", marginTop:4 }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(61,122,94,.07)", borderRadius:14 }}>
          <p style={{ fontSize:13, color:"#3D7A5E", lineHeight:1.65 }}>💚 Talking to someone — even a stranger on a helpline — can make a real difference. These services are confidential and non-judgmental.</p>
        </div>
      </div>
    </div>
  );

  // Default: Library home
  return (
    <div className="screen active">
      <div style={{ padding:"56px 20px 120px" }}>
        <div className="back-btn" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </div>
        <h1 className="serif" style={{ fontSize:28, marginTop:20, color:"#1C1C2E" }}>Learn & <em>Explore</em></h1>
        <p style={{ fontSize:13, color:"#9A9490", marginTop:5, marginBottom:24 }}>A curated collection of knowledge to browse at your own pace.</p>

        {/* Section cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
          {sections.map((s, i) => (
            <div key={s.id} className="card card-press cs-item" style={{ animationDelay:`${i*.08}s`, background:s.color, borderLeft:`4px solid ${s.accent}`, display:"flex", alignItems:"center", gap:16 }}
              onClick={() => setSection(s.id)}>
              <span style={{ fontSize:32 }}>{s.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:700, fontSize:16, color:"#1C1C2E" }}>{s.title}</p>
                <p style={{ fontSize:12, color:"#6B6560", marginTop:3 }}>{s.sub}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          ))}
        </div>

        {/* Quick Reads */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:"#A8A8B0", letterSpacing:".05em", marginBottom:2 }}>Quick Reads</p>
            <p style={{ fontSize:11, color:"#B0B0B0" }}>{QUICK_READS.length} insights · 2 min each</p>
          </div>
        </div>

        {/* Tag filter pills */}
        <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:4, marginBottom:16 }}>
          {QUICK_TAGS.map(t => {
            const on = activeTag === t;
            const tc = TAG_COLORS[t];
            return (
              <div key={t} onClick={() => setActiveTag(t)} style={{
                flexShrink:0, padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer",
                background: on ? "#F28C8C" : "#F2F2F0",
                color: on ? "#fff" : "#71717A",
                border: `1.5px solid ${on ? "#F28C8C" : "transparent"}`,
                transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
              }}>{t}</div>
            );
          })}
        </div>

        {/* Article cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filteredReads.map((r, i) => {
            const tc = TAG_COLORS[r.tag] || { bg:"#F5F5F5", accent:"#717171" };
            return (
              <div key={r.id} className="card card-press cs-item" style={{ animationDelay:`${i*.04}s`, padding:"16px 18px" }}
                onClick={() => setOpenRead(r)}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:tc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                    {r.emoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <span style={{ fontSize:9, fontWeight:700, color:tc.accent, background:tc.bg, padding:"2px 8px", borderRadius:100, letterSpacing:".04em" }}>{r.tag}</span>
                      <span style={{ fontSize:9, color:"#B0B0B0" }}>· {r.time}</span>
                    </div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#1E293B", lineHeight:1.3, marginBottom:4 }}>{r.title}</p>
                    <p style={{ fontSize:12, color:"#71717A", lineHeight:1.5 }}>{r.subtitle}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D0D0D0" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0, marginTop:4 }}><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── FLOATING MENU ─── */
const FloatingMenu = ({ navigate, screen }) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 160);
  };

  const go = (s) => { close(); setTimeout(() => navigate(s), 100); };

  const items = [
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      label:"Profile & Settings", screen:"settings"
    },
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
      label:"Share Report", screen:"insights"
    },
  ];

  return (
    <>
      <div className="fab" onClick={() => open ? close() : setOpen(true)}>
        {open
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        }
      </div>

      {open && <div className="fmb" onClick={close} />}

      {open && (
        <div className={`fmenu${closing?" closing":""}`}>
          <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid rgba(0,0,0,.06)" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#9A9490", letterSpacing:".06em", textTransform:"uppercase" }}>Cope</p>
          </div>
          {items.map(({ icon, label, screen:s }) => (
            <div key={label} className="fmi" onClick={() => go(s)}>
              <span style={{ color: s === screen ? "#3D7A5E" : "#7A7570", display:"flex", alignItems:"center" }}>{icon}</span>
              <span style={{ fontSize:13, fontWeight:500, color: s === screen ? "#3D7A5E" : "#1C1C2E" }}>{label}</span>
              {s === screen && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"#3D7A5E" }} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ─── TAB BAR ─── */
const TabBar = ({ active, setActive }) => {
  const C = "#F28C8C";
  const G = "#B0B0B0";
  const left = [
    { id:"home",     label:"Home",     icon:(on)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?C:G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id:"coping",   label:"Tools",    icon:(on)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?C:G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> },
  ];
  const right = [
    { id:"insights", label:"Insights", icon:(on)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?C:G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { id:"library",  label:"Learn",    icon:(on)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?C:G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> },
  ];
  const logActive = active === "checkin";
  return (
    <div className="tabbar" style={{ display:"flex", alignItems:"flex-end", paddingBottom:0 }}>
      {left.map(t => (
        <div key={t.id} className={`tab${active===t.id?" on":""}`} onClick={() => setActive(t.id)}>
          <div className="tab-icon">{t.icon(active===t.id)}</div>
          <span className="tl">{t.label}</span>
        </div>
      ))}
      {/* Centre LOG button */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:8, position:"relative" }}
        onClick={() => setActive("checkin")}>
        <div style={{
          width:52, height:52, borderRadius:"50%", marginBottom:4, marginTop:-18,
          background: logActive ? "#E07070" : "#F28C8C",
          boxShadow: logActive ? "0 4px 16px rgba(242,140,140,.35)" : "0 4px 18px rgba(242,140,140,.28), 0 1px 0 rgba(255,255,255,.15) inset",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
          transform: logActive ? "scale(0.94)" : "scale(1)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:".05em", color: logActive ? C : G, textTransform:"uppercase" }}>Log</span>
      </div>
      {right.map(t => (
        <div key={t.id} className={`tab${active===t.id?" on":""}`} onClick={() => setActive(t.id)}>
          <div className="tab-icon">{t.icon(active===t.id)}</div>
          <span className="tl">{t.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── TOAST ─── */
const Toast = ({ msg, visible }) => (
  visible ? <div className={`toast ${visible?"in":""}`}>{msg}</div> : null
);

/* ─── ROOT APP ─── */
/* ─── ONBOARDING ─── */
const COPE_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAADICAYAAAAeGRPoAACtR0lEQVR42uz9ebhtWVnfi39GM+dcze5OX30HVVRHFU1RdAWCgiAQGiGKXbgaozeJUWNyo7nJvT+91/SNUW+iiYlJNFEwCIKKAgoI0hZQFAUU1RfV1+nP3ns1c84xxvv7Y4y51lx773OqOQcLdb7nWc/aZ++1155rzDHe9vt+X+ikk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk0466aSTTjrppJNOOumkk046+YYQ1S3Bn+O7JttvoDyRuyvdUp56AeOP5XG+jezw3MnjFQ0EQKPSc/N/2fJ/VABpnrv1/7pqetGnfKt4bzr5RhHbLcE39jmTnV7Y+lrLgn0nNL+jdlKYO0n4y734Su9ozNUWM3My/0eln7bMzcLzSX0n9Y3hVJ2uR3/6l68XnhU6fTX/ftzT6f9Kp4vWs/2r/hyv/5m/f/rUH0s9zs8vO+sNteU7oTPq33BucSdPochj6BS1k0aS0/hDrUeXniFGeSpscW7mz2Gn76uQnIGwg0na/tzJqRyqRaskWwxxeKzf7db/9BXPqb4+iTHvdMefzwCxkz+ruyBn5sbISd5eo2cHUrX+pCPgO4OysxKTU0Q3rderJ3lfun3f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3BhwHhWLp5nOBuA8rlYSegI0RJnXiIjHE7EuJSLiSe2kC9Za1HsQQTQUyjnvcehiY6uCqkERkPYRGN6p4tHQr5ZnUAcDYT5nfT43vR8giIiIuJT7OSIiIkLmpN37cv8Joec5Oc7z730pWO2/V4y1R0REREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREXIn4/wFmt6p8eJIEfQAAAABJRU5ErkJggg==";

const OB_SLIDES = [
  {
    id: "checkin",
    tag: "Daily Check-in",
    title: "Know yourself\nin 60 seconds",
    body: "Log mood, anxiety, sleep and habits every day. A simple ritual that builds a picture only time can reveal.",
    accent: "#F28C8C",
    dark: false,
    visual: "checkin",
  },
  {
    id: "insights",
    tag: "Mood Insights",
    title: "See the patterns\nyou can\u2019t feel yet",
    body: "Your Mood Map shows every day at a glance. Spot what lifts you and what drains you \u2014 backed by your own data.",
    accent: "#7B9EE8",
    dark: false,
    visual: "insights",
  },
  {
    id: "thoughts",
    tag: "Thought Records",
    title: "Reframe the\nthoughts that\nhurt",
    body: "Walk through a guided CBT exercise that challenges distorted thinking and builds a more balanced perspective.",
    accent: "#9B6FC4",
    dark: false,
    visual: "thoughts",
  },
  {
    id: "body",
    tag: "Sleep & Habits",
    title: "Your body\naffects your\nmind",
    body: "Track how sleep hours and daily habits shift your wellbeing score. Sync with Apple Health for automatic data.",
    accent: "#4DBFA8",
    dark: false,
    visual: "body",
  },
  {
    id: "care",
    tag: "Care Team",
    title: "Share with\nyour therapist\nin one tap",
    body: "Generate a clinical-grade report covering mood trends, thought records, and habit data \u2014 ready before your next session.",
    accent: "#F28C8C",
    dark: false,
    visual: "care",
  },
];

const OB_GOALS = [
  { id:"mood",    emoji:"\uD83C\uDF21", label:"Track my mood"       },
  { id:"anxiety", emoji:"\uD83E\uDEB4", label:"Manage anxiety"      },
  { id:"sleep",   emoji:"\uD83C\uDF19", label:"Improve sleep"       },
  { id:"habits",  emoji:"\u2705",        label:"Build habits"        },
  { id:"therapy", emoji:"\uD83D\uDECB", label:"Support therapy"     },
  { id:"cycle",   emoji:"\uD83C\uDF15", label:"Understand my cycle" },
];

/* ── Mini visual previews for each slide ── */
const SlideVisual = ({ id, accent }) => {
  const s = { borderRadius:20, overflow:"hidden", width:"100%", maxWidth:300, margin:"0 auto" };

  if (id === "checkin") return (
    <div style={{ ...s, background:"#fff", padding:18, boxShadow:"0 16px 48px rgba(0,0,0,.1)" }}>
      <p style={{ fontSize:10, color:"#A8A8B0", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", marginBottom:14 }}>How are you feeling?</p>
      <div style={{ display:"flex", justifyContent:"space-between", gap:6, marginBottom:16 }}>
        {FACES.map((f, i) => {
          const isSelected = i === 3;
          return (
            <div key={f.score} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{
                width:"100%", aspectRatio:1, borderRadius:"50%",
                background: isSelected ? f.fill : f.bg,
                display:"flex", alignItems:"center", justifyContent:"center",
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                boxShadow: isSelected ? `0 4px 14px ${f.fill}55` : "none",
              }}>
                <svg viewBox="0 0 24 24" width="64%" height="64%">{f.eyes}{f.mouth}{f.tear}</svg>
              </div>
              <span style={{ fontSize:8, color: isSelected ? f.fill : "#C0C0C0", fontWeight: isSelected?700:400 }}>{f.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ height:4, borderRadius:100, background:"#F5F5F5", marginBottom:8 }}>
        <div style={{ width:"60%", height:"100%", borderRadius:100, background:`linear-gradient(90deg,${accent},${accent}99)` }}/>
      </div>
      <p style={{ fontSize:10, color:"#A8A8B0", display:"flex", justifyContent:"space-between" }}>
        <span>Anxiety level</span><span style={{ color:accent, fontWeight:700 }}>3/5</span>
      </p>
    </div>
  );

  if (id === "insights") return (
    <div style={{ ...s, background:"#fff", padding:18, boxShadow:"0 16px 48px rgba(0,0,0,.1)" }}>
      <p style={{ fontSize:10, color:"#A8A8B0", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>This month</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:14 }}>
        {[0,0,42,65,80,55,0,30,88,72,60,0,0,50,90,78,65,82,0,0,40,55,70,88,62,45,0,30].map((v,i) => (
          <div key={i} style={{ aspectRatio:"1",borderRadius:5,background: v===0?"#F5F5F5":`rgba(242,140,140,${v/100})` }}/>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {[{l:"Avg mood",v:"73",c:accent},{l:"Streak",v:"12d",c:"#3D9A6E"},{l:"Check-ins",v:"24",c:"#7B9EE8"}].map(it=>(
          <div key={it.l} style={{ flex:1,background:"#FAF9F6",borderRadius:10,padding:"8px 6px",textAlign:"center" }}>
            <p style={{ fontSize:15,fontWeight:700,color:it.c }}>{it.v}</p>
            <p style={{ fontSize:8,color:"#A8A8B0",marginTop:2 }}>{it.l}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (id === "thoughts") return (
    <div style={{ ...s, background:"#fff", padding:18, boxShadow:"0 16px 48px rgba(0,0,0,.1)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <div style={{ width:6,height:36,borderRadius:100,background:accent,flexShrink:0 }}/>
        <div>
          <p style={{ fontSize:9,color:"#A8A8B0",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em" }}>The thought</p>
          <p style={{ fontSize:12,color:"#333",fontStyle:"italic",lineHeight:1.4,marginTop:2 }}>"I always mess everything up."</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
        {["Catastrophising","Mind reading"].map(t=>(
          <div key={t} style={{ padding:"4px 8px",borderRadius:100,background:accent+"15",fontSize:9,color:accent,fontWeight:700 }}>{t}</div>
        ))}
      </div>
      <div style={{ background:"#F0FFF8",borderRadius:12,padding:"10px 12px" }}>
        <p style={{ fontSize:9,color:"#3D9A6E",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Balanced view</p>
        <p style={{ fontSize:11,color:"#333",lineHeight:1.5 }}>I made a mistake. That doesn’t define me.</p>
      </div>
    </div>
  );

  if (id === "body") return (
    <div style={{ ...s, background:"#fff", padding:18, boxShadow:"0 16px 48px rgba(0,0,0,.1)" }}>
      <p style={{ fontSize:10,color:"#A8A8B0",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:12 }}>Sleep vs Mood</p>
      <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:56, marginBottom:12 }}>
        {[{s:40,m:35},{s:55,m:50},{s:70,m:62},{s:85,m:80},{s:60,m:55},{s:90,m:85},{s:75,m:70}].map((d,i)=>(
          <div key={i} style={{ flex:1, display:"flex", alignItems:"flex-end", gap:2 }}>
            <div style={{ flex:1, height:`${d.s*0.56}px`, borderRadius:"3px 3px 0 0", background:`${accent}44` }}/>
            <div style={{ flex:1, height:`${d.m*0.56}px`, borderRadius:"3px 3px 0 0", background:accent }}/>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <span style={{ fontSize:9,color:"#A8A8B0",display:"flex",alignItems:"center",gap:4 }}><span style={{ width:8,height:8,borderRadius:2,background:`${accent}55`,display:"inline-block" }}/> Sleep hrs</span>
        <span style={{ fontSize:9,color:"#A8A8B0",display:"flex",alignItems:"center",gap:4 }}><span style={{ width:8,height:8,borderRadius:2,background:accent,display:"inline-block" }}/> Mood score</span>
      </div>
    </div>
  );

  if (id === "care") return (
    <div style={{ ...s, background:"#fff", padding:18, boxShadow:"0 16px 48px rgba(0,0,0,.1)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${accent},${accent}99)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M4 4h16v16H4z"/><path d="M8 10h8M8 14h5"/></svg>
        </div>
        <div>
          <p style={{ fontSize:12,fontWeight:700,color:"#222" }}>Clinical Report</p>
          <p style={{ fontSize:10,color:"#A8A8B0" }}>Ready to share</p>
        </div>
        <div style={{ marginLeft:"auto",padding:"4px 10px",borderRadius:100,background:accent,fontSize:9,color:"#fff",fontWeight:700 }}>Send</div>
      </div>
      {["Mood trends","Thought records","Sleep data","Habit impact"].map((item,i)=>(
        <div key={item} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<3?"1px solid #F5F5F5":"none" }}>
          <div style={{ width:14,height:14,borderRadius:"50%",background:accent+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p style={{ fontSize:11,color:"#555" }}>{item}</p>
        </div>
      ))}
    </div>
  );

  return null;
};

const OnboardingFlow = ({ onComplete }) => {
  // ── step: "splash" | "name" | "mood" | "goals" | "features" | "auth" | "signup" | "ready"
  const [step,       setStep]     = useState("splash");
  const [obName,     setObName]   = useState("");
  const [nameInput,  setNameInput]= useState("");
  const [obMood,     setObMood]   = useState(null);   // moodScore 1-5
  const [goals,      setGoals]    = useState([]);
  const [featIdx,    setFeatIdx]  = useState(0);
  const [email,      setEmail]    = useState("");
  const [pass,       setPass]     = useState("");
  const [showPass,   setShowPass] = useState(false);
  const [isLogin,    setIsLogin]  = useState(false);
  const [busy,       setBusy]     = useState(false);
  const [errs,       setErrs]     = useState({});
  const [readyTick,  setReadyTick]= useState(0);

  // Splash auto-advance (fallback if user doesn't tap)
  useEffect(() => {
    if (step !== "splash") return;
    const t = setTimeout(() => setStep("name"), 4200);
    return () => clearTimeout(t);
  }, [step]);

  // Ready auto-complete
  useEffect(() => {
    if (step !== "ready") return;
    let n = 0;
    const t = setInterval(() => { n++; setReadyTick(n); if (n >= 3) { clearInterval(t); setTimeout(() => onComplete(obName), 700); } }, 440);
    return () => clearInterval(t);
  }, [step]);

  const toggleGoal = (id) => setGoals(g => g.includes(id) ? g.filter(x=>x!==id) : [...g, id]);

  const passStrength = pass.length === 0 ? 0 : pass.length < 6 ? 1 : pass.length < 10 ? 2 : pass.length < 14 ? 3 : 4;
  const strengthColor = ["","#F28C8C","#F5C76A","#A8D5C2","#3D9A6E"][passStrength];
  const strengthLabel = ["","Too short","Okay","Good","Strong"][passStrength];

  const validate = () => {
    const e = {};
    if (!email.includes("@"))  e.email = "Enter a valid email";
    if (pass.length < 6)       e.pass  = "At least 6 characters";
    setErrs(e); return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    setBusy(true);
    setErrs({});
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password: pass });
      } else {
        result = await supabase.auth.signUp({ email, password: pass });
      }
      if (result.error) {
        setErrs({ general: result.error.message });
        setBusy(false);
      } else {
        setStep("ready");
      }
    } catch {
      setErrs({ general: "Something went wrong. Please try again." });
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.includes("@")) { setErrs({ email: "Enter your email first" }); return; }
    await supabase.auth.resetPasswordForEmail(email);
    setErrs({ general: "✉️ Reset link sent — check your inbox." });
  };

  // ── Shared layout shell ──
  const STEPS_ORDER = ["name","mood","goals","features","auth"];
  const stepIdx = STEPS_ORDER.indexOf(step);
  const progressPct = stepIdx >= 0 ? ((stepIdx) / (STEPS_ORDER.length - 1)) * 100 : 0;

  const Shell = ({ children, showProgress=true, noPad=false }) => (
    <div style={{ height:"100svh", display:"flex", flexDirection:"column", background:"#fff", overflow:"hidden" }}>
      {showProgress && stepIdx >= 0 && (
        <div style={{ height:3, background:"#F0F0F0", flexShrink:0 }}>
          <div style={{ height:"100%", width:`${progressPct}%`, background:"#F28C8C", borderRadius:"0 2px 2px 0", transition:"width .5s cubic-bezier(.4,0,.2,1)" }}/>
        </div>
      )}
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding: noPad?"0":"32px 28px 40px", overflowY:"auto" }}>
        {children}
      </div>
    </div>
  );

  const Btn = ({ children, onClick, secondary, disabled, style={} }) => (
    <button onClick={onClick} disabled={disabled}
      style={{
        width:"100%", padding:"16px", borderRadius:100, fontSize:15, fontWeight:700,
        fontFamily:"Jost,sans-serif", cursor: disabled?"default":"pointer", border:"none",
        background: secondary ? "transparent" : "#F28C8C",
        color: secondary ? "#B0B0B0" : "#fff",
        boxShadow: secondary ? "none" : "0 8px 24px rgba(242,140,140,.28)",
        opacity: disabled ? .4 : 1,
        transition:"all .2s",
        ...style,
      }}>{children}</button>
  );

  // ── SPLASH ──
  const [splashPhase, setSplashPhase] = React.useState(0); // 0=orb, 1=logo, 2=words, 3=tap
  React.useEffect(() => {
    if (step !== "splash") return;
    const timers = [
      setTimeout(() => setSplashPhase(1), 600),
      setTimeout(() => setSplashPhase(2), 1300),
      setTimeout(() => setSplashPhase(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  if (step === "splash") return (
    <div onClick={() => splashPhase >= 3 && setStep("name")}
      style={{ height:"100svh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        background:"#FAF9F6", position:"relative", overflow:"hidden",
        cursor: splashPhase >= 3 ? "pointer" : "default",
      }}>

      {/* Background breathing orbs */}
      <div style={{ position:"absolute", width:420, height:420, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(242,140,140,.32) 0%, rgba(242,140,140,.12) 55%, transparent 75%)",
        top:"50%", left:"50%",
        animation:"sp-orb 4s ease-in-out infinite",
        animationDelay:"0s", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", width:260, height:260, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(200,144,10,.22) 0%, rgba(242,140,140,.10) 50%, transparent 75%)",
        top:"42%", left:"52%",
        animation:"sp-orb2 6s ease-in-out infinite",
        pointerEvents:"none" }}/>
      {/* Expanding ring on logo appear */}
      {splashPhase >= 1 && (
        <>
          <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%",
            border:"2.5px solid rgba(242,140,140,.65)",
            top:"50%", left:"50%",
            animation:"sp-ring 1.2s cubic-bezier(.4,0,.2,1) both",
            pointerEvents:"none" }}/>
          <div style={{ position:"absolute", width:240, height:240, borderRadius:"50%",
            border:"1.5px solid rgba(242,140,140,.35)",
            top:"50%", left:"50%",
            animation:"sp-ring 1.6s cubic-bezier(.4,0,.2,1) .15s both",
            pointerEvents:"none" }}/>
        </>
      )}

      {/* Floating particles */}
      {splashPhase >= 2 && [
        {x:"-60px",y:"-90px",s:.6,d:0},
        {x:"70px",y:"-70px",s:.4,d:.1},
        {x:"-80px",y:"40px",s:.5,d:.05},
        {x:"90px",y:"60px",s:.45,d:.15},
        {x:"20px",y:"-110px",s:.35,d:.08},
        {x:"-30px",y:"100px",s:.55,d:.12},
      ].map((p,i)=>(
        <div key={i} style={{
          position:"absolute", top:"50%", left:"50%",
          width:8*p.s, height:8*p.s, borderRadius:"50%",
          background:"rgba(242,140,140,.5)",
          "--px":p.x, "--py":p.y,
          animation:`sp-particle 2.4s cubic-bezier(.4,0,.2,1) ${p.d}s both`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* Logo */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0, position:"relative", zIndex:2 }}>
        {splashPhase >= 1 && (
          <div style={{ animation:"sp-logo .8s cubic-bezier(.34,1.56,.64,1) both" }}>
            <p style={{
              fontFamily:"'Poppins',sans-serif",
              fontSize:34,
              fontWeight:600,
              color:"#F28C8C",
              letterSpacing:".14em",
              lineHeight:1,
              margin:0,
              textShadow:"0 4px 32px rgba(242,140,140,.3)",
            }}>cope</p>
          </div>
        )}

        {/* Word reveal */}
        {splashPhase >= 2 && (
          <div style={{ textAlign:"center", marginTop:14 }}>
            <p style={{ fontSize:11, color:"#C0B8B0", letterSpacing:".22em", textTransform:"uppercase",
              fontFamily:"Jost,sans-serif", fontWeight:600,
              animation:"sp-word .6s cubic-bezier(.4,0,.2,1) both" }}>
              mental clarity starts here
            </p>
          </div>
        )}

        {/* Tap to continue */}
        {splashPhase >= 3 && (
          <div style={{ marginTop:48, display:"flex", flexDirection:"column", alignItems:"center", gap:10,
            animation:"sp-word .5s cubic-bezier(.4,0,.2,1) both" }}>
            <div style={{ display:"flex", gap:6 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%",
                background:"rgba(242,140,140,.45)",
                animation:`sp-tap 1.4s ease ${i*.18}s infinite` }}/>)}
            </div>
            <p style={{ fontSize:12, color:"#C0B8B0", fontFamily:"Jost,sans-serif", fontWeight:500,
              letterSpacing:".08em", animation:`sp-tap 2s ease .3s infinite` }}>
              tap to begin
            </p>
          </div>
        )}
      </div>

      {/* Subtle bottom gradient */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:120,
        background:"linear-gradient(to top, rgba(242,140,140,.06) 0%, transparent 100%)",
        pointerEvents:"none" }}/>
    </div>
  );

  // ── NAME ──
  if (step === "name") return (
    <Shell>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <img src={COPE_LOGO} alt="cope" style={{ width:48, height:48, objectFit:"contain", marginBottom:32 }}/>
        <p style={{ fontSize:13, color:"#F28C8C", fontWeight:700, letterSpacing:".05em", textTransform:"uppercase", marginBottom:10 }}>Welcome</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:"#1A1A1A", lineHeight:1.25, marginBottom:10 }}>
          <em>Hi! I'm Cope.</em><br/>What's your name?
        </h1>
        <p style={{ fontSize:14, color:"#A8A8B0", lineHeight:1.7, marginBottom:36 }}>
          I'll use this to personalise your experience.
        </p>
        <div style={{
          borderRadius:18, border:"2px solid #F28C8C", padding:"16px 20px",
          display:"flex", alignItems:"center", gap:12, marginBottom:12,
          boxShadow:"0 4px 20px rgba(242,140,140,.12)", background:"#fff",
        }}>
          <input
            autoFocus value={nameInput} onChange={e=>setNameInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&nameInput.trim()){ setObName(nameInput.trim()); setStep("mood"); }}}
            placeholder="Your first name…"
            style={{ flex:1, border:"none", outline:"none", fontSize:20, fontFamily:"'Playfair Display',serif", fontStyle:"italic", color:"#1E293B", background:"transparent" }}
          />
          {nameInput.trim() && (
            <div style={{ width:32,height:32,borderRadius:"50%",background:"#F28C8C",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:"ob-pop .3s cubic-bezier(.34,1.56,.64,1) both" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Btn onClick={()=>{ if(nameInput.trim()){ setObName(nameInput.trim()); setStep("mood"); }}} disabled={!nameInput.trim()}>
          Continue →
        </Btn>
        <Btn secondary onClick={()=>{ setIsLogin(true); setStep("auth"); }}>Already have an account? Sign in</Btn>
      </div>
    </Shell>
  );

  // ── MOOD ──
  if (step === "mood") return (
    <Shell>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <p style={{ fontSize:13, color:"#F28C8C", fontWeight:700, letterSpacing:".05em", textTransform:"uppercase", marginBottom:10 }}>Quick check-in</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:"#1A1A1A", lineHeight:1.3, marginBottom:8 }}>
          <em>How are you feeling,</em><br/>{obName}?
        </h1>
        <p style={{ fontSize:14, color:"#A8A8B0", lineHeight:1.7, marginBottom:40 }}>
          Tap how you're feeling right now — no judgment.
        </p>

        <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:20 }}>
          {FACES.map(f => {
            const on = obMood === f.score;
            return (
              <div key={f.score} onClick={()=>setObMood(f.score)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }}>
                <div style={{
                  width:"100%", aspectRatio:1, borderRadius:"50%",
                  background: on ? f.fill : f.bg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transform: on ? "scale(1.18)" : "scale(1)",
                  transition:"all .25s cubic-bezier(.34,1.56,.64,1)",
                  boxShadow: on ? `0 6px 20px ${f.fill}55` : "none",
                }}>
                  <svg viewBox="0 0 24 24" width="62%" height="62%">{f.eyes}{f.mouth}{f.tear}</svg>
                </div>
                <span style={{ fontSize:10, fontWeight: on?700:400, color: on?f.fill:"#C0C0C0", textAlign:"center" }}>{f.label}</span>
              </div>
            );
          })}
        </div>

        {obMood && (
          <div style={{ padding:"14px 18px", borderRadius:16, background:`${FACE_FILLS[obMood]}12`, border:`1.5px solid ${FACE_FILLS[obMood]}30`, animation:"ob-fade .3s ease both" }}>
            <p style={{ fontSize:13, color:FACE_FILLS[obMood], fontWeight:600, lineHeight:1.65 }}>
              {obMood === 1 && "That takes courage to admit. Cope is here to help you through moments like this."}
              {obMood === 2 && "It's okay to have heavy days. Let's work through this together."}
              {obMood === 3 && "Steady is a great place to start. Let's build on this."}
              {obMood === 4 && "Good energy — let's channel it into habits that last."}
              {obMood === 5 && "Love that! Let's capture what's working and make it stick."}
            </p>
          </div>
        )}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Btn onClick={()=>setStep("goals")} disabled={!obMood}>
          {obMood ? "That's how I feel →" : "Tap a mood to continue"}
        </Btn>
        <Btn secondary onClick={()=>setStep("goals")}>Skip for now</Btn>
      </div>
    </Shell>
  );

  // ── GOALS ──
  if (step === "goals") return (
    <Shell>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <p style={{ fontSize:13, color:"#F28C8C", fontWeight:700, letterSpacing:".05em", textTransform:"uppercase", marginBottom:10 }}>Personalise</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:"#1A1A1A", lineHeight:1.3, marginBottom:8 }}>
          <em>What brings you</em><br/>to Cope?
        </h1>
        <p style={{ fontSize:14, color:"#A8A8B0", lineHeight:1.7, marginBottom:24 }}>
          Pick everything that applies — I'll tailor your experience.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {OB_GOALS.map(g => {
            const on = goals.includes(g.id);
            return (
              <div key={g.id} onClick={()=>toggleGoal(g.id)} style={{
                padding:"18px 12px 14px", borderRadius:20, cursor:"pointer", textAlign:"center",
                background: on?"rgba(242,140,140,.06)":"#FAFAFA",
                border: on?"1.5px solid #F28C8C":"1.5px solid #EBEBEB",
                transform: on?"scale(1.02)":"scale(1)",
                transition:"all .22s cubic-bezier(.34,1.56,.64,1)",
                boxShadow: on?"0 4px 16px rgba(242,140,140,.12)":"none",
              }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{g.emoji}</div>
                <p style={{ fontSize:13, fontWeight:600, color: on?"#F28C8C":"#717171", lineHeight:1.3 }}>{g.label}</p>
                {on && (
                  <div style={{ width:18,height:18,borderRadius:"50%",background:"#F28C8C",margin:"8px auto 0",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Btn onClick={()=>setStep("features")} disabled={goals.length === 0}>
          {goals.length > 0 ? `I'm here for ${goals.length} thing${goals.length>1?"s":""} →` : "Select at least one"}
        </Btn>
        <Btn secondary onClick={()=>setStep("features")}>Skip</Btn>
      </div>
    </Shell>
  );

  // ── FEATURES ──
  const FEATURES = [
    { id:"checkin", emoji:"📊", accent:"#F28C8C", title:"Daily Check-in", body:"60-second mood, anxiety, sleep & habits ritual that builds a picture only time reveals.", visual:"checkin" },
    { id:"journals", emoji:"📓", accent:"#B68A20", title:"Guided Journals", body:"CBT-backed journaling prompts tailored to exactly how you're feeling — not generic advice.", visual:"thoughts" },
    { id:"insights", emoji:"🗺️", accent:"#7B9EE8", title:"Mood Map", body:"A visual calendar that shows your emotional patterns at a glance. Spot what lifts you.", visual:"insights" },
  ];
  const feat = FEATURES[featIdx];

  if (step === "features") return (
    <Shell noPad>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        {/* Feature card */}
        <div key={featIdx} style={{
          flex:1, padding:"40px 28px 24px",
          display:"flex", flexDirection:"column",
          animation:"ob-slide-in .3s cubic-bezier(.4,0,.2,1) both",
        }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            {/* Mini preview */}
            <div style={{ marginBottom:28 }}>
              <SlideVisual id={feat.visual} accent={feat.accent}/>
            </div>
            {/* Tag + title */}
            <div style={{ display:"inline-flex", alignSelf:"flex-start", padding:"4px 12px", borderRadius:100, background:`${feat.accent}15`, marginBottom:12 }}>
              <span style={{ fontSize:10, fontWeight:800, color:feat.accent, letterSpacing:".08em", textTransform:"uppercase" }}>{feat.emoji} Feature {featIdx+1} of {FEATURES.length}</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"#1A1A1A", lineHeight:1.3, marginBottom:10 }}>
              <em>{feat.title}</em>
            </h2>
            <p style={{ fontSize:14, color:"#888", lineHeight:1.75, maxWidth:320 }}>{feat.body}</p>
          </div>
        </div>

        {/* Dot indicator */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, paddingBottom:16 }}>
          {FEATURES.map((_,i)=>(
            <div key={i} onClick={()=>setFeatIdx(i)} style={{ height:6, width:i===featIdx?22:6, borderRadius:100, background:i===featIdx?feat.accent:"#E0E0E0", transition:"all .35s cubic-bezier(.34,1.56,.64,1)", cursor:"pointer" }}/>
          ))}
        </div>

        {/* Nav */}
        <div style={{ padding:"0 28px 40px", display:"flex", flexDirection:"column", gap:10 }}>
          {featIdx < FEATURES.length - 1 ? (
            <div style={{ display:"flex", gap:10 }}>
              {featIdx > 0 && (
                <button onClick={()=>setFeatIdx(i=>i-1)} style={{ width:52,height:52,borderRadius:"50%",background:"#F5F5F5",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
              )}
              <Btn onClick={()=>setFeatIdx(i=>i+1)} style={{ flex:1, background:`linear-gradient(135deg,${feat.accent},${feat.accent}cc)`, boxShadow:`0 8px 24px ${feat.accent}40` }}>
                Next →
              </Btn>
            </div>
          ) : (
            <Btn onClick={()=>setStep("auth")} style={{ background:"linear-gradient(135deg,#F28C8C,#E06060)", boxShadow:"0 8px 24px rgba(242,140,140,.35)" }}>
              Get started →
            </Btn>
          )}
          <Btn secondary onClick={()=>setStep("auth")}>Skip intro</Btn>
        </div>
      </div>
    </Shell>
  );

  // ── AUTH ──
  if (step === "auth") return (
    <Shell showProgress={false}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <img src={COPE_LOGO} alt="cope" style={{ width:64, height:64, objectFit:"contain", marginBottom:28 }}/>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:"#1A1A1A", lineHeight:1.25, marginBottom:10 }}>
          {obName ? <><em>Ready,</em><br/>{obName}?</> : <><em>Learn to Cope,</em><br/>beautifully.</>}
        </h1>
        <p style={{ fontSize:14, color:"#888", lineHeight:1.75, maxWidth:280, marginBottom:40 }}>
          A minimalist space to track your mood, energy, and growth. Your data stays yours, forever.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Btn onClick={()=>{ setIsLogin(false); setStep("signup"); }}>
            Get started for free
          </Btn>
          <button onClick={()=>{ setIsLogin(true); setStep("signup"); }} style={{
            width:"100%", padding:"16px", borderRadius:100, fontSize:15, fontWeight:600,
            fontFamily:"Jost,sans-serif", cursor:"pointer",
            background:"#fff", border:"1.5px solid #E0E0E0", color:"#71717A",
          }}>
            Sign in
          </button>
          {/* Demo */}
          <div onClick={()=>onComplete(obName||"Sam")} style={{
            display:"flex", alignItems:"center", gap:12, padding:"14px 18px",
            borderRadius:18, background:"#FAF9F6", border:"1.5px dashed rgba(242,140,140,.35)",
            cursor:"pointer", marginTop:4,
          }}>
            <div style={{ width:38,height:38,borderRadius:12,background:"rgba(242,140,140,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20 }}>👀</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#1E293B" }}>Try demo instead</p>
              <p style={{ fontSize:11, color:"#A8A8B0", marginTop:1 }}>Explore with sample data · no account needed</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D0D0D0" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>
      <p style={{ fontSize:11, color:"#D0D0D0", textAlign:"center", marginTop:16 }}>
        Encrypted · Private · Never sold
      </p>
    </Shell>
  );

  // ── SIGN UP / LOG IN ──
  if (step === "signup") return (
    <div style={{ height:"100svh", display:"flex", flexDirection:"column", background:"#fff" }}>
      <div style={{ padding:"52px 28px 0", display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <div onClick={()=>setStep("auth")} style={{ width:38,height:38,borderRadius:"50%",background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#1E293B" }}>
            {isLogin ? <em>Welcome back</em> : <em>Create account</em>}
          </h2>
          {!isLogin && obName && <p style={{ fontSize:11, color:"#A8A8B0", marginTop:2 }}>Hi {obName} 👋</p>}
        </div>
      </div>

      <div style={{ flex:1, padding:"0 28px", overflowY:"auto" }}>
        {/* Fields */}
        {[
          { label:"Email address", value:email, onChange:setEmail, type:"email", error:errs.email },
          { label:"Password", value:pass, onChange:setPass, type:showPass?"text":"password", error:errs.pass },
        ].map(({ label, value, onChange, type, error }) => (
          <div key={label} style={{ marginBottom:14 }}>
            <div style={{ background:error?"rgba(242,140,140,.06)":"#F5F5F5", borderRadius:16, padding:"13px 16px", border:error?"1.5px solid rgba(242,140,140,.45)":"1.5px solid transparent", transition:"all .2s", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:9.5, fontWeight:700, color:error?"#F28C8C":"#B0B0B0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:3 }}>{label}</p>
                <input value={value} onChange={e=>onChange(e.target.value)} type={type}
                  style={{ width:"100%", background:"transparent", border:"none", outline:"none", fontSize:15, color:"#1E293B", fontFamily:"Jost,sans-serif" }}/>
              </div>
              {label === "Password" && (
                <div onClick={()=>setShowPass(b=>!b)} style={{ cursor:"pointer", color:"#A8A8B0", flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </div>
              )}
            </div>
            {error && <p style={{ fontSize:11, color:"#F28C8C", marginTop:5, paddingLeft:4 }}>{error}</p>}
          </div>
        ))}

        {/* Password strength */}
        {!isLogin && pass.length > 0 && (
          <div style={{ marginTop:-6, marginBottom:16 }}>
            <div style={{ display:"flex", gap:4, marginBottom:5 }}>
              {[1,2,3,4].map(i=><div key={i} style={{ flex:1,height:3,borderRadius:100,background:i<=passStrength?strengthColor:"#EBEBEB",transition:"background .3s" }}/>)}
            </div>
            <p style={{ fontSize:10, color:strengthColor||"#B0B0B0", fontWeight:600 }}>{strengthLabel}</p>
          </div>
        )}
        {isLogin && <p onClick={handleForgotPassword} style={{ fontSize:12, color:"#F28C8C", textAlign:"right", marginTop:-6, marginBottom:20, cursor:"pointer" }}>Forgot password?</p>}

        {errs.general && (
          <div style={{ padding:"11px 14px", borderRadius:12, background: errs.general.startsWith("✉️") ? "rgba(61,154,110,.08)" : "rgba(242,140,140,.08)", marginBottom:12 }}>
            <p style={{ fontSize:12, color: errs.general.startsWith("✉️") ? "#3D9A6E" : "#E06B6B" }}>{errs.general}</p>
          </div>
        )}
        <button onClick={submit} style={{
          width:"100%", marginTop:8, padding:"16px", borderRadius:100, fontSize:15, fontWeight:700,
          fontFamily:"Jost,sans-serif", cursor:"pointer", border:"none",
          background:"#F28C8C", color:"#fff", boxShadow:"0 8px 24px rgba(242,140,140,.28)",
        }}>
          {busy
            ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ animation:"ob-spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                {isLogin ? "Signing in…" : "Creating account…"}
              </span>
            : isLogin ? "Sign in →" : "Create account →"
          }
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:"#A8A8B0", marginTop:16, cursor:"pointer" }}
          onClick={()=>setIsLogin(l=>!l)}>
          {isLogin ? "No account? " : "Already have one? "}
          <span style={{ color:"#F28C8C", fontWeight:600 }}>{isLogin ? "Create one" : "Sign in"}</span>
        </p>
      </div>
    </div>
  );

  // ── READY ──
  if (step === "ready") return (
    <div style={{ height:"100svh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#fff", padding:"0 32px", textAlign:"center", position:"relative" }}>
      <div style={{ position:"absolute", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(242,140,140,.1) 0%,transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }}/>
      <img src={COPE_LOGO} alt="cope" style={{ width:80, height:80, objectFit:"contain", marginBottom:24, animation:"ob-logo .6s cubic-bezier(.34,1.56,.64,1) both", position:"relative" }}/>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:"#1A1A1A", marginBottom:10, lineHeight:1.3, position:"relative" }}>
        <em>You're all set{obName?",":""}</em><br/>
        {obName && <span style={{ fontStyle:"normal" }}>{obName} 🌸</span>}
      </h2>
      <p style={{ fontSize:14, color:"#888", lineHeight:1.75, maxWidth:280, marginBottom:36, position:"relative" }}>
        Your space to reflect, track, and grow — privately.
      </p>
      <div style={{ display:"flex", gap:12, position:"relative" }}>
        {["📅","📈","🧠"].map((e,i) => (
          <div key={i} style={{
            width:56,height:56,borderRadius:18,background:"rgba(242,140,140,.08)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
            opacity: readyTick > i ? 1 : 0,
            transform: readyTick > i ? "scale(1) translateY(0)" : "scale(.6) translateY(12px)",
            transition:`all .42s cubic-bezier(.34,1.56,.64,1) ${i*.1}s`,
          }}>{e}</div>
        ))}
      </div>
    </div>
  );

  return null;
};


// ── localStorage helpers ──
const lsGet = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const lsSet = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

export default function App() {
  useEffect(injectStyles, []);

  const [authed,     setAuthed]     = useState(false);
  const [supaUser,   setSupaUser]   = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userName,   setUserName]   = useState(() => lsGet("cope_userName", "Friend"));
  const [screen,     setScreen]     = useState("home");
  const [checkIns,   setCheckIns]   = useState(() => lsGet("cope_checkIns", 0));
  const [lastMood,   setLastMood]   = useState(() => lsGet("cope_lastMood", { moodScore:3, anxietyScore:3 }));
  const [toast,      setToast]      = useState({ msg:"", visible:false });
  const [vault,      setVault]      = useState(() => lsGet("cope_vault", DEFAULT_VAULT));
  const [cycleDay,   setCycleDay]   = useState(null);
  const [rituals,    setRituals]    = useState(() => lsGet("cope_rituals", DEFAULT_RITUALS.map(r => ({...r, done:false}))));
  const [allData,    setAllData]    = useState(() => {
    const saved = lsGet("cope_allData", null);
    if (saved) return saved;
    const now = new Date(); const init = {};
    Object.entries(MONTH_DATA).forEach(([d, v]) => {
      const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      init[key] = v;
    });
    return init;
  });

  // ── Persist to localStorage (fast local cache) ──
  useEffect(() => { lsSet("cope_userName", userName); }, [userName]);
  useEffect(() => { lsSet("cope_checkIns", checkIns); }, [checkIns]);
  useEffect(() => { lsSet("cope_lastMood", lastMood); }, [lastMood]);
  useEffect(() => { lsSet("cope_vault",    vault);    }, [vault]);
  useEffect(() => { lsSet("cope_rituals",  rituals);  }, [rituals]);
  useEffect(() => { lsSet("cope_allData",  allData);  }, [allData]);

  // ── Load user data from Supabase ──
  const loadUserData = useCallback(async (userId) => {
    const { data } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) {
      if (data.user_name) { setUserName(data.user_name); lsSet("cope_userName", data.user_name); }
      if (typeof data.check_ins === "number") { setCheckIns(data.check_ins); lsSet("cope_checkIns", data.check_ins); }
      if (data.last_mood)  { setLastMood(data.last_mood);   lsSet("cope_lastMood", data.last_mood); }
      if (data.vault?.length)   { setVault(data.vault);     lsSet("cope_vault", data.vault); }
      if (data.all_data && Object.keys(data.all_data).length) { setAllData(data.all_data); lsSet("cope_allData", data.all_data); }
      if (data.rituals?.length) { setRituals(data.rituals); lsSet("cope_rituals", data.rituals); }
    }
    setDataLoaded(true);
  }, []);

  // ── Auth state listener (handles login, signup, refresh, returning user) ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupaUser(session.user);
        setAuthed(true);
        loadUserData(session.user.id);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupaUser(session.user);
        setAuthed(true);
      } else {
        setSupaUser(null);
        setAuthed(false);
        setDataLoaded(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [loadUserData]);

  // ── Debounced cloud sync ──
  const syncTimer = useRef(null);
  const syncToCloud = useCallback((userId, payload) => {
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      await supabase.from("user_data").upsert({
        user_id: userId,
        ...payload,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }, 1800);
  }, []);

  useEffect(() => {
    if (!supaUser || !dataLoaded) return;
    syncToCloud(supaUser.id, {
      user_name: userName,
      check_ins: checkIns,
      last_mood: lastMood,
      vault,
      all_data: allData,
      rituals,
    });
  }, [userName, checkIns, lastMood, vault, allData, rituals, supaUser, dataLoaded, syncToCloud]);
  const logTodayEntry = (data) => {
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    const score = Math.round(((data.moodScore-1)/4*100)*0.7 + ((5-data.anxietyScore)/4*100)*0.3);
    setAllData(prev => ({...prev, [key]: {
      score, moodScore:data.moodScore, anxietyScore:data.anxietyScore,
      emotions:data.emotions||[], sleepHrs:data.sleepHrs, sleepQuality:data.sleepQuality,
      energyLevel:data.energyLevel, note:data.note||null, cycle:false
    }}));
  };

  const showToast = (msg) => {
    setToast({ msg, visible:true });
    setTimeout(() => setToast({ msg:"", visible:false }), 2400);
  };

  const saveToVault = (entry) => {
    const tagMeta = THOUGHT_TAGS.find(t => t.label === entry.tag) || THOUGHT_TAGS[THOUGHT_TAGS.length - 1];
    setVault(prev => [{
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}),
      color: tagMeta.color,
      accent: tagMeta.accent,
      ...entry
    }, ...prev]);
  };

  const [activeJournal, setActiveJournal] = useState(null);
  const navigate = (s) => {
    if (s.startsWith("journal-")) {
      const id = s.replace("journal-","");
      const j = GUIDED_JOURNALS.find(x=>x.id===id) || recommendJournal(lastMood?.moodScore);
      setActiveJournal(j);
      setScreen("journal");
    } else {
      setScreen(s);
    }
  };
  const goBack = () => setScreen("home");

  const screens = ["home","checkin","thought","breathe","coping","insights","medicine","settings","reflection","library","journal"];

  if (!authed) return (
    <div className="root">
      <OnboardingFlow onComplete={async (n) => {
        const name = n || "Friend";
        setUserName(name);
        setAuthed(true);
        // Save name to cloud for new signups
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setSupaUser(user);
          await supabase.from("user_data").upsert({
            user_id: user.id,
            user_name: name,
            check_ins: 0,
            last_mood: { moodScore:3, anxietyScore:3 },
            all_data: allData,
            vault: DEFAULT_VAULT,
            rituals: DEFAULT_RITUALS.map(r=>({...r,done:false})),
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
          setDataLoaded(true);
        }
      }} />
    </div>
  );

  return (
    <div className="root">
      <div style={{ position:"relative", height:"100svh" }}>
        {screens.map(s => {
          if (s === "home") return (
            <div key="home" className={`screen ${screen==="home"?"active":"exit-left"}`}>
              <HomeScreen navigate={navigate} checkIns={checkIns} userName={userName} lastMood={lastMood} />
            </div>
          );
          if (s === "checkin") return screen === "checkin" ? (
            <CheckInScreen key="checkin" goBack={goBack} rituals={rituals} onNavigate={navigate} onSave={(data) => { setCheckIns(c=>c+1); if(data){ setLastMood(data); logTodayEntry(data); } showToast("✓ Reflection saved"); }} />
          ) : null;
          if (s === "thought") return screen === "thought" ? (
            <ThoughtRecord key="thought" goBack={goBack} onSave={(entry) => { saveToVault(entry); showToast("Insight saved ✓"); }} />
          ) : null;
          if (s === "breathe") return screen === "breathe" ? (
            <BreatheScreen key="breathe" goBack={goBack} />
          ) : null;
          if (s === "coping") return screen === "coping" ? (
            <CopingTools key="coping" goBack={goBack} onSave={(entry) => { saveToVault(entry); showToast("\u2713 Writing saved to Reflections"); }} onJournal={(j) => navigate("journal-"+j.id)} />
          ) : null;
          if (s === "insights") return screen === "insights" ? (
            <InsightsScreen key="insights" checkIns={checkIns} lastMood={lastMood} cycleDay={cycleDay} allData={allData} setAllData={setAllData} vault={vault} userName={userName} />
          ) : null;
          if (s === "medicine") return screen === "medicine" ? (
            <MedicineTracker key="medicine" goBack={goBack} rituals={rituals} setRituals={setRituals} />
          ) : null;
          if (s === "settings") return screen === "settings" ? (
            <SettingsScreen key="settings" goBack={goBack} onSignOut={async () => {
                await supabase.auth.signOut();
                localStorage.clear();
                setAuthed(false);
                setSupaUser(null);
                setDataLoaded(false);
              }} />
          ) : null;
          if (s === "reflection") return screen === "reflection" ? (
            <ReflectionVault key="reflection" goBack={goBack} vault={vault} navigate={navigate} />
          ) : null;
          if (s === "library") return screen === "library" ? (
            <LibraryScreen key="library" goBack={goBack} />
          ) : null;
          if (s === "journal") return screen === "journal" && activeJournal ? (
            <GuidedJournalScreen key="journal" journal={activeJournal} goBack={goBack}
              onSave={(entry) => { saveToVault(entry); showToast("Reflection saved ✓"); }} />
          ) : null;
          return null;
        })}
      </div>
      <TabBar active={["home","checkin","insights","coping","library"].includes(screen) ? screen : "home"} setActive={navigate} />
      <FloatingMenu navigate={navigate} screen={screen} />
      <Toast msg={toast.msg} visible={toast.visible} />
    </div>
  );
}
