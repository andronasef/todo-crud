import sql from '$lib/db.js';

export const POST = async ({ request }) => {
  const data = await request.json();
  const title = data.title;

  if (!title) {
    return new Response(
      JSON.stringify({ success: false, error: 'No title provided' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
  await sql`
      INSERT INTO todos (full_text) VALUES (${title})
      `;
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
};

export const DELETE = async ({ request }) => {
  const data = await request.json();
  if (!data.id)
    return new Response(
      JSON.stringify({ success: false, error: 'No id provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );

  const id = data.id;

  await sql`
            DELETE FROM todos WHERE id = ${id}
            `;

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
};

export const GET = async () => {
  const todos = await sql`
    SELECT * FROM todos
    `;

  if (!todos) {
    return new Response(
      JSON.stringify({ success: false, error: 'No todos found' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
  return new Response(JSON.stringify(todos), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
};

export const PUT = async ({ request }) => {
  const data = await request.json();
  const { id, status } = data;

  if (!id && !status) {
    return new Response(
      JSON.stringify({ success: false, error: 'No data provided' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }

  await sql`
      UPDATE todos SET status = ${status} WHERE id = ${id}
      `;
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
};
