export interface ImageAsset { id: string; name: string; url: string; path?: string }
export interface WorkspaceRepository { upload(file: File): Promise<ImageAsset> }
