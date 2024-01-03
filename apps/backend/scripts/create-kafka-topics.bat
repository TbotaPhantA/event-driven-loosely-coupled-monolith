@echo off

rem Define the path to the .env file
set "envFile=.env"

rem Load environment variables from the .env file
for /f "usebackq delims=" %%a in ("%envFile%") do (set "%%a")

REM Check if required environment variables are set
if "%KAFKA_SALES_PRODUCTS_TOPIC%"=="" (
    echo KAFKA_SALES_PRODUCTS_TOPIC is not set in .env file or is empty.
    exit /b 1
)
if "%KAFKA1_HOST%"=="" (
    echo KAFKA1_HOST is not set in .env file or is empty.
    exit /b 1
)
if "%KAFKA1_EXTERNAL_PORT%"=="" (
    echo KAFKA1_EXTERNAL_PORT is not set in .env file or is empty.
    exit /b 1
)

REM Set the Kafka bootstrap server
set "KAFKA_BOOTSTRAP_SERVER=%KAFKA1_HOST%:%KAFKA1_EXTERNAL_PORT%"

REM Execute the docker-compose command
docker-compose exec kafka1 kafka-topics --create --topic %KAFKA_SALES_PRODUCTS_TOPIC% --partitions 3 --replication-factor 3 --bootstrap-server %KAFKA_BOOTSTRAP_SERVER%
