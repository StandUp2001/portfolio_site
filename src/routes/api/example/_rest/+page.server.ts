import * as database from '../database';

export function load({
	cookies,
}: {
	cookies: {
		get: (name: string) => string;
		set: (name: string, value: string, options: { path: string }) => void;
	};
}) {
	let userid = cookies.get('userid');

	if (!userid) {
		userid = crypto.randomUUID();
		cookies.set('userid', userid, { path: '/' });
	}

	return {
		todos: database.getTodos(userid) as string[],
	};
}
