export default function Services() {
  return (
    <div>
      <h1>Services</h1>
    </div>
  );
}

export function serviceLoader() {
  return fetch("/api/services-offered");
}
