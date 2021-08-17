// Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
package main

import (
	"embed"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"github.com/sighupio/poc-fury-application-status-page/internal/server"
)

// https://github.com/gin-contrib/static/issues/19
// It will add all non-hidden file in images, css, and js.
//go:embed static/*
var embedded embed.FS

func main() {
	appConfig := config.GetYamlConf()
	router := server.New(appConfig, embedded)
	_ = router.Run(appConfig.Listener)
}
