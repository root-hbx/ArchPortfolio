import { TilingNode, SplitContainer, SplitDirection, WindowId } from './types'

export function isLeaf(node: TilingNode): node is WindowId {
  return typeof node === 'string'
}

export function isSplit(node: TilingNode): node is SplitContainer {
  return typeof node === 'object' && node !== null && 'direction' in node
}

export function containsLeaf(node: TilingNode, windowId: WindowId): boolean {
  if (isLeaf(node)) return node === windowId
  return containsLeaf(node.first, windowId) || containsLeaf(node.second, windowId)
}

export function findAllLeaves(node: TilingNode): WindowId[] {
  if (isLeaf(node)) return [node]
  return [...findAllLeaves(node.first), ...findAllLeaves(node.second)]
}

export function insertWindow(
  root: TilingNode | null,
  windowId: WindowId,
  focusedId: WindowId | null,
  lastDirection: SplitDirection
): TilingNode {
  if (root === null) return windowId

  const newDirection: SplitDirection = lastDirection === 'horizontal' ? 'vertical' : 'horizontal'

  if (isLeaf(root)) {
    if (focusedId === null || root === focusedId) {
      return {
        direction: newDirection,
        first: root,
        second: windowId,
        ratio: 0.5,
      }
    }
    return root
  }

  // Try to insert next to the focused window
  if (focusedId && containsLeaf(root.first, focusedId)) {
    return {
      ...root,
      first: insertWindow(root.first, windowId, focusedId, newDirection),
    }
  }
  if (focusedId && containsLeaf(root.second, focusedId)) {
    return {
      ...root,
      second: insertWindow(root.second, windowId, focusedId, newDirection),
    }
  }

  // Default: insert at the end (second branch)
  return {
    direction: newDirection,
    first: root,
    second: windowId,
    ratio: 0.5,
  }
}

export function removeWindow(root: TilingNode | null, windowId: WindowId): TilingNode | null {
  if (root === null) return null
  if (isLeaf(root)) return root === windowId ? null : root

  const firstResult = removeWindow(root.first, windowId)
  const secondResult = removeWindow(root.second, windowId)

  if (firstResult === null && secondResult === null) return null
  if (firstResult === null) return secondResult
  if (secondResult === null) return firstResult

  return {
    ...root,
    first: firstResult,
    second: secondResult,
  }
}

export function getFirstLeaf(node: TilingNode): WindowId {
  if (isLeaf(node)) return node
  return getFirstLeaf(node.first)
}

export function getLastLeaf(node: TilingNode): WindowId {
  if (isLeaf(node)) return node
  return getLastLeaf(node.second)
}

export function getAdjacentWindow(
  root: TilingNode,
  currentId: WindowId,
  direction: 'left' | 'right' | 'up' | 'down'
): WindowId | null {
  const leaves = findAllLeaves(root)
  const idx = leaves.indexOf(currentId)
  if (idx === -1) return null

  // Simple linear navigation for now
  if (direction === 'left' || direction === 'up') {
    return idx > 0 ? leaves[idx - 1] : null
  }
  return idx < leaves.length - 1 ? leaves[idx + 1] : null
}

export function updateRatio(
  root: TilingNode,
  path: ('first' | 'second')[],
  newRatio: number
): TilingNode {
  if (isLeaf(root) || path.length === 0) {
    if (isSplit(root) && path.length === 0) {
      return { ...root, ratio: Math.max(0.15, Math.min(0.85, newRatio)) }
    }
    return root
  }

  const [head, ...rest] = path
  if (head === 'first') {
    return { ...root, first: updateRatio(root.first, rest, newRatio) }
  }
  return { ...root, second: updateRatio(root.second, rest, newRatio) }
}
