import * as database from '../../../database';

export async function PUT({
	params,
	request,
	cookies,
}: {
	params: { id: string };
	request: Request;
	cookies: {
		get: (name: string) => string;
		set: (name: string, value: string, options: { path: string }) => void;
	};
}) {
	const { done } = (await request.json()) as { done: boolean };
	const userid = cookies.get('userid');

	await database.toggleTodo({ userid, id: params.id, done });
	return new Response(null, { status: 204 });
}

export async function DELETE({
	params,
	cookies,
}: {
	params: { id: string };
	cookies: {
		get: (name: string) => string;
		set: (name: string, value: string, options: { path: string }) => void;
	};
}) {
	const userid = cookies.get('userid');

	await database.deleteTodo({ userid, id: params.id });
	return new Response(null, { status: 204 });
}
