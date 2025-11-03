import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);
    
    this.setState({ errorInfo });
  }

  handleReload = () => {
    // Reset error boundary state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#d32f2f' }}>
            ଦୁଃଖିତ, କିଛି ଭୁଲ୍ ହୋଇଛି
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
            Something went wrong
          </Text>
          <ScrollView style={{ maxHeight: 200, width: '100%', marginBottom: 20 }}>
            <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            {__DEV__ && this.state.error?.stack && (
              <Text style={{ textAlign: 'left', color: '#999', fontSize: 10, marginTop: 10, fontFamily: 'monospace' }}>
                {this.state.error.stack}
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={{ backgroundColor: '#FF6B35', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 10 }}
            onPress={this.handleReload}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ / Try Again</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 10 }}>
            If the problem persists, please reinstall the app
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
