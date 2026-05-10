import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.page}>
          <div className={styles.card}>
            <span className={styles.icon}>⚠</span>
            <h1 className={styles.title}>Algo ha ido mal</h1>
            <button className={styles.btn} onClick={this.handleReset}>
              Volver al inicio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
