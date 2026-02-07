'use client'

import { create } from 'zustand'
import { WindowState } from '@/types'
import { TilingNode, WorkspaceState, SplitDirection } from '@/lib/wm/types'
import { insertWindow, removeWindow, findAllLeaves, getFirstLeaf, getAdjacentWindow, updateRatio } from '@/lib/wm/tree'

interface WmState {
  workspaces: Record<number, WorkspaceState>
  windows: Record<string, WindowState>
  focusedWindowId: string | null
  nextWindowNum: Record<string, number>

  openWindow: (appId: string, workspaceId: number) => string
  closeWindow: (windowId: string, workspaceId: number) => void
  focusWindow: (windowId: string) => void
  toggleFloat: (windowId: string, workspaceId: number) => void
  toggleFullscreen: (windowId: string) => void
  moveFocus: (direction: 'left' | 'right' | 'up' | 'down', workspaceId: number) => void
  updateSplitRatio: (workspaceId: number, path: ('first' | 'second')[], ratio: number) => void
  updateFloatRect: (windowId: string, rect: { x: number; y: number; width: number; height: number }) => void
}

function initWorkspace(): WorkspaceState {
  return { tree: null, lastSplitDirection: 'horizontal' }
}

export const useWmStore = create<WmState>()((set, get) => ({
  workspaces: {
    1: initWorkspace(),
    2: initWorkspace(),
    3: initWorkspace(),
    4: initWorkspace(),
    5: initWorkspace(),
  },
  windows: {},
  focusedWindowId: null,
  nextWindowNum: {},

  openWindow: (appId, workspaceId) => {
    const state = get()
    const num = (state.nextWindowNum[appId] || 0) + 1
    const windowId = `${appId}-${num}`
    const ws = state.workspaces[workspaceId] || initWorkspace()
    const newDirection: SplitDirection = ws.lastSplitDirection === 'horizontal' ? 'vertical' : 'horizontal'

    const newTree = insertWindow(ws.tree, windowId, state.focusedWindowId, ws.lastSplitDirection)

    set({
      windows: {
        ...state.windows,
        [windowId]: {
          id: windowId,
          appId,
          title: appId.charAt(0).toUpperCase() + appId.slice(1),
          isFloating: false,
          isFullscreen: false,
        },
      },
      workspaces: {
        ...state.workspaces,
        [workspaceId]: {
          tree: newTree,
          lastSplitDirection: newDirection,
        },
      },
      focusedWindowId: windowId,
      nextWindowNum: { ...state.nextWindowNum, [appId]: num },
    })

    return windowId
  },

  closeWindow: (windowId, workspaceId) => {
    const state = get()
    const ws = state.workspaces[workspaceId]
    if (!ws) return

    const newTree = removeWindow(ws.tree, windowId)
    const newWindows = { ...state.windows }
    delete newWindows[windowId]

    let newFocus: string | null = null
    if (newTree) {
      const leaves = findAllLeaves(newTree)
      newFocus = leaves.length > 0 ? getFirstLeaf(newTree) : null
    }

    set({
      windows: newWindows,
      workspaces: {
        ...state.workspaces,
        [workspaceId]: { ...ws, tree: newTree },
      },
      focusedWindowId: state.focusedWindowId === windowId ? newFocus : state.focusedWindowId,
    })
  },

  focusWindow: (windowId) => {
    set({ focusedWindowId: windowId })
  },

  toggleFloat: (windowId, workspaceId) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return

    const ws = state.workspaces[workspaceId]
    if (!ws) return

    if (win.isFloating) {
      // Re-tile: insert back into tree
      const newTree = insertWindow(ws.tree, windowId, state.focusedWindowId, ws.lastSplitDirection)
      set({
        windows: {
          ...state.windows,
          [windowId]: { ...win, isFloating: false, floatRect: undefined },
        },
        workspaces: {
          ...state.workspaces,
          [workspaceId]: { ...ws, tree: newTree },
        },
      })
    } else {
      // Float: remove from tree
      const newTree = removeWindow(ws.tree, windowId)
      set({
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            isFloating: true,
            floatRect: { x: 100, y: 100, width: 600, height: 400 },
          },
        },
        workspaces: {
          ...state.workspaces,
          [workspaceId]: { ...ws, tree: newTree },
        },
      })
    }
  },

  toggleFullscreen: (windowId) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return
    set({
      windows: {
        ...state.windows,
        [windowId]: { ...win, isFullscreen: !win.isFullscreen },
      },
    })
  },

  moveFocus: (direction, workspaceId) => {
    const state = get()
    const ws = state.workspaces[workspaceId]
    if (!ws || !ws.tree || !state.focusedWindowId) return

    const next = getAdjacentWindow(ws.tree, state.focusedWindowId, direction)
    if (next) {
      set({ focusedWindowId: next })
    }
  },

  updateSplitRatio: (workspaceId, path, ratio) => {
    const state = get()
    const ws = state.workspaces[workspaceId]
    if (!ws || !ws.tree) return

    const newTree = updateRatio(ws.tree, path, ratio)
    set({
      workspaces: {
        ...state.workspaces,
        [workspaceId]: { ...ws, tree: newTree },
      },
    })
  },

  updateFloatRect: (windowId, rect) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return
    set({
      windows: {
        ...state.windows,
        [windowId]: { ...win, floatRect: rect },
      },
    })
  },
}))
