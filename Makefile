.PHONY: build test all
MAKEFLAGS += --silent

all:
	make lint &&\
		make typecheck &&\
		make format-check &&\
		make test &&\
		make build

NODE_BIN=node_modules/.bin/

## install
install:
	yarn install --frozen-lockfile

## dev
next=$(NODE_BIN)next

pre-dev:
	rm -rf .next

dev: pre-dev
	$(next) dev

## build
build:
	$(next) build

## clean-up:
clean-up:
	rm -rf src test script .github .git post post-operation pages docs

## start
start:
	$(next) start

## lint
eslint:
	$(NODE_BIN)eslint $(folder)/** -f='stylish' --color

lint-src:
	make eslint folder=src

lint-post-operation:
	make eslint folder=post-operation

lint-test:
	make eslint folder=test

lint:
	(trap 'kill 0' INT; make lint-src & make lint-test & make lint-post-operation)

## format
prettier=$(NODE_BIN)prettier

prettify-src:
	$(prettier) --$(type) src/

prettify-post-operation:
	$(prettier) --$(type) post-operation/

prettify-test:
	$(prettier) --$(type) test/

format-check:
	(trap 'kill 0' INT; make prettify-src type=check & make prettify-test type=check & make prettify-post-operation type=check)

format:
	(trap 'kill 0' INT; make prettify-src type=write & make prettify-test type=write & make prettify-post-operation type=write)

## typecheck
tsc=$(NODE_BIN)tsc

typecheck:
	$(tsc) -p tsconfig.json $(arguments) 

typecheck-watch:
	make typecheck arguments=--w

## test
test:
	$(NODE_BIN)esbuild test/index.ts --bundle --minify --target=node16.3.1 --platform=node --outfile=__test__/index.test.js &&\
		$(NODE_BIN)jest __test__

## cli
cli:
	@read -p "What environment should this be carried out: " NODE_ENV &&\
	echo "The environment is $${NODE_ENV}" &&\
	node script/generate-env.js generate --env=$${NODE_ENV} &&\
	$(NODE_BIN)esbuild post-operation/index.ts --bundle --minify --target=node16.3.1 --platform=node --outfile=dist/index.js\

cli-read: cli
	node dist/index.js read

cli-insert: cli
	node dist/index.js insert

cli-insert-template: cli
	node dist/index.js insert-template

cli-publish: cli
	@read -p "What is the id of the post need to be published: " id &&\
	echo "The id of the post to be published is $${id}" &&\
	node dist/index.js publish --id=$${id}

cli-update: cli
	node dist/index.js update

cli-update-template: cli
	@read -p "What is the id of the post need to generate its template: " id &&\
	echo "The id of the post to with template generated is $${id}" &&\
	node dist/index.js update-template --id=$${id}

cli-delete: cli
	@read -p "What is the id of the post need to be deleted: " id &&\
	echo "The id of the post to be deleted is $${id}" &&\
	node dist/index.js delete --id=$${id}

## mongo setup and installation
# ref: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
install-mongo:
	sudo apt-get install gnupg
	wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
	echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org

setup-mongo:
	sudo systemctl start mongod
	sudo systemctl stop mongod
	sudo systemctl restart mongod
	mongosh < script/mongo.js
