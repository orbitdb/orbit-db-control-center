PACKAGE_VERSION=$(shell grep version package.json | cut -c 15- | rev | cut -c 3- | rev | head -n 1)

build:
	npm run build

clean:
	rm -f package-lock.json
	rm -rf node_modules

docker-image:
	docker build --rm -t orbitdb/control-center:$(PACKAGE_VERSION) .
