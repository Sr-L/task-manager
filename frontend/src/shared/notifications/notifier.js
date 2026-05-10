import { toast } from 'sonner';

export function createSonnerNotifier() {
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
  };
}
// 
export function createNoopNotifier() {
  return {
    success: () => {},
    error: () => {},
  };
}
