/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },
				darkblue: '#0f172a',
				blue: '#2563eb',
			},
			boxShadow: {
				card: '0 4px 16px rgba(0,0,0,0.08)',
			},
		},
	},
	plugins: [],
};


