package server

import (
	"github.com/gin-gonic/gin"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
)

func AppConfigMiddleware(appConfig *config.YamlConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("config", *appConfig)
		c.Next()
	}
}
