D_COMPOSE := $(shell which docker-compose)

default: help

.PHONY: help up restart down status logs

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' -e 's/:.*#/: #/' | column -t -s '##'

up: ## up all containers
	$(D_COMPOSE) up -d

restart: ## restarts all containers
	$(D_COMPOSE) restart

down: ## down all containers
	$(D_COMPOSE) down

status: ## get process report from the container
	$(D_COMPOSE) ps

logs: ## show last log lines
logs: LINES ?= 100
logs:
	$(D_COMPOSE) logs --tail=${LINES} --follow --timestamps ${SERVICE}
