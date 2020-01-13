# yum install git
#sudo yum install epel-release -y
#copy ssh creds


rsync -v -e ssh .ssh/rmozeika_github ec2-user@aws:/home/ec2-user/working/rmozeika_github
rsync  --recursive -v -e ssh /Users/Bobby/Development/monorift/packages/devops/data/ ec2-user@aws:/home/ec2-user/monorift/packages/devops/data/
rsync  -v -e ssh /Users/Bobby/Development/monorift/packages/devops/.bashrc ec2-user@aws:/home/ec2-user/.bashrc
yum install -y docker
yum install -y nginx
yum install -y node

# Add user monorift
adduser monorift
usermod -aG root monorift
usermod -aG root monorift

cp -R /home/ec2-user/.ssh /home/monorift/.ssh
chown -R monorift:monorift /home/monorift/.ssh
chown monorift:monorift /home/monorift/.bashrc
cp /home/ec2-user/.bashrc /home/monorift

# DOCKER
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

#yum install containerd.io
sudo dnf install https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm
 sudo yum install docker-ce docker-ce-cli # containerd.io
# curl -sSL https://get.docker.com/ | sh
#END DOCKER

# CERTBOT
yum install -y wget 
wget https://dl.eff.org/certbot-auto
sudo mv certbot-auto /usr/local/bin/certbot-auto
sudo chown root /usr/local/bin/certbot-auto
sudo chmod 0755 /usr/local/bin/certbot-auto

/usr/local/bin/certbot-auto --nginx

echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && /usr/local/bin/certbot-auto renew" | sudo tee -a /etc/crontab > /dev/null

#END CERTBOT
#/home/ec2-user/monorift/packages/devops/nginx/conf-update.sh
npm install --global webpack
npm install --global webpack-cli
2m && npm install
npm run-script build:prod

systemctl enable nginx
systemctl start nginx 
#check permission denied error due to selinux