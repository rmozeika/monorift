rsync --recursive -v -e ssh bobby@awsbob:/home/bobby ./backup/.
cp ./backup/bobby/privkey.pem ./private/privkey.pem
cp ./backup/bobby/fullchain.pem ./private/fullchain.pem
cp -R ./backup/bobby/letsencrypt ./packages/devops/data/etc/
cp -R ./backup/bobby/nginx ./packages/devops/data/etc/
cp ./backup/bobby/privkey.pem ./packages/devops/data/keys/privkey.pem
cp ./backup/bobby/fullchain.pem ./packages/devops/data/keys/fullchain.pem
