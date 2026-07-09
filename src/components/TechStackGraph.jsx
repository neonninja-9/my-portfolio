import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from 'd3-force';
import { select } from 'd3-selection';
import 'd3-transition'; // extends d3-selection prototype with .transition()
import { drag as d3Drag } from 'd3-drag';
import {
  skills,
  buildLinks,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PROFICIENCY_RADIUS,
} from '../data/skills';

// ─── Tunable force constants ────────────────────────────────
// Tweak these after seeing the graph live to adjust "spread"
const FORCE_CONFIG = {
  /** Link pull strength (higher = tighter connected nodes) */
  linkStrength: 0.1,
  /** Natural link rest distance */
  linkDistance: 130,
  /** Node repulsion (more negative = more spread) */
  chargeStrength: -320,
  /** How fast charge falls off with distance */
  chargeDistanceMax: 400,
  /** Pull toward center (keeps graph from drifting off-screen) */
  centerStrength: 0.04,
  /** Category cluster gravity — pulls nodes toward their quadrant */
  clusterStrength: 0.07,
  /** Extra cluster pull when a filter is active */
  clusterStrengthFiltered: 0.25,
  /** Collision padding beyond node radius */
  collisionPadding: 12,
  /** Ambient drift — keep > 0 so nodes never fully freeze */
  alphaTarget: 0.015,
  /** How fast simulation cools */
  alphaDecay: 0.008,
  /** Velocity damping (lower = more floaty) */
  velocityDecay: 0.35,
};

// Category cluster center offsets (fraction of SVG half-width/height)
const CLUSTER_CENTERS = {
  language:  { x: -0.25, y: -0.25 },
  framework: { x:  0.25, y: -0.25 },
  tool:      { x: -0.25, y:  0.25 },
  learning:  { x:  0.25, y:  0.25 },
};

const CATEGORIES = ['all', 'language', 'framework', 'tool', 'learning'];

const PROFICIENCY_ORDER = ['beginner', 'familiar', 'learning', 'intermediate', 'advanced'];
const proficiencyPercent = (p) => ((PROFICIENCY_ORDER.indexOf(p) + 1) / PROFICIENCY_ORDER.length) * 100;

