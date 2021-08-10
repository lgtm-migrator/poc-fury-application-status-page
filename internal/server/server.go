package server

import (
	"embed"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"github.com/sighupio/poc-fury-application-status-page/internal/resources"
	"io/fs"
	"net/http"
	"os"
)

const (
	serviceProvider = "serviceprovider"
)

type EmbedFileSystem struct {
	http.FileSystem
}

type ServiceProvider struct {
	HealthChecksManager resources.HealthChecksManager
}

// Exists overrides http.FileSystem method
func (e EmbedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	return err == nil
}

func New(appConfig *config.YamlConfig, embedded embed.FS) *gin.Engine {
	router := gin.Default()

	addMiddleware(router, appConfig)

	addRoutes(router, appConfig, embedded)

	return router
}

func addMiddleware(engine *gin.Engine, yamlConfig *config.YamlConfig) {
	corsConfig := cors.DefaultConfig()

	if os.Getenv("SERVER_ENV") != "production" {
		corsConfig.AllowAllOrigins = true
	}

	engine.Use(cors.New(corsConfig))

	engine.Use(func(c *gin.Context) {

		client := resty.New()
		manager := resources.NewRemoteDataManager(client, yamlConfig)

		if yamlConfig.Mocked {
			manager = resources.NewFakeDataManager(client, yamlConfig)
		}

		c.Set(serviceProvider, ServiceProvider{HealthChecksManager: manager})
		c.Next()
	})
}

func addRoutes(engine *gin.Engine, appConfig *config.YamlConfig, embedded embed.FS) {
	engine.GET("/config", func(context *gin.Context) {
		type response struct {
			Data config.YamlConfig
		}

		context.JSON(200, &response{Data: *appConfig})
	})

	engine.GET("/", func(c *gin.Context) {
		c.FileFromFS("index.htm", embedFolder(embedded, "static"))
	})

	engine.Use(static.Serve("/", embedFolder(embedded, "static")))

	engine.NoRoute(func(c *gin.Context) {
		fmt.Printf("%s doesn't exists, redirect on /\n", c.Request.URL.Path)
		c.FileFromFS("index.htm", embedFolder(embedded, "static"))
	})

	api := engine.Group("/api/v1")

	api.GET("lastChecks", listLastChecks)
	api.GET("lastChecksAndIssues/:targetLabel", listLastChecksAndIssuesByTarget)
	api.GET("lastFailedChecks/day/:day", failedHealthChecksFilterByDay)
	api.GET("lastFailedChecks", failedHealthCheckGroupByDay)
}

func embedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	fsys, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return EmbedFileSystem{
		FileSystem: http.FS(fsys),
	}
}
