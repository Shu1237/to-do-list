import * as React from "react"

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, ...props }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => onOpenChange(false)}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 min-w-[320px]" onClick={e => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  )
}

export const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => <>{children}</>

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="mb-4">{children}</div>

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="text-lg font-semibold mb-2">{children}</h3>
