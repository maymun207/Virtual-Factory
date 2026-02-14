/**
 * useDraggablePanel — Shared hook for panel position and drag behavior.
 * Eliminates the duplicate positioning/drag logic from TilePassport, DefectHeatmap, ControlPanel.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { PANEL_DEFAULT_POSITION, PANEL_DEFAULT_WIDTH, PANEL_ANCHOR_OFFSET } from '../lib/params';

interface DraggablePanelResult {
  position: { x: number; y: number };
  width: number;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export function useDraggablePanel(anchorButtonId: string): DraggablePanelResult {
  const [position, setPosition] = useState({ ...PANEL_DEFAULT_POSITION });
  const [width, setWidth] = useState(PANEL_DEFAULT_WIDTH);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Position panel relative to its anchor button
  useEffect(() => {
    const updatePosition = () => {
      const btn = document.getElementById(anchorButtonId);
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setPosition({
          x: rect.left,
          y: window.innerHeight - rect.top + PANEL_ANCHOR_OFFSET,
        });
        setWidth(rect.width);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [anchorButtonId]);

  // Drag behavior
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: window.innerHeight - e.clientY - dragOffset.current.y,
        });
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
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: window.innerHeight - e.clientY - position.y,
    };
  }, [position.x, position.y]);

  return { position, width, handleMouseDown };
}

