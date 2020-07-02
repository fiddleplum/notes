import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
// import { terser } from "rollup-plugin-terser";
export default {
	input: 'src/app.ts', // our source file
	output: [
		{
			file: 'dist/script.js',
			format: 'iife',
			name: 'app' // the global which can be used in a browser
		}
	],
	watch: {
		include: 'src/**',
		chokidar: {
			usePolling: true
		}
	},
	external: [
		...Object.keys(pkg.dependencies || {})
	],
	plugins: [
		copy({
			targets: [{
				src: 'src/index.html',
				dest: 'dist'
			}, {
				src: 'src/assets/**/*',
				dest: 'dist/assets'
			}]
		}),
		typescript({
			typescript: require('typescript'),
		}),
		// terser(), // minifies generated bundles
		serve({
			contentBase: 'dist',
			open: true
		}),
		livereload('dist')
	]
};
