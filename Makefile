.PHONY: build test

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
	rm -rf src test node_modules script sql .github .git server

## start
start:
	$(next) start

## lint
lint:
	$(next) lint

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

## format
prettier=$(NODE_BIN)prettier
prettify-src:
	$(prettier) --$(type) src/

prettify-test:
	$(prettier) --$(type) test/

format-check:
	(trap 'kill 0' INT; make prettify-src type=check & make prettify-test type=check)

format:
	(trap 'kill 0' INT; make prettify-src type=write & make prettify-test type=write)

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
