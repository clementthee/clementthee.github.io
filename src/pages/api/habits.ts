// =========================================================================
// ------------------- 1. API INFRASTRUCTURE & POOL SETUP ------------------
// =========================================================================
import type { APIRoute } from 'astro';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Angie2706+@localhost:5433/tracker_db"
});

export const prerender = false; // Desactivar empaquetado estático

// =========================================================================
// ------------------- 2. ROUTER ENGINE COMPILADO (POST METODOS) -----------
// =========================================================================
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, id, name, target, monthIndex, yearIndex, dayNum } = body;

    // Conectar a la base de datos de Docker
    const client = await pool.connect();

    try {
      if (action === 'CREATE_HABIT') {
        await client.query(
          'INSERT INTO habits (id, name, target, month_index, year_index) VALUES ($1, $2, $3, $4, $5)',
          [id, name, target, monthIndex, yearIndex]
        );
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      if (action === 'DELETE_HABIT') {
        await client.query('DELETE FROM habits WHERE id = $1', [id]);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

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
      client.release(); // Liberar la conexión de vuelta al pool obligatoriamente
    }

    return new Response(JSON.stringify({ error: 'Acción no válida' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};