sudo yum install snapd -y
sudo mkdir /opt/snapd
sudo mount -o bind /opt/snapd /var/lib/snapd
sudo ln -s /var/lib/snapd/snap /snap

sudo systemctl enable --now snapd.socket
snap login
sudo snap install microk8s --classic