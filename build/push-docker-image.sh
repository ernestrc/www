#!/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/helper.sh

echo "pushing docker image $DOCKER_IMG_V"

docker push $DOCKER_IMG_V && \
	docker push $DOCKER_IMG:latest
