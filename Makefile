install:
	pnpm install --ignore-workspace
build:
	pnpm run build
test: 
	APP_URL=$(APP_URL) pnpm exec playwright test
start:
	pnpm exec frontend-flight-booking-server start -s dist
