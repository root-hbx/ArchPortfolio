export type WindowId = string

export type SplitDirection = 'horizontal' | 'vertical'

export interface SplitContainer {
  direction: SplitDirection
  first: TilingNode
  second: TilingNode
  ratio: number // 0.0 - 1.0
}

export type TilingNode = WindowId | SplitContainer

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface WorkspaceState {
  tree: TilingNode | null
  lastSplitDirection: SplitDirection
}
