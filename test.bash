#!/usr/bin/env bash
docker stop case-test;
docker rm case-test;
docker stop case-db-test;
docker rm case-db-test;
docker stop case-redis-test;
docker rm case-redis-test;
docker stop case-manticore-test;
docker rm case-manticore-test;
docker network rm case-test;
docker network create case-test;
docker run -d --net=case-test -e REDIS_PASSWORD=secret -p 6379:6379 --name case-redis-test redis:4.0-alpine /bin/sh -c "redis-server";
docker run -d --net=case-test -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=case -e MYSQL_USER=auth -e MYSQL_PASSWORD=secret -p 3000-4000:3306 --name case-db-test mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --default-authentication-plugin=mysql_native_password;
sleep 20;
docker run --tty --net=case-test -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=case -e MYSQL_USER=auth -e MYSQL_PASSWORD=secret --name case-test --link case-db-test:db --link case-redis-test:redis $1 /bin/sh -c "npx jest --coverage --runInBand --forceExit";
RESULT=$?
docker stop case-test;
docker rm case-test;
docker stop case-db-test;
docker rm case-db-test;
docker stop case-redis-test;
docker rm case-redis-test;
docker network rm case-test;
exit $RESULT;