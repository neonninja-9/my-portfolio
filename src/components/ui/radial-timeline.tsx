import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import { timelineEntries } from '../../data/timeline';


export default function RadialTimeline() {
  const [activeId, setActiveId] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartAngle, setDragStartAngle] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (!isHovered && !isDragging) {
        setRotation((prev) => (prev + 0.15) % 360); // Adjust speed here
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, isDragging]);

  const handlePointerDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    setDragStartAngle(angle);
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || dragStartAngle === null || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const currentMouseAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    
    let delta = (currentMouseAngle - dragStartAngle) * (180 / Math.PI);
    
    // Fix jump when crossing PI / -PI boundary
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    setRotation((prev) => (prev + delta) % 360);
    setDragStartAngle(currentMouseAngle);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    setDragStartAngle(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Map icons based on entry content/id
  const getIcon = (title, org) => {
    const text = (title + ' ' + org).toLowerCase();
    if (text.includes('github') || text.includes('open source')) return Code;
    if (text.includes('undergrad') || text.includes('learning')) return GraduationCap;
    return Briefcase;
  };

  const radius = 220; // Radius of the orbital circle

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-4xl mx-auto min-h-[600px] flex items-center justify-center overflow-hidden py-20 touch-none select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >

      {/* Background Orbital Ring */}
      <div className="absolute w-[440px] h-[440px] rounded-full border border-foreground/10" />
      <div className="absolute w-[440px] h-[440px] rounded-full border-2 border-dashed border-foreground/5 animate-[spin_60s_linear_infinite]" />

      {/* Center Hub */}
      <div className="absolute z-10 w-20 h-20 rounded-full border-4 border-foreground/20 bg-background flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 animate-pulse flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-400 rounded-full" />
        </div>
      </div>

      {/* Orbital Nodes */}
      {timelineEntries.map((entry, index) => {
        const total = timelineEntries.length;
        // Start from top, add rotation state
        const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
        const currentAngle = baseAngle + (rotation * Math.PI) / 180;
        
        const x = Math.cos(currentAngle) * radius;
        const y = Math.sin(currentAngle) * radius;
        const isActive = activeId === entry.id;
        const Icon = getIcon(entry.title, entry.org);
        
        // Determine which side of the wheel the node is currently on
        const isRightSide = x > 0;

        return (
          <div
            key={entry.id}
            className="absolute transition-all duration-500"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              zIndex: isActive ? 20 : 5,
            }}
          >
            <div
              onMouseEnter={() => setActiveId(entry.id)}
              onMouseLeave={() => setActiveId(null)}
              className={cn(
                "relative group flex flex-col items-center justify-center outline-none",
                isActive ? "scale-110" : "hover:scale-105"
              )}
            >
              {/* Node glow effect */}
              {isActive && (
                <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
              )}

              {/* Permanent Connecting Spoke to center */}
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 w-[2px] origin-top transition-colors duration-300 pointer-events-none",
                  isActive
                    ? "bg-gradient-to-t from-purple-500 to-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    : "bg-gradient-to-t from-foreground/10 to-transparent"
                )}
                style={{
                  height: `${radius - 36}px`, // distance from node to center hub
                  transform: `rotate(${currentAngle + Math.PI / 2}rad)`,
                  transformOrigin: '0 0'
                }}
              />

              {/* Node Button */}
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 cursor-pointer",
                  isActive
                    ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                    : "bg-background border-foreground/20 text-foreground/60 group-hover:border-foreground/50 group-hover:text-foreground"
                )}
              >
                <Icon size={20} />
              </div>

              {/* Hover Info Card (Outside center, attached to node) */}
              {isActive && (
                <div 
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-72 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none text-left z-50",
                    isRightSide ? "right-20 origin-right" : "left-20 origin-left"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      {entry.year}
                    </span>
                    <span className="text-[10px] text-foreground/50 uppercase tracking-wider">{entry.org}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-foreground leading-tight">{entry.title}</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}
