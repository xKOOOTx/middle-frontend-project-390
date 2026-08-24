install: 
	pnpm intall
build:
	pnpm build
test: 
	APP_URL=$(APP_URL) pnpm exec playwright test