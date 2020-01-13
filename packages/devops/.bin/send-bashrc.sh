#/bin/bash
rsync  -v -e ssh /Users/Bobby/Development/monorift/packages/devops/.bashrc awsmono:/home/monorift/.bashrc
rsync  -v -e ssh /Users/Bobby/Development/monorift/packages/devops/.monoriftrc awsmono:/home/monorift/.monoriftrc

rsync -v -e ssh  /Users/Bobby/Development/monorift/packages/devops/.bashrc-root awsmono:/root/.bashrc --rsync-path="sudo /usr/bin/rsync"
rsync -v -e ssh  /Users/Bobby/Development/monorift/packages/devops/.inputrc awsmono:/root/.inputrc --rsync-path="sudo /usr/bin/rsync"

rsync  -v -e ssh /Users/Bobby/Development/monorift/packages/devops/.bashrc ec2-user@aws:/home/ec2-user/.bashrc
rsync  -v -e ssh /Users/Bobby/Development/monorift/packages/devops/.monoriftrc ec2-user@aws:/home/ec2-user/.monoriftrc
echo 'completed bashrc transfer'