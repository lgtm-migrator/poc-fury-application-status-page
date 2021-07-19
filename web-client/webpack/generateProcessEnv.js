/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

const yaml = require("js-yaml");
const fs = require("fs");

function yamlConfigToAppConfig(offline, configPath) {
    const file = fs.readFileSync(
        configPath,
        "utf-8"
    );

    const yamlConfig = yaml.load(file);

    return {
        APP_ENV: yamlConfig.appEnv,
        SERVER_OFFLINE: offline,
        API_PATH: '/',
        SERVER_BASE_PATH: yamlConfig.externalEndpoint,
        GROUP_LABEL: yamlConfig.groupLabel,
        GROUP_TITLE: yamlConfig.groupTitle,
        TARGET_LABEL: yamlConfig.targetLabel,
        TARGET_TITLE: yamlConfig.targetTitle,
        CASCADE_FAILURE: yamlConfig.cascadeFailure
    };
}

function envToAppConfig() {
    const serverbasepath = process.env.SERVER_BASE_PATH
        ? process.env.SERVER_BASE_PATH
        : "";

    return {
        APP_ENV: process.env.APP_ENV,
        SERVER_OFFLINE: process.env.SERVER_OFFLINE,
        SERVER_BASE_PATH: serverbasepath,
        API_PATH: process.env.API_VERSION,
        MODULE_KEY: process.env.MODULE_KEY,
        RELEASE_TAG: process.env.RELEASE_TAG,
        COMMIT: process.env.COMMIT
    };
}

function getAppConfig(env) {

    if (env.from_yaml) {
        return yamlConfigToAppConfig(env.offline, env.config_path)
    }

    return envToAppConfig();

}

function generateProcessEnv(dotenv, env) {

    /**
     * we assign an emptyObject if no parsed dotenv object is found
     */
    const envObject = dotenv.parsed ? dotenv.parsed : {};

    return JSON.stringify({
        ...envObject,
        ...getAppConfig(env),
    });
}

module.exports = generateProcessEnv
