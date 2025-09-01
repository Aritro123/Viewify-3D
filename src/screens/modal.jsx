import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Eye, Info, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const ModelViewer = () => {
  const [selectedModel, setSelectedModel] = useState('Astronaut');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [modelError, setModelError] = useState(false);
  const modelViewerRef = useRef(null);

  const models = {
    Astronaut: {
      model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      poster: "https://modelviewer.dev/assets/poster-astronaut.png",
      title: "Space Explorer",
      description: "A detailed astronaut model ready for space exploration missions."
    },
    RobotExpressive: {
      model: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      poster: "https://modelviewer.dev/assets/poster-robot.png", 
      title: "Expressive Robot",
      description: "An animated robot with expressive features and smooth movements."
    },
    Horse: {
      model: "https://modelviewer.dev/shared-assets/models/Horse.glb",
      poster: "https://modelviewer.dev/assets/poster-horse.png",
      title: "Majestic Horse",
      description: "A beautiful horse model with realistic proportions and textures."
    }
  };

  useEffect(() => {
    // Load model-viewer script
    if (!window.customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(script);

      script.onload = () => {
        console.log('Model viewer script loaded');
      };
    }
  }, []);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setIsLoading(false);
      setModelError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setModelError(true);
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
    };
  }, [selectedModel]);

  const handleModelSelect = (modelName) => {
    setSelectedModel(modelName);
    setIsLoading(true);
    setModelError(false);
  };

  const toggleAnimation = () => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    try {
      if (isPlaying) {
        viewer.pause();
      } else {
        viewer.play();
      }
      setIsPlaying(!isPlaying);
    } catch (e) {
      console.log('Animation control not available');
    }
  };

  const resetCamera = () => {
    const viewer = modelViewerRef.current;
    if (viewer && viewer.resetTurntableRotation) {
      viewer.resetTurntableRotation();
    }
  };

  const currentModel = models[selectedModel];
  const modelKeys = Object.keys(models);
  const currentIndex = modelKeys.indexOf(selectedModel);

  const nextModel = () => {
    const nextIndex = (currentIndex + 1) % modelKeys.length;
    handleModelSelect(modelKeys[nextIndex]);
  };

  const prevModel = () => {
    const prevIndex = currentIndex === 0 ? modelKeys.length - 1 : currentIndex - 1;
    handleModelSelect(modelKeys[prevIndex]);
  };

  // Custom model-viewer component
  const ModelViewerComponent = () => {
    return React.createElement('model-viewer', {
      ref: modelViewerRef,
      src: currentModel.model,
      poster: currentModel.poster,
      alt: `3D model of ${currentModel.title}`,
      'shadow-intensity': '1',
      'camera-controls': true,
      'touch-action': 'pan-y',
      'auto-rotate': true,
      'auto-rotate-delay': '3000',
      'rotation-per-second': '20deg',
      ar: true,
      'ar-modes': 'webxr scene-viewer quick-look',
      'environment-image': 'neutral',
      exposure: '1',
      style: {
        width: '100%',
        height: '600px',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #ddd6fe 100%)',
        borderRadius: '1rem'
      },
      children: [
        React.createElement('button', {
          key: 'ar-button',
          slot: 'ar-button',
          className: 'absolute left-1/2 transform -translate-x-1/2 bottom-24 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium text-purple-600 hover:scale-105',
          children: [
            React.createElement(Eye, { key: 'eye-icon', size: 18 }),
            'View in AR'
          ]
        }),
        React.createElement('div', {
          key: 'ar-prompt',
          id: 'ar-prompt',
          className: 'absolute left-1/2 bottom-36 transform -translate-x-1/2',
          children: React.createElement('img', {
            src: 'https://modelviewer.dev/assets/hand.png',
            alt: 'AR hand prompt',
            className: 'w-16 h-16 animate-bounce'
          })
        }),
        React.createElement('div', {
          key: 'ar-failure',
          id: 'ar-failure',
          className: 'absolute left-1/2 bottom-36 transform -translate-x-1/2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium',
          children: 'AR tracking lost!'
        })
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">3D Model Gallery</h1>
              <p className="text-gray-600 text-lg">Explore interactive 3D models in augmented reality</p>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 text-gray-700 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl transform animate-pulse">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Use</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>Rotate:</strong> Click and drag to rotate the model</p>
              <p>• <strong>Zoom:</strong> Scroll or pinch to zoom in/out</p>
              <p>• <strong>AR Mode:</strong> Click "View in AR" on supported devices</p>
              <p>• <strong>Models:</strong> Use the carousel below to switch models</p>
              <p>• <strong>Navigation:</strong> Use arrow keys or navigation buttons</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
          {/* Model Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentModel.title}</h2>
            <p className="text-gray-600 text-lg">{currentModel.description}</p>
          </div>

          {/* Model Viewer Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                  <p className="text-gray-700 font-medium">Loading 3D Model...</p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {modelError && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4 mx-auto" />
                  <p className="text-red-600 font-medium">Failed to load 3D model</p>
                  <button 
                    onClick={() => handleModelSelect(selectedModel)}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Arrows */}
            <button
              onClick={prevModel}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={nextModel}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <ArrowRight size={20} />
            </button>

            {/* Model Viewer */}
            <ModelViewerComponent />

            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={toggleAnimation}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                title={isPlaying ? "Pause Animation" : "Play Animation"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={resetCamera}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                title="Reset Camera"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Model Carousel */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-gray-800">Choose a Model</h3>
              <div className="text-sm text-gray-600">
                {currentIndex + 1} of {modelKeys.length}
              </div>
            </div>
            
            <div className="flex gap-4 justify-center overflow-x-auto pb-2">
              {Object.entries(models).map(([key, model]) => (
                <button
                  key={key}
                  onClick={() => handleModelSelect(key)}
                  className={`group flex-shrink-0 relative overflow-hidden rounded-xl transition-all duration-300 ${
                    selectedModel === key
                      ? 'ring-4 ring-purple-500 scale-105'
                      : 'hover:scale-105 hover:ring-2 hover:ring-purple-300'
                  }`}
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    <img
                      src={model.poster}
                      alt={model.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div class="text-gray-700 text-xs font-bold p-2">${model.title}</div>`;
                      }}
                    />
                  </div>
                  
                  {/* Selection Indicator */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                    {selectedModel === key && (
                      <div className="w-4 h-4 bg-white rounded-full border-2 border-purple-500"></div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-xs font-medium truncate">{model.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/60 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="text-white" size={24} />
              </div>
              <h3 className="text-gray-800 font-semibold mb-2">AR Ready</h3>
              <p className="text-gray-600 text-sm">View models in your real space with augmented reality</p>
            </div>
            
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/60 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="text-white" size={24} />
              </div>
              <h3 className="text-gray-800 font-semibold mb-2">Interactive</h3>
              <p className="text-gray-600 text-sm">Rotate, zoom, and explore every angle</p>
            </div>
            
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/60 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="text-white" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                </svg>
              </div>
              <h3 className="text-gray-800 font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600 text-sm">Detailed 3D models with realistic lighting</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-200/60 to-pink-200/60 rounded-xl border border-purple-300/50">
            <h3 className="text-gray-800 font-semibold mb-3">Quick Controls</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Click & drag to rotate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Scroll to zoom in/out</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Double-click to focus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Use AR button for mobile AR</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p className="mb-2 font-medium">Powered by Google Model Viewer</p>
        <p className="text-sm opacity-75">Experience the future of 3D web content</p>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        model-viewer #ar-button {
          position: absolute !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: 96px !important;
          background: white !important;
          color: #7c3aed !important;
          border: none !important;
          border-radius: 9999px !important;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          transition: all 0.3s ease !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          font-size: 14px !important;
        }

        model-viewer #ar-button:hover {
          transform: translateX(-50%) scale(1.05) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }

        model-viewer #ar-button::before {
          content: '👁️ ';
        }

        model-viewer #ar-prompt {
          animation: float 3s ease-in-out infinite !important;
        }

        model-viewer #ar-failure {
          display: none !important;
        }

        model-viewer[ar-tracking="not-tracking"] #ar-failure {
          display: block !important;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateX(-50%) translateY(0px); 
          }
          50% { 
            transform: translateX(-50%) translateY(-10px); 
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ModelViewer;