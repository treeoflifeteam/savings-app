export default function Loader() {

  
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={{ marginTop: "10px" }}>Checking your session...</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #ccc",
    borderTop: "5px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};