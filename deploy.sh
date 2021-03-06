#!/bin/bash

aws s3 sync dist/ s3://www.southsidegardencentre.co.nz \
    --exclude "*.jpg" --exclude "*.png" --exclude "pages/*" --exclude "*.html" --exclude "*.css" --include "index.html" \
    --region ap-southeast-2 --delete	

aws s3 sync dist/ s3://www.southsidegardencentre.co.nz \
    --exclude "*" --include "*.jpg" --include "*.png" --include "*.css" \
    --region ap-southeast-2 --delete --metadata-directive REPLACE --expires 2034-01-01T00:00:00Z \
    --acl public-read --cache-control max-age=2592000,public	

aws s3 sync dist/pages s3://www.southsidegardencentre.co.nz \
    --region ap-southeast-2 --content-type text/html
