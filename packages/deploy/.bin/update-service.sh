#/bin/bash
# visudoers line
#
rsync -v -e ssh  ./deploy.service awsmono:/usr/lib/systemd/system --rsync-path="sudo /usr/bin/rsync"
# rsync -v -e ssh  ./deploy.service awsmono:/home/monorift/deploy.service
#mono@awsmono:/usr/lib/systemd/system