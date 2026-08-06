import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import { timelineEntries } from '@/data/timeline';
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
  max-width: calc(100vw - 32px);

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
  touch-action: manipulation;

  &:hover ${TooltipCard},
  &.is-active ${TooltipCard} {
    opacity: 1;
    pointer-events: auto;
    bottom: calc(100% + 22px);
  }
`;

export default function RadialTimeline() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [radius, setRadius] = useState(220);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const dragStartAngleRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const nodesRef = useRef<HTMLDivElement | null>(null);
  const spokesRef = useRef<SVGGElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Responsive radius calculation
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);

      if (w < 380) {
        setRadius(115);
      } else if (w < 480) {
        setRadius(130);
      } else if (w < 640) {
        setRadius(150);
      } else if (w < 1024) {
        setRadius(180);
      } else {
        setRadius(220);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Map icons based on entry content/id
  const getIcon = useCallback((title: string, org: string) => {
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
      (nodes[i] as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;

      // Update SVG spoke line endpoints
      if (spokeLines && spokeLines[i]) {
        spokeLines[i].setAttribute('x2', String(x));
        spokeLines[i].setAttribute('y2', String(y));
      }
    }
  }, [radius]);

  // Keep node positions synced when radius changes on resize
  useEffect(() => {
    updateNodePositions();
  }, [radius, updateNodePositions]);

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
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateNodePositions]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    dragStartAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    isDraggingRef.current = true;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
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

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    dragStartAngleRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  }, []);

  const handleMouseEnter = useCallback(() => { isHoveredRef.current = true; }, []);
  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleNodeClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId(prev => (prev === id ? null : id));
  };

  // Compute initial positions for first paint
  const getNodePosition = (index: number) => {
    const total = timelineEntries.length;
    const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const currentAngle = baseAngle + (rotationRef.current * Math.PI) / 180;
    const x = Math.cos(currentAngle) * radius;
    const y = Math.sin(currentAngle) * radius;
    return { x, y };
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-[650px] mx-auto flex items-center justify-center touch-none select-none",
          isMobile ? "min-h-[340px] py-4" : "min-h-[560px] py-16",
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
        <div className={cn(
          "absolute z-10 rounded-full border-4 border-foreground/20 bg-background flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]",
          isMobile ? "w-14 h-14" : "w-20 h-20"
        )}>
          <div className={cn(
            "rounded-full bg-purple-500/20 border border-purple-500/50 animate-pulse flex items-center justify-center",
            isMobile ? "w-6 h-6" : "w-8 h-8"
          )}>
            <div className={cn("bg-purple-400 rounded-full", isMobile ? "w-1.5 h-1.5" : "w-2 h-2")} />
          </div>
        </div>

        {/* Spoke Lines (SVG layer) */}
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
                  stroke={activeId === entry.id ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={activeId === entry.id ? 2.5 : 1}
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                />
              );
            })}
          </g>
        </svg>

        {/* Orbital Nodes */}
        <div ref={nodesRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {timelineEntries.map((entry, index) => {
            const { x, y } = getNodePosition(index);
            const isActive = activeId === entry.id;
            const Icon = getIcon(entry.title, entry.org);

            return (
              <div
                key={entry.id}
                className="absolute pointer-events-auto"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  zIndex: isActive ? 30 : 10,
                }}
              >
                <NodeWrapper
                  className={isActive ? 'is-active' : ''}
                  onClick={(e) => handleNodeClick(entry.id, e)}
                  onMouseEnter={() => !isMobile && setActiveId(entry.id)}
                  onMouseLeave={() => !isMobile && setActiveId(null)}
                >
                  {/* Node glow effect */}
                  {isActive && (
                    <div className="absolute -inset-3 bg-purple-500/30 rounded-full blur-lg animate-pulse" />
                  )}

                  {/* Node Button */}
                  <div
                    className={cn(
                      "rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10",
                      isMobile ? "w-11 h-11" : "w-14 h-14",
                      isActive
                        ? "bg-purple-600 border-purple-300 text-white shadow-[0_0_25px_rgba(139,92,246,0.6)] scale-110"
                        : "bg-[#121218] border-white/15 text-white/70 hover:border-purple-400/60 hover:text-white"
                    )}
                  >
                    <Icon size={isMobile ? 17 : 20} />
                  </div>

                  {/* Tooltip Card — appears above the node */}
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
    </div>
  );
}
