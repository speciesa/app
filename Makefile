.PHONY: install start ios android test lint typecheck build-preview build-prod

install:
	npm install

start:
	npx expo start

ios:
	npx expo start --ios

android:
	npx expo start --android

test:
	npm test -- --watchAll=false

test-watch:
	npm test

lint:
	npm run lint

typecheck:
	npm run typecheck

build-preview:
	eas build --platform all --profile preview

build-prod:
	eas build --platform all --profile production

submit-prod:
	eas submit --platform all --profile production
