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
    // In production this would log to an error tracking service
    console.error('Scenario error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <div className={styles.icon}>◎</div>
          <h2 className={styles.heading}>Something went wrong</h2>
          <p className={styles.body}>
            The scenario hit an unexpected error. This sometimes happens if the page
            was open during a site update. Restarting will fix it.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}>
              Restart scenario
            </button>
            <a href="/" className={styles.secondaryLink}>← Back to all scenarios</a>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className={styles.devError}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
