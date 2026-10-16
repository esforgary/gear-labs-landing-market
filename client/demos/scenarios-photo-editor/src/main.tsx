import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import PhotoEditor from './components/PhotoEditor'
import { newPhotoProject, type PhotoFont, type PhotoProject } from './lib/photo/types'
import { parsePhotoProject, parseStoredFonts } from './lib/photo/storage'
import type { ImageAsset, WorkspaceRepository } from './types'
import './base.css'
import './standalone.css'

type Saved = { project: PhotoProject; gallery: ImageAsset[]; fonts: PhotoFont[] }
const database = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('gearlabs-scenarios-photo-editor', 1)
  request.onupgradeneeded = () => request.result.createObjectStore('workspace')
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})
// Handle blocked browser storage even before the editor mounts.
void database.catch(() => undefined)
async function readSaved(): Promise<Saved | undefined> {
  const db = await database
  return new Promise((resolve, reject) => {
    const request = db.transaction('workspace').objectStore('workspace').get('current')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
async function save(data: Saved) {
  const db = await database
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('workspace', 'readwrite')
    transaction.objectStore('workspace').put(data, 'current')
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}
function readAsset(value: unknown): ImageAsset {
  const asset = value as ImageAsset
  if (!asset || typeof asset.id !== 'string' || typeof asset.name !== 'string' || typeof asset.url !== 'string' || !asset.url.startsWith('data:image/')) throw new Error('Некорректное изображение')
  return { id: asset.id, name: asset.name, url: asset.url }
}
const repository: WorkspaceRepository = {
  upload: async file => {
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) throw new Error('Выберите PNG, JPG, WebP или GIF.')
    if (file.size > 30 * 1024 * 1024) throw new Error('Выберите изображение до 30 МБ.')
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Не удалось прочитать изображение.'))
      reader.readAsDataURL(file)
    })
    return { id: crypto.randomUUID(), name: file.name, url }
  },
}

function App() {
  const [data, setData] = useState<Saved | null>(null)
  const [status, setStatus] = useState('Загружаем локальный проект…')
  const latest = useRef<Saved | null>(null)
  const revision = useRef(0)
  useEffect(() => {
    let active = true
    void readSaved().then(saved => {
      if (!active) return
      const initial = saved ? { project: parsePhotoProject(saved.project, readAsset) ?? newPhotoProject(), gallery: saved.gallery.map(readAsset), fonts: parseStoredFonts(saved.fonts) } : { project: newPhotoProject(), gallery: [], fonts: [] }
      latest.current = initial
      setData(initial)
      setStatus('Сохраняется в этом браузере · изображения остаются на устройстве')
    }).catch(() => {
      if (!active) return
      const initial = { project: newPhotoProject(), gallery: [], fonts: [] }
      latest.current = initial
      setData(initial)
      setStatus('Не удалось открыть сохранение. Работайте и экспортируйте PNG перед закрытием.')
    })
    return () => { active = false }
  }, [])
  function update(patch: Partial<Saved>) {
    if (!latest.current) return
    const next = { ...latest.current, ...patch }
    latest.current = next
    setData(next)
    const current = ++revision.current
    setStatus('Сохраняем на устройстве…')
    void save(next).then(() => {
      if (current === revision.current) setStatus('Сохранено в этом браузере · изображения остаются на устройстве')
    }).catch(() => {
      if (current === revision.current) setStatus('Хранилище недоступно или заполнено. Экспортируйте PNG перед закрытием.')
    })
  }
  return <main className="standalone-editor">
    <header className="standalone-heading"><div><span>SCENARIOS</span><h1>Фоторедактор</h1></div><p role="status">{status}</p></header>
    {data && <PhotoEditor project={data.project} gallery={data.gallery} fonts={data.fonts} repository={repository} active onChange={project => update({ project })} onFontsChange={fonts => update({ fonts })} onExport={image => update({ gallery: [...(latest.current?.gallery ?? []), image] })} onCleanup={async () => { /* Unreferenced local data is released with the next snapshot. */ }} />}
  </main>
}
createRoot(document.getElementById('root')!).render(<App />)
