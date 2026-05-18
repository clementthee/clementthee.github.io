// =========================================================================
// 1. IMPORTS Y POOL DE CONEXIONES ADAPTATIVO (ENVIRONMENT ENGINES)
// =========================================================================
import type { APIRoute } from 'astro';
import pg from 'pg';

// Evaluamos si existe la variable de entorno (inyectada por el sistema o por el .env)
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString,
  // Si estamos en la nube (Neon), forzamos que acepte SSL requerido
  ssl: connectionString?.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

export const prerender = false;

// =========================================================================
// 2. ROUTER ENGINE: PROCESAMIENTO DE MUTACIONES ASÍNCRONAS
// =========================================================================
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, id, name, target, monthIndex, yearIndex, dayNum } = body;

    const client = await pool.connect();

    try {
      // ---------------------------------------------------------------------
      // ACCIÓN A: ACCESO DE INSERCIÓN PARA NUEVO HÁBITO
      // ---------------------------------------------------------------------
      if (action === 'CREATE_HABIT') {
        await client.query(
          'INSERT INTO habits (id, name, target, month_index, year_index) VALUES ($1, $2, $3, $4, $5)',
          [id, name, target, monthIndex, yearIndex]
        );
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      // ---------------------------------------------------------------------
      // ACCIÓN B: CONTROL DE ELIMINACIÓN DE TARJETA
      // ---------------------------------------------------------------------
      if (action === 'DELETE_HABIT') {
        await client.query('DELETE FROM habits WHERE id = $1', [id]);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      // ---------------------------------------------------------------------
      // ACCIÓN C: ALTERNAR COMPLETADO DIARIO (TOGGLE)
      // ---------------------------------------------------------------------
      if (action === 'TOGGLE_DAY') {
        const exists = await client.query(
          'SELECT 1 FROM completions WHERE habit_id = $1 AND day_number = $2',
          [id, dayNum]
        );
        
        if (exists.rowCount && exists.rowCount > 0) {
          await client.query('DELETE FROM completions WHERE habit_id = $1 AND day_number = $2', [id, dayNum]);
        } else {
          await client.query('INSERT INTO completions (habit_id, day_number) VALUES ($1, $2)', [id, dayNum]);
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
    } finally {
      client.release(); // Retornar canal de red al pool
    }

    return new Response(JSON.stringify({ error: 'Acción no válida' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};