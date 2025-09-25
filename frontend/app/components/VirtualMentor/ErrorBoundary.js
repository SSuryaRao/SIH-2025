'use client';

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Virtual Mentor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-96 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🤖⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Mentor Temporarily Unavailable
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              We're experiencing technical difficulties with the 3D avatar system.
              Please try refreshing the page or use our text chat instead.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;