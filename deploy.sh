#!/bin/bash

default_cache = 3600
      
# Index.html page
aws s3 sync dist/ s3://www.southsidegardencentre.co.nz \
    --exclude "*.jpg" --exclude "*.png" --exclude "pages/*" --exclude "*.html" --exclude "*.css" --include "index.html" \
    --content-language "en-NZ" \
    --metadata-directive REPLACE --cache-control max-age=$default_cache \
    --acl public-read \
    --region ap-southeast-2 --delete
    
# Media resources
aws s3 sync dist/ s3://www.southsidegardencentre.co.nz \
    --exclude "*" --include "*.jpg" --include "*.png" --include "*.css" \
    --metadata-directive REPLACE --expires 2034-01-01T00:00:00Z --cache-control max-age=2592000 \
    --acl public-read \
    --region ap-southeast-2 --delete

# All other 'extensionless' html files
aws s3 sync dist/pages s3://www.southsidegardencentre.co.nz \
    --content-type text/html \
    --content-language "en-NZ" \
    --metadata-directive REPLACE --cache-control max-age=$default_cache \
    --acl public-read \
    --region ap-southeast-2 --delete
