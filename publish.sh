#!/usr/bin/env bash
DEFAULT="southside-upload"
PROFILE=${AWS_PROFILE:-$DEFAULT}
BUCKET=test-southside
DIR=public/
aws  s3  sync $DIR s3://$BUCKET/ --profile "$PROFILE" --delete