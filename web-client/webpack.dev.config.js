/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

const dotenv = require("dotenv").config({path: `${__dirname}/.env`});

const generateBaseWebpackConfig = require("./webpack/generateBaseWebpackConfig")

module.exports = (env, args) => {
	const base = generateBaseWebpackConfig(env, 'development', dotenv, args)

	return {
		...base,
		devServer: {
			historyApiFallback: {
				rewrites: [{ from: /./, to: "/index.htm" }],
				index: "index.htm",
			},
			port: 8085,
			client: {
				overlay: {
					errors: true,
					warnings: false,
				},
			},
		}
	}
}

