export default function PayloadViewer({ payload }) {
  return (
    <div className="card">
      <div className="courier">INTERCEPTED PAYLOAD</div>
      <pre style={{ whiteSpace: "pre-wrap" }}>{payload || "No payload yet."}</pre>
    </div>
  );
}
