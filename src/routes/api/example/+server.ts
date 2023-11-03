import { json } from '@sveltejs/kit';

type Folder = {
	name: string;
	children_folders: Folder[] | null;
};
export function GET() {
	const folders: Folder[] = [
		{
			name: '_get',
			children_folders: null,
		},
		{
			name: '_post',
			children_folders: [
				{
					name: 'todo',
					children_folders: [
						{
							name: '[id]',
							children_folders: null,
						},
					],
				},
			],
		},
	];
	return json(folders);
}
