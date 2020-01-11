
rsync -v -e ssh .ssh/rmozeika_github awsmono:/home/monorift/working/rmozeika_github
rsync  --recursive -v -e ssh /Users/Bobby/Development/monorift/packages/devops/data/ awsmono:/home/monorift/monorift/packages/devops/data/

/Users/Bobby/Development/monorift/packages/devops/.bin/send-bashrc.sh
