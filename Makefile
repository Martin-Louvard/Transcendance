
##### Frontend Make Commands ####

# Install frontend Dependencies (Like React and Vite)
frontend install:
	@cd frontend && npm install

# Run dev server (using Vite)
run dev:
	@cd frontend && npm run dev


.PHONY: frontend