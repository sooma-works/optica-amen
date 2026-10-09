import { createContext, useContext } from 'react'

export const ToastContext = createContext(() => {})

// Devuelve la función para mostrar un aviso: toast({ mensaje, deshacer? }).
export function useToast() {
  return useContext(ToastContext)
}
