import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Scenario error:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.toString() || 'Unknown error';
      const stack = this.state.info?.componentStack || '';

      return (
        <div className={styles.wrap}>
          <div className={styles.icon}>◎</div>
          <h2 className={styles.heading}>Something went wrong</h2>
          <p className={styles.body}>
            The scenario hit an unexpected error. Use the button below to go back
            to the scenario list, then try again.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={() => {
                this.setState({ hasError: false, error: null, info: null });
                window.location.hash = '/';
              }}>
              ← Back to all scenarios
            </button>
            <button
              className={styles.primaryBtn}
              style={{ background: 'transparent', color: 'var(--c-text-secondary)', border: '1.5px solid var(--c-border)' }}
              onClick={() => {
                this.setState({ hasError: false, error: null, info: null });
                window.location.reload();
              }}>
              Restart scenario
            </button>
          </div>
          {/* Always show error details so issues can be reported */}
          <details className={styles.devError} style={{ marginTop: '32px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontSize: '12px', color: 'var(--c-text-secondary)', marginBottom: '8px' }}>
              Error details (for reporting)
            </summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>{msg}{'\n\n'}{stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
