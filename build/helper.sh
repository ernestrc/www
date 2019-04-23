export G_PROJECT_ID="$(gcloud config get-value project -q)"
export GIT_COMMIT=$(git rev-parse --short HEAD)
export DOCKER_IMG=gcr.io/$G_PROJECT_ID/www
export DOCKER_IMG_V=$DOCKER_IMG:$GIT_COMMIT
