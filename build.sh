#!/bin/sh

VERSION=0.3.4
REGTAG=starsellersworld/zmountitback
LOCTAG=zmountitback
NAME=zmountitback
STACKNAME=zmountitback

case "$1" in
    registry)
    docker build -t $REGTAG .
    ;;
    rm)
    docker stop $NAME
    docker rm $NAME
    ;;
    ## local operations:
    localbuild)
    docker-compose -f services/docker-compose-dev.yml build
    ;;
    localrun)
    docker-compose -f services/docker-compose-dev.yml up -d
    docker exec -u node -it "services_"$NAME"_1" sh
    ;;
    localsh)
    docker exec -u node -it "services_"$NAME"_1" sh
    ;;
    localstop)
    set -x
    docker-compose -f services/docker-compose-dev.yml stop
    set +x
    ;;
    localrm)
    docker-compose -f services/docker-compose-dev.yml rm
    ;;
    tagname)
    echo $REGTAG:$VERSION
    ;;
    version)
    echo $VERSION
    ;;
## other staff
    setnet)
    docker network create mserv_bridge
    ;;
esac
