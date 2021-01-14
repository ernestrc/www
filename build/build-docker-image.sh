#!/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/helper.sh

echo "building docker image $DOCKER_IMG_V"

docker build -f $DIR/Dockerfile -t $DOCKER_IMG_V . && \
	docker tag $DOCKER_IMG_V $DOCKER_IMG:latest
