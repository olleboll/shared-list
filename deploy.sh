#!/bin/bash

cd shared-list-app

npm run build

# TODO: set the aws profile as required argument and supply on execution
aws s3 --profile personal sync dist/ s3://shared-list
aws cloudfront --profile personal create-invalidation --distribution-id E2KNC5WG8PGHAQ --paths '/*'