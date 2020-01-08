rsync --recursive -v -e ssh --exclude 'monorift/*' ec2-user@aws:/home/ec2-user ./private/ec2-files/.
# cp ./backup/bobby/privkey.pem ./private/privkey.pem
# cp ./backup/bobby/fullchain.pem ./private/fullchain.pem
# cp -R ./backup/bobby/letsencrypt ./packages/devops/data/etc/
# cp -R ./backup/bobby/nginx ./packages/devops/data/etc/
# cp ./backup/bobby/privkey.pem ./packages/devops/data/keys/privkey.pem
# cp ./backup/bobby/fullchain.pem ./packages/devops/data/keys/fullchain.pem

# rsync --recursive -v -e ssh ec2-user@aws:/home/ec2-user ./backup/.

# rsync --recursive -v -e ssh bobby@awsbob:/home/bobby ./backup/.

 
