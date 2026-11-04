import { createContext, useContext, useState } from 'react'

const AssistantContext = createContext(null)

export function AssistantProvider({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <AssistantContext.Provider value={{ open, setOpen }}>
      {children}
    </AssistantContext.Provider>
  )
}

export const useAssistant = () => useContext(AssistantContext)
