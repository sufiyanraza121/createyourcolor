import { GradientGallery } from './components/GradientGallery';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <GradientGallery />
      <Toaster position="top-center" />
    </div>
  );
}