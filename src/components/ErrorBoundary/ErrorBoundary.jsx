import React from "react";
import styles from "./ErrorBoundary.module.css";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Actualiza el estado para renderizar el fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Aquí puedes reportar el error a un servicio externo
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // e.g., sendToMonitoringService(error, errorInfo);
  }

  handleRetry = () => {
    // Reinicia el estado para intentar renderizar de nuevo
    this.setState({ hasError: false, error: null });
    // O si prefieres recargar la página: window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h1>Algo salió mal 😢</h1>
          <pre className={styles.message}>
            {this.state.error?.message}
          </pre>
          <button onClick={this.handleRetry} className={styles.button}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
