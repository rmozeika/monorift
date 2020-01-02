#/bin/bash
rsync --recursive -v -e ssh  ./dist.web/. ec2-user@aws:/home/ec2-user/monorift/dist.web/.