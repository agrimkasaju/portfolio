#!/usr/bin/env python3
"""
generate-og-image.py
Generates the 1200x630 OpenGraph card showcasing the Apple-style MacBook Pro design,
KasajuOS desktop, Matterhorn starry night wallpaper, and markdown dossiers.
"""

import base64
import os
import subprocess
import tempfile
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
WALLPAPER_PATH = REPO_ROOT / "public" / "wallpapers" / "matterhorn-night.webp"
OUTPUT_PATH = REPO_ROOT / "public" / "og-image.png"

with open(WALLPAPER_PATH, "rb") as f:
    wallpaper_b64 = "data:image/webp;base64," + base64.b64encode(f.read()).decode("utf-8")

HTML_TEMPLATE = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}
  body {{
    width: 1200px;
    height: 630px;
    background: #06080d;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 2px;
  }}

  /* Background Ambient Studio Glow */
  .studio-ambient {{
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 180px, rgba(14, 116, 144, 0.24) 0%, rgba(30, 58, 138, 0.18) 35%, transparent 70%),
      radial-gradient(circle at 18% 10%, rgba(56, 189, 248, 0.14) 0%, transparent 45%),
      radial-gradient(circle at 82% 15%, rgba(99, 102, 241, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 50% 610px, rgba(15, 23, 42, 0.95) 0%, transparent 80%);
    pointer-events: none;
  }}
  .studio-grid {{
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.075) 1px, transparent 1px);
    background-size: 26px 26px;
    opacity: 0.65;
    pointer-events: none;
  }}

  /* Top Navigation / Brand Header */
  .brand-header {{
    position: relative;
    z-index: 20;
    padding: 18px 48px 10px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .brand-left {{
    display: flex;
    align-items: baseline;
    gap: 16px;
  }}
  .brand-name {{
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  .brand-tagline {{
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12.5px;
    color: #94a3b8;
    letter-spacing: -0.01em;
  }}
  .brand-tagline span {{
    color: #38bdf8;
    margin: 0 4px;
  }}
  .brand-badge {{
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.28);
    padding: 6px 14px;
    border-radius: 9999px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11.5px;
    color: #e2e8f0;
    box-shadow: 0 4px 14px rgba(0,0,0,0.45);
  }}
  .live-dot {{
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  }}

  /* Laptop Stage Container */
  .laptop-stage {{
    position: relative;
    z-index: 10;
    width: 1070px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }}

  /* Outer Display Lid */
  .display-lid {{
    width: 100%;
    background: #10131b;
    border-radius: 16px 16px 0 0;
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 25px 65px -10px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.3);
    padding: 6px 6px 0 6px;
    position: relative;
    overflow: hidden;
  }}

  /* Camera Notch integrated with macOS menu bar */
  .camera-notch {{
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 18px;
    background: #000000;
    border-radius: 0 0 10px 10px;
    z-index: 45;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.8);
  }}
  .camera-lens {{
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #121824;
    border: 1px solid #2b3954;
  }}
  .camera-indicator {{
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background: #10b981;
    opacity: 0.85;
  }}

  /* Screen Area */
  .screen {{
    position: relative;
    width: 100%;
    height: 425px;
    border-radius: 10px 10px 0 0;
    background-image: url('{wallpaper_b64}');
    background-size: 106% auto;
    background-position: center 25%;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.85);
  }}

  /* Left-Hand Directional Moon Glare */
  .glare-halo {{
    position: absolute;
    top: -60px;
    left: -60px;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(186, 230, 253, 0.36) 0%, rgba(147, 197, 253, 0.12) 45%, transparent 75%);
    pointer-events: none;
    z-index: 28;
  }}
  .glare-wash {{
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.20) 0%, rgba(224, 242, 254, 0.11) 22%, rgba(186, 230, 253, 0.03) 48%, transparent 70%);
    pointer-events: none;
    z-index: 28;
  }}

  /* macOS Menu Bar */
  .macos-bar {{
    position: relative;
    z-index: 40;
    height: 28px;
    background: rgba(9, 11, 16, 0.85);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.09);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    font-size: 11px;
    color: #e2e8f0;
  }}
  .macos-bar-left {{
    display: flex;
    align-items: center;
    gap: 14px;
  }}
  .os-name {{
    font-weight: 700;
    color: #ffffff;
    font-size: 11.5px;
    letter-spacing: -0.01em;
  }}
  .os-menus {{
    display: flex;
    gap: 12px;
    filter: blur(1.5px);
    opacity: 0.35;
    color: #cbd5e1;
    font-size: 11px;
  }}
  .macos-bar-right {{
    display: flex;
    align-items: center;
    gap: 7px;
  }}
  .os-pill {{
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(24, 24, 27, 0.92);
    border: 1px solid rgba(82, 82, 91, 0.75);
    padding: 2.5px 8px;
    border-radius: 5px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9.5px;
    color: #e2e8f0;
  }}

  /* Markdown Windows */
  .window {{
    position: absolute;
    border-radius: 11px;
    overflow: hidden;
    box-shadow: 0 22px 50px rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
  }}
  .window-header {{
    height: 29px;
    background: rgba(22, 24, 29, 0.98);
    border-bottom: 1px solid rgba(63, 63, 70, 0.85);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 11px;
    flex-shrink: 0;
  }}
  .traffic-lights {{
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .dot {{
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }}
  .dot-red {{ background: #ff5f56; border: 1px solid #e0443e; }}
  .dot-yellow {{ background: #ffbd2e; border: 1px solid #dea123; }}
  .dot-green {{ background: #27c93f; border: 1px solid #1aab29; }}
  .window-title {{
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 5px;
  }}
  .window-path {{
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9.5px;
    color: #71717a;
  }}

  /* Window 1: ABOUT_ME */
  .window-about {{
    left: 14px;
    top: 36px;
    width: 512px;
    height: 376px;
    background: rgba(13, 17, 23, 0.93);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(59, 130, 246, 0.38);
    z-index: 22;
  }}
  .window-body {{
    padding: 13px 15px;
    font-size: 11px;
    line-height: 1.5;
    color: #cbd5e1;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }}
  .headline-row {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(39, 39, 42, 0.85);
    padding-bottom: 8px;
  }}
  .dev-name {{
    font-size: 17px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.01em;
  }}
  .dev-badge {{
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9.5px;
    white-space: nowrap;
    color: #93c5fd;
    background: rgba(30, 58, 138, 0.45);
    border: 1px solid rgba(59, 130, 246, 0.55);
    padding: 3px 9px;
    border-radius: 9999px;
  }}
  .dev-subtitle {{
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 10px;
    color: #94a3b8;
    margin-top: 2px;
  }}
  .callout-box {{
    background: rgba(24, 24, 27, 0.92);
    border: 1px solid rgba(63, 63, 70, 0.8);
    border-radius: 7px;
    padding: 8px 11px;
    font-size: 10.5px;
  }}
  .callout-title {{
    color: #60a5fa;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-weight: 600;
    margin-bottom: 2px;
    display: block;
    font-size: 10px;
  }}
  .stack-pills {{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }}
  .pill {{
    background: #18181b;
    border: 1px solid #3f3f46;
    padding: 2.5px 8px;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9.5px;
    color: #f1f5f9;
    font-weight: 500;
  }}

  /* Window 2: EXPERIENCE */
  .window-exp {{
    right: 14px;
    top: 44px;
    width: 504px;
    height: 368px;
    background: rgba(15, 20, 28, 0.94);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(16, 185, 129, 0.42);
    z-index: 24;
  }}
  .company-row {{
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }}
  .company-title {{
    font-size: 14.5px;
    font-weight: 700;
    color: #ffffff;
  }}
  .role-name {{
    color: #34d399;
    font-size: 12px;
    font-weight: 500;
  }}
  .exp-date {{
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9.5px;
    color: #94a3b8;
  }}
  .exp-bullets {{
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: 5px;
  }}
  .exp-bullet {{
    position: relative;
    padding-left: 13px;
    font-size: 10.5px;
    line-height: 1.45;
    color: #cbd5e1;
  }}
  .exp-bullet::before {{
    content: "•";
    position: absolute;
    left: 0;
    color: #34d399;
    font-weight: bold;
    font-size: 12px;
  }}
  .exp-highlight {{
    color: #6ee7b7;
    font-weight: 600;
  }}

  /* 3D Base Chassis */
  .chassis-wrapper {{
    position: relative;
    width: 100%;
    z-index: 5;
    margin-top: -1px;
    perspective: 1400px;
    perspective-origin: 50% 10%;
  }}
  .hinge-barrel {{
    width: 96%;
    height: 5px;
    margin: 0 auto;
    background: #000000;
    border-left: 1px solid #27272a;
    border-right: 1px solid #27272a;
    border-radius: 2px 2px 0 0;
  }}
  .chassis-deck {{
    width: 100%;
    height: 122px;
    background: linear-gradient(180deg, #1c1f28 0%, #13161e 40%, #0b0d12 100%);
    border-top: 1px solid #373e4f;
    border-radius: 0 0 20px 20px;
    transform-origin: top center;
    transform: rotateX(58deg);
    transform-style: preserve-3d;
    box-shadow: 0 35px 80px -10px rgba(0,0,0,0.98), inset 0 1px 0 rgba(255,255,255,0.22);
    padding: 7px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .deck-top {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }}
  .speaker {{
    width: 50px;
    height: 60px;
    background-image: radial-gradient(#52525b 1px, transparent 1px);
    background-size: 3px 3px;
    opacity: 0.35;
    border-radius: 3px;
  }}
  .keyboard-well {{
    flex: 1;
    height: 60px;
    background: #090a0d;
    border: 1px solid rgba(63, 63, 70, 0.75);
    border-radius: 6px;
    padding: 3px 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.85);
  }}
  .key-row {{
    display: flex;
    gap: 2px;
    height: 8.5px;
  }}
  .key {{
    flex: 1;
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 1.5px;
  }}
  .key-mod {{
    flex: 1.5;
  }}
  .key-space {{
    flex: 6;
  }}
  .trackpad {{
    width: 220px;
    height: 38px;
    margin: 2px auto 0 auto;
    background: rgba(24, 24, 27, 0.85);
    border: 1px solid rgba(82, 82, 91, 0.5);
    border-radius: 8px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.8);
  }}
</style>
</head>
<body>

  <!-- Background Atmosphere -->
  <div class="studio-ambient"></div>
  <div class="studio-grid"></div>

  <!-- Top Brand Header Bar -->
  <header class="brand-header">
    <div class="brand-left">
      <div class="brand-name">Agrim Kasaju</div>
      <div class="brand-tagline">Systems Software <span>/</span> Linux Kernels <span>/</span> Edge AI</div>
    </div>
    <div class="brand-badge">
      <div class="live-dot"></div>
      <span>agrimkasaju.netlify.app</span>
    </div>
  </header>

  <!-- Centered MacBook Pro Showcase -->
  <div class="laptop-stage">
    <div class="display-lid">
      <!-- Notch -->
      <div class="camera-notch">
        <div class="camera-lens"></div>
        <div class="camera-indicator"></div>
      </div>

      <!-- Screen -->
      <div class="screen">
        <!-- Directional Glare -->
        <div class="glare-halo"></div>
        <div class="glare-wash"></div>

        <!-- macOS Menu Bar -->
        <div class="macos-bar">
          <div class="macos-bar-left">
            <span class="os-name">KasajuOS</span>
            <div class="os-menus">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Window</span>
            </div>
          </div>
          <div class="macos-bar-right">
            <div class="os-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>Starry Night</span>
            </div>
            <div class="os-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#93c5fd"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              <span>Dark</span>
            </div>
            <div class="os-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#60a5fa"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
              <span>Ottawa, ON · 10:42 PM</span>
            </div>
          </div>
        </div>

        <!-- Window 1: ABOUT_ME.md -->
        <div class="window window-about">
          <div class="window-header">
            <div class="traffic-lights">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
              <span class="window-title" style="margin-left: 6px;">
                <span style="color: #60a5fa; font-weight: bold;">#</span> ABOUT_ME.md
              </span>
            </div>
            <span class="window-path">~/kasaju/ABOUT_ME.md · UTF-8</span>
          </div>
          <div class="window-body">
            <div class="headline-row">
              <div>
                <div class="dev-name">Agrim Kasaju</div>
                <div class="dev-subtitle">B.Eng Computer Systems Engineering @ Carleton University</div>
              </div>
              <div class="dev-badge">GPA 3.33 · Dean's List</div>
            </div>

            <p style="color: #cbd5e1; font-size: 11px;">
              Fourth-year engineering student with hands-on production experience in Linux systems software, automated verification harnesses, and edge AI deployment.
            </p>

            <div class="callout-box">
              <span class="callout-title">// ARCHITECTURAL PHILOSOPHY</span>
              <span style="color: #cbd5e1;">High-throughput, low-latency execution that survives hostile edge environments, thread contention, and deterministic timing constraints.</span>
            </div>

            <div>
              <span style="font-family: ui-monospace, monospace; font-size: 9.5px; text-transform: uppercase; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px;">
                Core Engineering Stack:
              </span>
              <div class="stack-pills">
                <span class="pill">C/C++</span>
                <span class="pill">Go</span>
                <span class="pill">Python</span>
                <span class="pill">Linux POSIX APIs</span>
                <span class="pill">ONNX / TFLite INT8</span>
                <span class="pill">mTLS & X.509</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Window 2: EXPERIENCE.md -->
        <div class="window window-exp">
          <div class="window-header">
            <div class="traffic-lights">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
              <span class="window-title" style="margin-left: 6px;">
                <span style="color: #34d399; font-weight: bold;">#</span> EXPERIENCE.md
              </span>
            </div>
            <span class="window-path">~/kasaju/EXPERIENCE.md · Preview</span>
          </div>
          <div class="window-body">
            <div style="border-bottom: 1px solid rgba(39, 39, 42, 0.85); padding-bottom: 6px;">
              <div class="company-row">
                <div class="company-title">Lumentum <span style="color: #94a3b8; font-weight: normal;">·</span> <span class="role-name">Software Developer (Co-op)</span></div>
                <span class="exp-date">May 2026 – Present</span>
              </div>
              <div style="font-family: ui-monospace, monospace; font-size: 9.5px; color: #94a3b8; margin-top: 1px;">Ottawa, ON · Systems Software & Verification</div>
              
              <ul class="exp-bullets">
                <li class="exp-bullet">
                  <strong style="color: #ffffff;">Automated Linux Validation:</strong> Automated test harnesses across 10+ configs, <span class="exp-highlight">reducing regression duration by 35%</span>.
                </li>
                <li class="exp-bullet">
                  <strong style="color: #ffffff;">mTLS Security:</strong> Enforced strict authentication with bidirectional X.509 certificate validation between daemons and endpoints.
                </li>
                <li class="exp-bullet">
                  <strong style="color: #ffffff;">State Prototext Pipeline:</strong> Built C#/Go event monitoring with prototext snapshotting, <span class="exp-highlight">cutting storage overhead by 88%</span>.
                </li>
              </ul>
            </div>

            <div>
              <span style="font-family: ui-monospace, monospace; font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px;">
                Systems Foundations & Coursework:
              </span>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <div class="pill" style="font-size: 8.5px; padding: 3px 5px; display: flex; align-items: center; gap: 4px;">
                  <span style="color: #fbbf24;">//</span> Real-Time Systems (Rate-Monotonic)
                </div>
                <div class="pill" style="font-size: 8.5px; padding: 3px 5px; display: flex; align-items: center; gap: 4px;">
                  <span style="color: #60a5fa;">//</span> Network Security & Cryptography
                </div>
                <div class="pill" style="font-size: 8.5px; padding: 3px 5px; display: flex; align-items: center; gap: 4px;">
                  <span style="color: #34d399;">//</span> Embedded Systems (ARM Cortex)
                </div>
                <div class="pill" style="font-size: 8.5px; padding: 3px 5px; display: flex; align-items: center; gap: 4px;">
                  <span style="color: #a78bfa;">//</span> Operating Systems & Kernels
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 3D Base Chassis -->
    <div class="chassis-wrapper">
      <div class="hinge-barrel"></div>
      <div class="chassis-deck">
        <div class="deck-top">
          <div class="speaker"></div>
          <div class="keyboard-well">
            <div class="key-row">
              <div class="key key-mod"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key key-mod"></div>
            </div>
            <div class="key-row">
              <div class="key key-mod"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key key-mod"></div>
            </div>
            <div class="key-row">
              <div class="key key-mod" style="flex:2"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key"></div><div class="key"></div><div class="key"></div>
              <div class="key key-mod" style="flex:2"></div>
            </div>
            <div class="key-row">
              <div class="key key-mod"></div><div class="key key-mod"></div><div class="key key-mod"></div>
              <div class="key key-space"></div>
              <div class="key key-mod"></div><div class="key key-mod"></div><div class="key key-mod"></div>
            </div>
          </div>
          <div class="speaker"></div>
        </div>
        <div class="trackpad"></div>
      </div>
    </div>

  </div>

</body>
</html>"""

def main():
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(HTML_TEMPLATE)
        tmp_html = f.name

    tmp_png = tempfile.mktemp(suffix=".png")

    try:
        cmd = [
            "firefox",
            "--headless",
            "--screenshot",
            tmp_png,
            "--window-size",
            "1200,630",
            f"file://{tmp_html}"
        ]
        subprocess.run(cmd, check=True)

        im = Image.open(tmp_png)
        if im.mode != "RGB":
            im = im.convert("RGB")
        im.save(OUTPUT_PATH, format="PNG", optimize=True)
        print(f"OG image successfully generated: {OUTPUT_PATH} ({im.size[0]}x{im.size[1]})")
    finally:
        if os.path.exists(tmp_html):
            os.remove(tmp_html)
        if os.path.exists(tmp_png):
            os.remove(tmp_png)

if __name__ == "__main__":
    main()
