import { json } from '@sveltejs/kit';
import * as database from '../../database';

const userid = 'userid';
export async function POST({ request }: { request: Request }) {
	const { description } = (await request.json()) as { description: string };

	const { id } = await database.createTodo({ userid, description });

	return json({ id }, { status: 201 });
}
