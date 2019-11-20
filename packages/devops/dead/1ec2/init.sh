sudo yum install epel-release -y


yum install -y docker
sudo su
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
chmod 777 /etc/yum.repos.d/kubernetes.repo
exit
sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
sudo kubeadm init
systemctl enable kubelet.service
#KUBEADM KUBECTL
cat /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg

# Set SELinux in permissive mode (effectively disabling it)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet



sudo yum install snapd -y
sudo mkdir /opt/snapd
sudo mount -o bind /opt/snapd /var/lib/snapd
sudo ln -s /var/lib/snapd/snap /snap
sed -i '11i\PATH=$PATH:/var/lib/snapd/snap/bin\' .bash_profile

sudo systemctl enable --now snapd.socket

snap login robertmozeika+ubuntu@gmail.com	
# set /priv/snapd for password

sudo snap install microk8s --classic

firewall-cmd --permanent --add-port=6443/tcp
 firewall-cmd --permanent --add-port=2379-2380/tcp
 firewall-cmd --permanent --add-port=10250/tcp
 firewall-cmd --permanent --add-port=10251/tcp
 firewall-cmd --permanent --add-port=10252/tcp
 firewall-cmd --permanent --add-port=10255/tcp
 firewall-cmd --reload
 modprobe br_netfilter
 echo '1' > /proc/sys/net/bridge/bridge-nf-call-iptables

 [kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
        https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg