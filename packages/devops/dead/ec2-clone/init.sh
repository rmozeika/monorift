cd $monorift/packages/devops/ec2-clone && docker build --rm -t local/c7-systemd .


docker run -ti --privileged=true -v /sys/fs/cgroup:/sys/fs/cgroup:ro -p 80:80 local/c7-systemd