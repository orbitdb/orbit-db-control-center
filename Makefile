build:
	npm run build

clean:
	rm -f package-lock.json
	rm -rf node_modules

docker-image:
	docker build --rm -t orbitdb/control-center .
