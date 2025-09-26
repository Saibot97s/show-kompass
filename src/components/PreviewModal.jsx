import { useEffect, useRef } from 'react'

export default function PreviewModal({ open, onClose }){
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if(!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog id="previewModal" ref={dialogRef} aria-label="Kursvorschau" onCancel={(e)=>{e.preventDefault(); onClose?.()}}>
      <div className="modal-head">
        <h3>Vorschau: Was erwartet dich?</h3>
        <button className="x" aria-label="Schließen" onClick={onClose}>×</button>
      </div>
      <div className="video-wrap">
        {open && (
          <iframe
            src="https://www.youtube-nocookie.com/embed/BVxK_4_L6wQ?si=DoBpufy9wEOuOOBm"
            title="Kursvorschau"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </dialog>
  )
}