import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import { timelineEntries } from '../../data/timeline';
import styled from 'styled-components';

/* ─── Tooltip styled wrapper (neumorphic style from user reference) ─── */
const TooltipCard = styled.div`
  position: absolute;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  border-radius: 15px;
  box-shadow:
    inset 5px 5px 5px rgba(0, 0, 0, 0.2),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.3),
    -5px -5px 15px rgba(255, 255, 255, 0.1);
  z-index: 100;
  width: 280px;

  .profile {
    background: #2a2b2f;
    border-radius: 10px 15px;
    padding: 12px 14px;
    border: 1px solid rgba(139, 92, 246, 0.4);
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .tooltip-icon-box {
    width: 44px;
    height: 44px;
    min-width: 44px;
    font-size: 18px;
    font-weight: 700;
    border: 1px solid rgba(139, 92, 246, 0.6);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(139, 92, 246, 0.15);
    color: #a78bfa;
  }

  .tooltip-details {
    display: flex;
    flex-direction: column;
    gap: 1px;
    overflow: hidden;
  }

  .tooltip-title {
    font-size: 14px;
    font-weight: 700;
    color: #a78bfa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tooltip-org {
    font-size: 11px;
    color: #8b8b9e;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tooltip-year {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    color: #a78bfa;
    background: rgba(139, 92, 246, 0.12);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 20px;
    padding: 2px 10px;
    margin-bottom: 6px;
    font-family: var(--font-mono, 'Geist Mono', monospace);
  }

  .tooltip-desc {
    color: #ccc;
    font-size: 12px;
    line-height: 1.5;
    margin-top: 6px;
  }
`;

const NodeWrapper = styled.div`
  position: relative;
  cursor: pointer;

  &:hover ${TooltipCard} {
    opacity: 1;
    pointer-events: auto;
    bottom: calc(100% + 22px);
  }
`;


export default function RadialTimeline() {
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const rotationRef = useRef(0);
  const dragStartAngleRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const nodesRef = useRef(null);
  const spokesRef = useRef(null);
  const animFrameRef = useRef(null);

  const radius = 220;

  // Map icons based on entry content/id
  const getIcon = useCallback((title, org) => {
    const text = (title + ' ' + org).toLowerCase();
    if (text.includes('github') || text.includes('open source')) return Code;
    if (text.includes('undergrad') || text.includes('learning')) return GraduationCap;
    return Briefcase;
  }, []);

  // Direct DOM update for smooth rotation (bypasses React re-renders)
  const updateNodePositions = useCallback(() => {
    if (!nodesRef.current) return;
    const nodes = nodesRef.current.children;
    const total = timelineEntries.length;
    const spokeLines = spokesRef.current?.children;

    for (let i = 0; i < nodes.length; i++) {
      const baseAngle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const currentAngle = baseAngle + (rotationRef.current * Math.PI) / 180;
      const x = Math.cos(currentAngle) * radius;
      const y = Math.sin(currentAngle) * radius;
      nodes[i].style.transform = `translate(${x}px, ${y}px)`;

      // Update SVG spoke line endpoints
      if (spokeLines && spokeLines[i]) {
        spokeLines[i].setAttribute('x2', String(x));
        spokeLines[i].setAttribute('y2', String(y));
      }
    }
  }, [radius]);

  // Animation loop — updates rotation directly via ref + DOM
  useEffect(() => {
    const animate = () => {
      if (!isHoveredRef.current && !isDraggingRef.current) {
        rotationRef.current = (rotationRef.current + 0.15) % 360;
        updateNodePositions();
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [updateNodePositions]);

  const handlePointerDown = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    dragStartAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    isDraggingRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current || dragStartAngleRef.current === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const currentMouseAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let delta = (currentMouseAngle - dragStartAngleRef.current) * (180 / Math.PI);

    // Fix jump when crossing PI / -PI boundary
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    rotationRef.current = (rotationRef.current + delta) % 360;
    dragStartAngleRef.current = currentMouseAngle;
    updateNodePositions();
  }, [updateNodePositions]);

  const handlePointerUp = useCallback((e) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    dragStartAngleRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  const handleMouseEnter = useCallback(() => { isHoveredRef.current = true; }, []);
  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // Compute initial positions for first paint
  const getNodePosition = (index) => {
    const total = timelineEntries.length;
    const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const currentAngle = baseAngle + (rotationRef.current * Math.PI) / 180;
    const x = Math.cos(currentAngle) * radius;
    const y = Math.sin(currentAngle) * radius;
    return { x, y };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full mx-auto min-h-[600px] flex items-center justify-center py-20 touch-none select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{ overflow: 'visible' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >

      {/* Center Hub */}
      <div className="absolute z-10 w-20 h-20 rounded-full border-4 border-foreground/20 bg-background flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 animate-pulse flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-400 rounded-full" />
        </div>
      </div>

      {/* Spoke Lines (SVG layer — updated via ref in animation loop) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <g ref={spokesRef} style={{ transform: 'translate(50%, 50%)' }}>
          {timelineEntries.map((entry, index) => {
            const { x, y } = getNodePosition(index);
            return (
              <line
                key={entry.id}
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={activeId === entry.id ? 'rgba(168,85,247,0.6)' : 'rgba(255,255,255,0.08)'}
                strokeWidth={activeId === entry.id ? 2 : 1}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
            );
          })}
        </g>
      </svg>

      {/* Orbital Nodes */}
      <div ref={nodesRef} className="absolute inset-0 flex items-center justify-center">
        {timelineEntries.map((entry, index) => {
          const { x, y } = getNodePosition(index);
          const isActive = activeId === entry.id;
          const Icon = getIcon(entry.title, entry.org);

          return (
            <div
              key={entry.id}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                zIndex: isActive ? 20 : 5,
              }}
            >
              <NodeWrapper
                onMouseEnter={() => setActiveId(entry.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                {/* Node glow effect */}
                {isActive && (
                  <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                )}

                {/* Node Button */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10",
                    isActive
                      ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                      : "bg-background border-foreground/20 text-foreground/60 hover:border-foreground/50 hover:text-foreground"
                  )}
                >
                  <Icon size={20} />
                </div>

                {/* Tooltip Card — appears above the node on hover */}
                <TooltipCard>
                  <div className="profile">
                    <span className="tooltip-year">{entry.year || '—'}</span>
                    <div className="tooltip-header">
                      <div className="tooltip-icon-box">
                        <Icon size={20} />
                      </div>
                      <div className="tooltip-details">
                        <div className="tooltip-title">{entry.title}</div>
                        <div className="tooltip-org">{entry.org}</div>
                      </div>
                    </div>
                    <p className="tooltip-desc">{entry.description}</p>
                  </div>
                </TooltipCard>
              </NodeWrapper>
            </div>
          );
        })}
      </div>
    </div>
  );
}
