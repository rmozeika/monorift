# yum install git
#sudo yum install epel-release -y
#copy ssh creds
rsync -v -e ssh .ssh/rmozeika_github ec2-user@aws:/home/ec2-user/working/rmozeika_github
rsync  --recursive -v -e ssh /Users/Bobby/Development/monorift/packages/devops/data/ ec2-user@aws:/home/ec2-user/monorift/packages/devops/data/
rsync  -v -e ssh /Users/Bobby/Development/monorift/packages/devops/.bashrc ec2-user@aws:/home/ec2-user/.bashrc
yum install -y docker

yum install -y nginx
yum install -y node

cp /home/ec2-user/.bashrc /home

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
udo dnf install https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm
 sudo yum install docker-ce docker-ce-cli # containerd.io
# curl -sSL https://get.docker.com/ | sh

/home/ec2-user/monorift/packages/devops/nginx/conf-update.sh
