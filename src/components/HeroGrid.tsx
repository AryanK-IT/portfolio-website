// ─── src/components/HeroGrid.tsx ─────────────────────────────────────────────
// Canvas 2D node-network grid — fixed to cover the entire page background.
// Visible (dim) throughout all sections while scrolling.
// Nodes have organic idle sine-wave movement on top of base velocity.

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isAccent: boolean;
  // idle sine params
  idleAmpX: number;
  idleAmpY: number;
  idleFreqX: number;
  idleFreqY: number;
  idlePhaseX: number;
  idlePhaseY: number;
  // base position (sine oscillates around this)
  baseX: number;
  baseY: number;
}

export default function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const createNodes = (): Node[] =>
      Array.from({ length: 90 }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x, y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius:   2 + Math.random() * 3,
          isAccent: Math.random() < 0.08,
          idleAmpX:   8  + Math.random() * 14,
          idleAmpY:   8  + Math.random() * 14,
          idleFreqX:  0.0003 + Math.random() * 0.0004,
          idleFreqY:  0.0003 + Math.random() * 0.0004,
          idlePhaseX: Math.random() * Math.PI * 2,
          idlePhaseY: Math.random() * Math.PI * 2,
        };
      });

    let nodes = createNodes();

    const mouse = { x: -9999, y: -9999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      const prevW = canvas.width;
      const prevH = canvas.height;
      setSize();
      const sx = canvas.width  / prevW;
      const sy = canvas.height / prevH;
      nodes.forEach(n => {
        n.x     *= sx; n.y     *= sy;
        n.baseX *= sx; n.baseY *= sy;
      });
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Static single frame for reduced motion
    if (shouldReduceMotion) {
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.isAccent ? 'rgba(255,61,46,0.3)' : 'rgba(170,185,210,0.18)';
        ctx.fill();
      });
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
      };
    }

    const LINK_DIST  = 180;
    const TRI_DIST   = 140;
    const REPEL_DIST = 120;
    let rafId = 0;

    const draw = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;

      // Hero: full brightness → rest of page: dim but always visible
      const heroFade   = Math.max(0, 1 - (window.scrollY / window.innerHeight) * 1.4);
      const baseAlpha  = Math.max(0.35, heroFade);

      ctx.clearRect(0, 0, W, H);

      // ── Update node positions ────────────────────────────────────────────
      nodes.forEach(n => {
        // Idle sine-wave breathing around base position
        const idleX = Math.sin(time * n.idleFreqX + n.idlePhaseX) * n.idleAmpX;
        const idleY = Math.cos(time * n.idleFreqY + n.idlePhaseY) * n.idleAmpY;

        // Drift base position slowly
        n.baseX += n.vx;
        n.baseY += n.vy;

        // Wrap base at edges
        if (n.baseX < -20)    n.baseX = W + 20;
        if (n.baseX > W + 20) n.baseX = -20;
        if (n.baseY < -20)    n.baseY = H + 20;
        if (n.baseY > H + 20) n.baseY = -20;

        // Final rendered position = base + idle + mouse repulsion
        n.x = n.baseX + idleX;
        n.y = n.baseY + idleY;

        // Mouse repulsion (applied to base so it persists)
        const dx   = n.baseX - mouse.x;
        const dy   = n.baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0) {
          const force = ((REPEL_DIST - dist) / REPEL_DIST) * 1.5;
          n.baseX += (dx / dist) * force * 0.18;
          n.baseY += (dy / dist) * force * 0.18;
        }

        // Dampen velocity slightly so it doesn't accelerate forever
        n.vx *= 0.992;
        n.vy *= 0.992;
      });

      // ── Triangles ─────────────────────────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d1sq = (nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2;
          if (d1sq > TRI_DIST ** 2) continue;
          for (let k = j + 1; k < nodes.length; k++) {
            const d2sq = (nodes[i].x - nodes[k].x) ** 2 + (nodes[i].y - nodes[k].y) ** 2;
            if (d2sq > TRI_DIST ** 2) continue;
            const d3sq = (nodes[j].x - nodes[k].x) ** 2 + (nodes[j].y - nodes[k].y) ** 2;
            if (d3sq > TRI_DIST ** 2) continue;
            const fade = 1 - Math.max(Math.sqrt(d1sq), Math.sqrt(d2sq), Math.sqrt(d3sq)) / TRI_DIST;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.lineTo(nodes[k].x, nodes[k].y);
            ctx.closePath();
            ctx.fillStyle = `rgba(255,61,46,${0.05 * fade * baseAlpha})`;
            ctx.fill();
          }
        }
      }

      // ── Lines ─────────────────────────────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > LINK_DIST) continue;
          const fade      = 1 - d / LINK_DIST;
          const accentPair = nodes[i].isAccent || nodes[j].isAccent;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = accentPair
            ? `rgba(255,61,46,${0.5 * fade * baseAlpha})`
            : `rgba(200,210,230,${0.28 * fade * baseAlpha})`;
          ctx.lineWidth = accentPair ? 0.9 : 0.6;
          ctx.stroke();
        }
      }

      // ── Dots ──────────────────────────────────────────────────────────────
      nodes.forEach(n => {
        if (n.isAccent) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4);
          grd.addColorStop(0, `rgba(255,61,46,${0.65 * baseAlpha})`);
          grd.addColorStop(1,  'rgba(255,61,46,0)');
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,61,46,${baseAlpha})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(170,185,210,${0.6 * baseAlpha})`;
          ctx.fill();
        }
      });

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        zIndex:        0,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  );
}
