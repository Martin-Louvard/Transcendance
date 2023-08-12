NPM_DEV_FLAGS	?=
VOL				:= $(shell docker volume ls -q)

all: build up

build:
	docker compose -f docker-compose.yml build

restart:
	docker compose -f docker-compose.yml restart

up:
	docker compose -f docker-compose.yml up --detach

stop:
	docker compose -f docker-compose.yml stop

purge:
	docker compose -f docker-compose.yml down -v --rmi 'all'
re:
	make stop
	make purge
	make build
	make up

rmvol:
	docker volume rm $(VOL)

fclean:
	make stop
	make purge
	make rmvol

.PHONY: all, build, restart, up, stop, purge, re, rmvol, fclean
