export const toast = (props: { title: string; description?: string }) => {
  // This is a simplified version for the demo
  console.log("Toast:", props)
}

export const useToast = () => {
  return { toast }
}
