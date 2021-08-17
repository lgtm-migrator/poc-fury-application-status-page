// Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package config

import (
	"log"

	"github.com/spf13/viper"
)

type YamlConfig struct {
	Listener         string  `json:"listener"`
	AppEnv           string  `json:"appEnv"`
	ExternalEndpoint string  `json:"externalEndpoint"`
	ApiUrl           string  `json:"apiUrl"`
	Mocked           bool    `json:"mocked"`
	CascadeFailure   int32   `json:"cascadeFailure"`
	GroupLabel       string  `json:"groupLabel"`
	GroupTitle       *string `json:"groupTitle"`
	TargetLabel      *string `json:"targetLabel"`
	TargetTitle      *string `json:"targetTitle"`
}

func GetConfig() *viper.Viper {
	v := viper.New()
	v.SetConfigName("config")
	v.AddConfigPath(".")
	v.AddConfigPath("..")
	v.AutomaticEnv()
	v.SetEnvPrefix("FURY")
	err := v.ReadInConfig()
	if err != nil {
		log.Fatalf("Fatal error config file: %s \n", err)
	}
	return v
}

func GetYamlConf() *YamlConfig {
	var yamlConfig YamlConfig
	err := GetConfig().Unmarshal(&yamlConfig)

	if err != nil {
		log.Fatalf("error: %v", err)
	}
	return &yamlConfig
}
