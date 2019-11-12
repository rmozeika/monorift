CMD=$1

function provision() {
    cd ../packages/devops/1a/opts && ./provision.sh
}


if [$CMD = "cluster start"]; then
    echo "TRUE"
    provision()
else
    echo "FALSE"
fi