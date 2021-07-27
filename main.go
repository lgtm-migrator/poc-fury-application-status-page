// Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
)

// https://github.com/gin-contrib/static/issues/19
// It will add all non-hidden file in images, css, and js.
//go:embed static/*
var embeded embed.FS

type embedFileSystem struct {
	http.FileSystem
}

type HealthCheck struct {
	Group string `json:"group"`
	Target string `json:"target"`
	StartTime string `json:"startTime"`
	CompletedAt string `json:"completedAt"`
	Duration string `json:"duration"`
	Status string `json:"status"`
	Namespace string `json:"namespace"`
	PodName string `json:"podName"`
	CheckName string `json:"checkName"`
	Owner string `json:"owner"`
	Error string `json:"error"`
	Frequency int `json:"frequency"`
}

type apiResponse struct {
	Code int `json:"code"`
	Data []HealthCheck `json:"data"`
	ErrorMessage string `json:"errorMessage"`
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	if err != nil {
		return false
	}
	return true
}
func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	fsys, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(fsys),
	}
}

func listLastChecks(c *gin.Context) {
	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "cannot read config file"})
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s", cfg.ApiUrl, cfg.GroupLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		c.JSON(http.StatusBadRequest, &apiResponse{Code: http.StatusBadRequest, ErrorMessage: "cannot get list"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "IO error on get list"})
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "cannot read content on get list"})
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "cannot convert to json"})
		return
	}

	var resultHealthChecks []HealthCheck

	for _ , healthcheck := range healthChecks {
		indexFound := -1

		for i := range resultHealthChecks {
			if resultHealthChecks[i].CheckName == healthcheck.CheckName && resultHealthChecks[i].Target == healthcheck.Target {
				indexFound = i
				break
			}
		}

		if indexFound == -1 {
			resultHealthChecks = append(resultHealthChecks, healthcheck)
			continue
		}

		resultTime, resultTimeErr := time.Parse(time.RFC3339, resultHealthChecks[indexFound].CompletedAt)
		healthcheckTime, healthCheckTimeErr := time.Parse(time.RFC3339, healthcheck.CompletedAt)

		if resultTimeErr != nil || healthCheckTimeErr != nil {
			c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "error parsing times"})
			break
		}

		if indexFound != -1 && resultTime.Before(healthcheckTime) {
			resultHealthChecks[indexFound] = healthcheck
		}
	}

	c.JSON(http.StatusOK, &apiResponse{Code: http.StatusOK, Data: resultHealthChecks})
}

func listLastChecksAndIssuesByTarget(c *gin.Context) {
	targetLabel := c.Param("targetLabel")

	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "cannot read config file"})
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s/target/%s", cfg.ApiUrl, cfg.GroupLabel, targetLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		fmt.Printf("error: %s\n", err.Error())
		c.JSON(http.StatusBadRequest, &apiResponse{Code: http.StatusBadRequest, ErrorMessage: "cannot get list by target"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "IO error on get list by target"})
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "cannot read content on get list by target"})
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "cannot convert to json"})
		return
	}

	var resultHealthChecks []HealthCheck

	for _ , healthcheck := range healthChecks {
		indexFound := -1

		for i := range resultHealthChecks {
			if resultHealthChecks[i].CheckName == healthcheck.CheckName &&
				resultHealthChecks[i].Target == healthcheck.Target &&
				resultHealthChecks[i].Status == healthcheck.Status {
				indexFound = i
				break
			}
		}

		if indexFound == -1 {
			resultHealthChecks = append(resultHealthChecks, healthcheck)
			continue
		}

		resultTime, resultTimeErr := time.Parse(time.RFC3339, resultHealthChecks[indexFound].CompletedAt)
		healthcheckTime, healthCheckTimeErr := time.Parse(time.RFC3339, healthcheck.CompletedAt)

		if resultTimeErr != nil || healthCheckTimeErr != nil {
			c.JSON(http.StatusInternalServerError, &apiResponse{Code: http.StatusInternalServerError, ErrorMessage: "error parsing times"})
			break
		}

		if indexFound != -1 && resultTime.Before(healthcheckTime) {
			resultHealthChecks[indexFound] = healthcheck
		}
	}

	c.JSON(http.StatusOK, &apiResponse{Code: http.StatusOK, Data: resultHealthChecks})
}

func AppConfigMiddleware(appConfig *config.YamlConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("config", *appConfig)
		c.Next()
	}
}

func main() {
	router := gin.Default()
	corsConfig := cors.DefaultConfig()
	appConfig := config.GetYamlConf()
	corsConfig.AllowAllOrigins = true

	router.Use(cors.New(corsConfig))

	router.Use(AppConfigMiddleware(appConfig))

	router.GET("/config", func(context *gin.Context) {
		type response struct {
			Data config.YamlConfig
		}

		context.JSON(200, &response{Data: *appConfig})
	})

	router.GET("/", func(c *gin.Context) {
		c.FileFromFS("index.htm", EmbedFolder(embeded, "static"))
	})
	router.Use(static.Serve("/", EmbedFolder(embeded, "static")))
	router.NoRoute(func(c *gin.Context) {
		fmt.Printf("%s doesn't exists, redirect on /\n", c.Request.URL.Path)
		c.FileFromFS("index.htm", EmbedFolder(embeded, "static"))
	})

	api := router.Group("/api")

	api.GET("/lastChecks", listLastChecks)
	api.GET("/lastChecksAndIssues/:targetLabel", listLastChecksAndIssuesByTarget)

	_ = router.Run(appConfig.Listener)
}
