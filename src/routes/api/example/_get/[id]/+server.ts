import { json } from '@sveltejs/kit';

export function GET({ params }: { params: { id: string; server: string } }) {
	return json({ id: params.id, server: params.server });
}
