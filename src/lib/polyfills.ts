// Polyfills for @react-pdf/renderer in browser environment
if (typeof window !== 'undefined') {
  // Polyfill for canvas
  if (!window.HTMLCanvasElement.prototype.toBlob) {
    window.HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
      const canvas = this;
      const dataURL = canvas.toDataURL(type, quality);
      const binStr = atob(dataURL.split(',')[1]);
      const len = binStr.length;
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      const blob = new Blob([arr], { type: type || 'image/png' });
      callback(blob);
    };
  }

  // Polyfill for crypto
  if (!window.crypto) {
    (window as any).crypto = {
      getRandomValues: function(arr: Uint8Array) {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      }
    };
  }
}
