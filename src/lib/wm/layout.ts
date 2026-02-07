import { TilingNode, BoundingBox, WindowId } from './types'
import { isLeaf } from './tree'

export interface LayoutEntry {
  windowId: WindowId
  rect: BoundingBox
  path: ('first' | 'second')[]
}

export interface SplitEntry {
  rect: BoundingBox
  direction: 'horizontal' | 'vertical'
  path: ('first' | 'second')[]
}

export function computeLayout(
  tree: TilingNode | null,
  container: BoundingBox,
  gap: number
): { windows: LayoutEntry[]; splits: SplitEntry[] } {
  if (tree === null) return { windows: [], splits: [] }

  const windows: LayoutEntry[] = []
  const splits: SplitEntry[] = []

  function traverse(node: TilingNode, box: BoundingBox, path: ('first' | 'second')[]) {
    if (isLeaf(node)) {
      windows.push({
        windowId: node,
        rect: {
          x: box.x + gap,
          y: box.y + gap,
          width: Math.max(box.width - gap * 2, 0),
          height: Math.max(box.height - gap * 2, 0),
        },
        path,
      })
      return
    }

    const { direction, first, second, ratio } = node

    if (direction === 'horizontal') {
      const splitX = box.x + box.width * ratio
      const firstBox: BoundingBox = {
        x: box.x,
        y: box.y,
        width: box.width * ratio,
        height: box.height,
      }
      const secondBox: BoundingBox = {
        x: splitX,
        y: box.y,
        width: box.width * (1 - ratio),
        height: box.height,
      }
      splits.push({
        rect: {
          x: splitX - gap,
          y: box.y + gap,
          width: gap * 2,
          height: box.height - gap * 2,
        },
        direction: 'horizontal',
        path,
      })
      traverse(first, firstBox, [...path, 'first'])
      traverse(second, secondBox, [...path, 'second'])
    } else {
      const splitY = box.y + box.height * ratio
      const firstBox: BoundingBox = {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height * ratio,
      }
      const secondBox: BoundingBox = {
        x: box.x,
        y: splitY,
        width: box.width,
        height: box.height * (1 - ratio),
      }
      splits.push({
        rect: {
          x: box.x + gap,
          y: splitY - gap,
          width: box.width - gap * 2,
          height: gap * 2,
        },
        direction: 'vertical',
        path,
      })
      traverse(first, firstBox, [...path, 'first'])
      traverse(second, secondBox, [...path, 'second'])
    }
  }

  traverse(tree, container, [])
  return { windows, splits }
}
