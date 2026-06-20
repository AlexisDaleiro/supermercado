import React from "react";

export default function HomePage() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Restaurant SaaS — Desarrollo</h1>
      <p>
        El proyecto está corriendo con una base de datos SQLite local (
        <strong>dev.db</strong>).
      </p>
      <p>Rutas de interés:</p>
      <ul>
        <li>
          Prisma Studio: <code>/prisma</code> (usar `npm run db:studio`)
        </li>
        <li>
          API routes y componentes en <code>src/</code>
        </li>
      </ul>
    </main>
  );
}
