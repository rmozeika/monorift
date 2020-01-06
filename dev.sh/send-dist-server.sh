#/bin/bash
rsync --recursive -v -e ssh  ./dist.web/. ec2-user@aws:/home/ec2-user/monorift/dist.web/.

rsync -v -e ssh .ssh/rmozeika_github ec2-user@aws:/home/ec2-user/working/rmozeika_github
rsync  --recursive -v -e ssh /Users/Bobby/Development/monorift/packages/devops/data/ ec2-user@aws:/home/ec2-user/monorift/packages/devops/data/