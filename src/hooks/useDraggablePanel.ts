/**
 * useDraggablePanel — Shared hook for panel position and drag behavior.
 *
 * Architecture:
 * - Uses TOP/LEFT positioning (not bottom) so header clearance is trivial.
 * - Each panel receives a `panelIndex` (0, 1, 2) to cascade left-to-right.
 * - Clamps positions so panels never overlap the header or go off-screen.
 * - On mobile (< 640px), panels stack vertically below the header, full-width.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  PANEL_HEADER_CLEARANCE,
  PANEL_CASCADE_X,
  PANEL_DEFAULT_WIDTH,
  PANEL_EDGE_MARGIN,
  PANEL_BOTTOM_CLEARANCE,
} from '../lib/params';

interface PanelPosition {
  top: number;
  left: number;
}

interface DraggablePanelResult {
  position: PanelPosition;
  width: number;
  handleMouseDown: (e: React.MouseEvent) => void;
}

/** Clamp position to keep panel within safe viewport bounds */
const clampPosition = (
  top: number,
  left: number,
  panelWidth: number,
): PanelPosition => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return {
    top: Math.max(PANEL_HEADER_CLEARANCE, Math.min(top, vh - PANEL_BOTTOM_CLEARANCE)),
    left: Math.max(PANEL_EDGE_MARGIN, Math.min(left, vw - panelWidth - PANEL_EDGE_MARGIN)),
  };
};

/** Compute default cascade position for a panel by index */
const getDefaultPosition = (panelIndex: number): { position: PanelPosition; width: number } => {
  const vw = window.innerWidth;
  const isMobile = vw < 640;

  if (isMobile) {
    const mobileWidth = vw - PANEL_EDGE_MARGIN * 2;
    return {
      position: {
        top: PANEL_HEADER_CLEARANCE + panelIndex * 12, // slight offset so user can see stacked panels
        left: PANEL_EDGE_MARGIN,
      },
      width: mobileWidth,
    };
  }

  const desiredLeft = PANEL_EDGE_MARGIN + panelIndex * PANEL_CASCADE_X;
  const panelWidth = PANEL_DEFAULT_WIDTH;

  // If cascade would go off-screen, wrap to left and shift down
  const maxLeft = vw - panelWidth - PANEL_EDGE_MARGIN;
  const left = desiredLeft > maxLeft ? PANEL_EDGE_MARGIN + (desiredLeft - maxLeft) % PANEL_CASCADE_X : desiredLeft;
  const extraTop = desiredLeft > maxLeft ? 30 : 0;

  return {
    position: clampPosition(PANEL_HEADER_CLEARANCE + extraTop, left, panelWidth),
    width: panelWidth,
  };
};

export function useDraggablePanel(panelIndex: number): DraggablePanelResult {
  const defaults = getDefaultPosition(panelIndex);
  const [position, setPosition] = useState<PanelPosition>(defaults.position);
  const [width, setWidth] = useState<number>(defaults.width);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Recompute position on resize
  useEffect(() => {
    const handleResize = () => {
      // Only reset to default if not currently dragged (user may have moved it)
      if (!isDragging.current) {
        const fresh = getDefaultPosition(panelIndex);
        setPosition(fresh.position);
        setWidth(fresh.width);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [panelIndex]);

  // Drag behavior
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const rawTop = e.clientY - dragOffset.current.y;
        const rawLeft = e.clientX - dragOffset.current.x;
        setPosition(clampPosition(rawTop, rawLeft, width));
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [width]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
  }, [position.left, position.top]);

  return { position, width, handleMouseDown };
}