export default function TechStackGraph() {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const containerRef = useRef(null);
  const isInViewRef = useRef(false);
  const nodesDataRef = useRef([]);
  const linksDataRef = useRef([]);
  const prefersReducedMotion = useRef(false);

  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedNode, setPinnedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e) => { prefersReducedMotion.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Responsive dimensions
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.min(rect.width, 1500);
      const h = Math.min(Math.max(w * 0.75, 550), 1000);
      setDimensions({ width: w, height: h });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Build connected-id lookup for hover dimming
  const connectedMap = useMemo(() => {
    const map = {};
    const links = buildLinks(skills);
    skills.forEach((s) => { map[s.id] = new Set(); });
    links.forEach((l) => {
      map[l.source]?.add(l.target);
      map[l.target]?.add(l.source);
    });
    return map;
  }, [skills]);

  const isRelated = useCallback(
    (nodeId) => {
      if (!hoveredId) return true;
      if (nodeId === hoveredId) return true;
      return connectedMap[hoveredId]?.has(nodeId) ?? false;
    },
    [hoveredId, connectedMap]
  );

  // ─── Simulation setup ──────────────────────────────────────
  useEffect(() => {
    const { width, height } = dimensions;
    const svg = select(svgRef.current);

    // Deep-clone skills so d3 can mutate x/y/vx/vy
    const nodes = skills.map((s) => ({
      ...s,
      // Start near cluster center for entrance feel
      x: width / 2 + CLUSTER_CENTERS[s.category].x * width * 0.5 + (Math.random() - 0.5) * 30,
      y: height / 2 + CLUSTER_CENTERS[s.category].y * height * 0.5 + (Math.random() - 0.5) * 30,
    }));
    const links = buildLinks(skills);

    nodesDataRef.current = nodes;
    linksDataRef.current = links;

    const sim = forceSimulation(nodes)
      .force(
        'link',
        forceLink(links)
          .id((d) => d.id)
          .strength(FORCE_CONFIG.linkStrength)
          .distance(FORCE_CONFIG.linkDistance)
      )
      .force(
        'charge',
        forceManyBody()
          .strength(FORCE_CONFIG.chargeStrength)
          .distanceMax(FORCE_CONFIG.chargeDistanceMax)
      )
      .force('center', forceCenter(width / 2, height / 2).strength(FORCE_CONFIG.centerStrength))
      .force(
        'clusterX',
        forceX((d) => width / 2 + CLUSTER_CENTERS[d.category].x * width * 0.4)
          .strength(FORCE_CONFIG.clusterStrength)
      )
      .force(
        'clusterY',
        forceY((d) => height / 2 + CLUSTER_CENTERS[d.category].y * height * 0.4)
          .strength(FORCE_CONFIG.clusterStrength)
      )
      .force(
        'collide',
        forceCollide((d) => PROFICIENCY_RADIUS[d.proficiency] + FORCE_CONFIG.collisionPadding)
      )
      .alphaTarget(prefersReducedMotion.current ? 0 : FORCE_CONFIG.alphaTarget)
      .alphaDecay(FORCE_CONFIG.alphaDecay)
      .velocityDecay(FORCE_CONFIG.velocityDecay);

    simRef.current = sim;

    // ── SVG structure ──────────────────────────────────────
    // Clear previous
    svg.selectAll('.graph-links, .graph-nodes').remove();

    const linkGroup = svg.append('g').attr('class', 'graph-links');
    const nodeGroup = svg.append('g').attr('class', 'graph-nodes');

    const linkEls = linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 1);

    const nodeEls = nodeGroup
      .selectAll('g')
      .data(nodes, (d) => d.id)
      .join('g')
      .attr('class', 'node-group')
      .style('cursor', 'grab');

    // Glow circle (behind main circle)
    nodeEls
      .append('circle')
      .attr('class', 'node-glow')
      .attr('r', (d) => PROFICIENCY_RADIUS[d.proficiency] + 8)
      .attr('fill', 'none')
      .attr('stroke', (d) => CATEGORY_COLORS[d.category])
      .attr('stroke-width', 2)
      .attr('opacity', 0.15)
      .attr('filter', (d) => `url(#glow-${d.category})`);

    // Main circle
    nodeEls
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d) => PROFICIENCY_RADIUS[d.proficiency])
      .attr('fill', (d) => {
        const c = CATEGORY_COLORS[d.category];
        return `${c}22`; // ~13% opacity fill
      })
      .attr('stroke', (d) => CATEGORY_COLORS[d.category])
      .attr('stroke-width', 1.5);

    // Label
    nodeEls
      .append('text')
      .attr('class', 'node-label')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => PROFICIENCY_RADIUS[d.proficiency] + 16)
      .attr('fill', '#a1a1aa')
      .attr('font-size', '11px')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('pointer-events', 'none');

    // ── Drag behavior ──────────────────────────────────────
    const dragBehavior = d3Drag()
      .on('start', (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        select(event.sourceEvent.target.closest('.node-group')).style('cursor', 'grabbing');
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) sim.alphaTarget(FORCE_CONFIG.alphaTarget);
        // Don't unpin if this node is the "pinned" detail node
        // We check later in the React state
        d.fx = null;
        d.fy = null;
        select(event.sourceEvent.target.closest('.node-group')).style('cursor', 'grab');
      });

    if (!prefersReducedMotion.current) {
      nodeEls.call(dragBehavior);
    }

    // ── Tick ────────────────────────────────────────────────
    sim.on('tick', () => {
      // Constrain nodes within SVG bounds
      nodes.forEach((d) => {
        const r = PROFICIENCY_RADIUS[d.proficiency] + 4;
        d.x = Math.max(r, Math.min(width - r, d.x));
        d.y = Math.max(r, Math.min(height - r, d.y));
      });

      linkEls
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      nodeEls.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // ── IntersectionObserver — pause when off-screen ────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          sim.alphaTarget(FORCE_CONFIG.alphaTarget).restart();
        } else {
          sim.stop();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      sim.stop();
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  // ─── Hover / filter visual updates (runs on React state change) ──
  useEffect(() => {
    const svg = select(svgRef.current);
    const nodes = nodesDataRef.current;

    // Determine which nodes are visible (filter)
    const visibleIds = new Set(
      activeFilter === 'all'
        ? nodes.map((n) => n.id)
        : nodes.filter((n) => n.category === activeFilter).map((n) => n.id)
    );

    // Update node visibility + hover dimming
    svg.selectAll('.node-group').each(function (d) {
      const el = select(this);
      const visible = visibleIds.has(d.id);
      const related = hoveredId ? isRelated(d.id) : true;
      const isHovered = d.id === hoveredId;
      const isPinned = d.id === pinnedNode?.id;

      el.transition()
        .duration(300)
        .style('opacity', visible ? (related ? 1 : 0.12) : 0)
        .style('pointer-events', visible ? 'auto' : 'none');

      // Scale up hovered / pinned node
      el.select('.node-circle')
        .transition()
        .duration(200)
        .attr('r', () => {
          const base = PROFICIENCY_RADIUS[d.proficiency];
          return isHovered || isPinned ? base * 1.25 : base;
        })
        .attr('stroke-width', isHovered || isPinned ? 2.5 : 1.5);

      el.select('.node-glow')
        .transition()
        .duration(200)
        .attr('opacity', isHovered || isPinned ? 0.5 : 0.15)
        .attr('r', () => {
          const base = PROFICIENCY_RADIUS[d.proficiency] + 8;
          return isHovered || isPinned ? base + 6 : base;
        });

      // Show/hide label
      el.select('.node-label')
        .transition()
        .duration(200)
        .attr('fill', isHovered || isPinned ? '#f0f0f5' : '#a1a1aa')
        .attr('font-size', isHovered || isPinned ? '12px' : '11px');
    });

    // Update link visibility
    svg.selectAll('.graph-links line').each(function (d) {
      const el = select(this);
      const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
      const targetId = typeof d.target === 'object' ? d.target.id : d.target;
      const bothVisible = visibleIds.has(sourceId) && visibleIds.has(targetId);
      const isHighlighted =
        hoveredId && (sourceId === hoveredId || targetId === hoveredId);

      el.transition()
        .duration(300)
        .attr('stroke', isHighlighted ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.08)')
        .attr('stroke-width', isHighlighted ? 2 : 1)
        .style('opacity', bothVisible ? (hoveredId ? (isHighlighted ? 1 : 0.06) : 1) : 0);
    });

    // Adjust cluster forces when filtered
    if (simRef.current) {
      const strength =
        activeFilter === 'all'
          ? FORCE_CONFIG.clusterStrength
          : FORCE_CONFIG.clusterStrengthFiltered;

      simRef.current
        .force('clusterX')
        ?.strength(activeFilter === 'all' ? strength : 0); // pull to center when filtered
      simRef.current
        .force('clusterY')
        ?.strength(activeFilter === 'all' ? strength : 0);

      if (activeFilter !== 'all') {
        // Strengthen center pull to gather filtered nodes
        simRef.current.force('center')?.strength(0.12);
      } else {
        simRef.current.force('center')?.strength(FORCE_CONFIG.centerStrength);
      }

      simRef.current.alpha(0.4).restart();
    }
  }, [hoveredId, activeFilter, pinnedNode, isRelated]);

  // ─── Event handlers ────────────────────────────────────────
  const handleNodeHover = useCallback((id) => {
    setHoveredId(id);
  }, []);

  const handleNodeClick = useCallback(
    (node) => {
      if (pinnedNode?.id === node.id) {
        // Unpin
        node.fx = null;
        node.fy = null;
        setPinnedNode(null);
      } else {
        // Pin
        node.fx = node.x;
        node.fy = node.y;
        setPinnedNode({ ...node, _x: node.x, _y: node.y });
      }
    },
    [pinnedNode]
  );

  const handleSvgClick = useCallback(
    (e) => {
      // If clicking empty SVG area (not a node), unpin
      if (e.target === svgRef.current || e.target.tagName === 'svg') {
        if (pinnedNode) {
          const nodeData = nodesDataRef.current.find((n) => n.id === pinnedNode.id);
          if (nodeData) {
            nodeData.fx = null;
            nodeData.fy = null;
          }
          setPinnedNode(null);
        }
      }
    },
    [pinnedNode]
  );

  // ─── Attach DOM events to SVG nodes (outside React render) ──
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('.node-group')
      .on('mouseenter', (event, d) => handleNodeHover(d.id))
      .on('mouseleave', () => handleNodeHover(null))
      .on('click', (event, d) => {
        event.stopPropagation();
        handleNodeClick(d);
      })
      // Touch support: tap toggles
      .on('touchstart', (event, d) => {
        event.preventDefault();
        if (hoveredId === d.id) {
          handleNodeHover(null);
          handleNodeClick(d);
        } else {
          handleNodeHover(d.id);
        }
      }, { passive: false });
  }, [handleNodeHover, handleNodeClick, hoveredId]);

  // ─── Render ────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="techgraph-container spotlight-card">
      {/* Filter chips */}
      <div className="techgraph-filters">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            className={`techgraph-chip ${activeFilter === cat ? 'techgraph-chip--active' : ''}`}
            onClick={() => setActiveFilter(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={
              activeFilter === cat && cat !== 'all'
                ? {
                    borderColor: CATEGORY_COLORS[cat],
                    boxShadow: `0 0 12px ${CATEGORY_COLORS[cat]}33`,
                  }
                : {}
            }
          >
            {cat !== 'all' && (
              <span
                className="techgraph-chip__dot"
                style={{ background: CATEGORY_COLORS[cat] }}
              />
            )}
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
          </motion.button>
        ))}
      </div>

      {/* SVG canvas */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="techgraph-svg"
        onClick={handleSvgClick}
      >
        {/* Glow filters */}
        <defs>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <filter key={cat} id={`glow-${cat}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={color} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
      </svg>

      {/* Detail panel (pinned node) */}
      <AnimatePresence>
        {pinnedNode && (
          <motion.div
            className="techgraph-detail glass-card"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            <div className="techgraph-detail__header">
              <span
                className="techgraph-detail__dot"
                style={{ background: CATEGORY_COLORS[pinnedNode.category] }}
              />
              <h3 className="techgraph-detail__title">{pinnedNode.label}</h3>
            </div>
            <span className="techgraph-detail__category">
              {CATEGORY_LABELS[pinnedNode.category]}
            </span>
            <div className="techgraph-detail__bar-wrapper">
              <div className="techgraph-detail__bar-track">
                <motion.div
                  className="techgraph-detail__bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${proficiencyPercent(pinnedNode.proficiency)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ background: CATEGORY_COLORS[pinnedNode.category] }}
                />
              </div>
              <span className="techgraph-detail__proficiency">{pinnedNode.proficiency}</span>
            </div>
            {pinnedNode.note && (
              <p className="techgraph-detail__note">{pinnedNode.note}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen-reader fallback */}
      <ul className="sr-only" aria-label="Tech stack skills">
        {skills.map((s) => (
          <li key={s.id}>
            {s.label} — {CATEGORY_LABELS[s.category]}, {s.proficiency}
            {s.note ? `. ${s.note}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
