import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
	throw new Error("Unknown bundler");
}

// "isolatedModules": true, in tsconfig.json ✅
// pnpm run type-check passes ✅
// tried with rspackFuture.newResolver = true it didn't changed anything

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
	mode: "development",
	devtool: false,
	entry: {
		main: "./src/test.ts",
	},
	resolve: {
		// 1. tsconfig object fails with `Module not found: Can't resolve 'src/calc' in os-path-to-this-file`
		tsConfig: {
			configFile: path.resolve(__dirname, "./tsconfig.json"),
			references: "auto",
		},
		// 2. tsconfig inline fails with `Module not found: Can't resolve 'src/calc' in os-path-to-this-file`
		// tsConfig: path.resolve(__dirname, './tsconfig.json'),
		// 3. alias doesn't work also
		// alias: {
		//   src: path.resolve(__dirname, './src'),
		// },
	},
	plugins: [new HtmlWebpackPlugin()],
	output: {
		clean: true,
		path: isRunningWebpack
			? path.resolve(__dirname, "webpack-dist")
			: path.resolve(__dirname, "rspack-dist"),
		filename: "[name].js",
	},
	experiments: {
		css: true,
		rspackFuture: {
			newResolver: true,
		},
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset",
			},
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				loader: "builtin:swc-loader",
				options: {
					jsc: {
						parser: {
							syntax: "typescript",
						},
					},
				},
				type: "javascript/auto",
			},
		],
	},
};

export default config;
