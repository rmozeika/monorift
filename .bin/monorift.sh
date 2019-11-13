CMD=$1

function provision() {
    cd ../packages/devops/1a/opts && ./provision.sh
}


if [ $CMD = "cluster start" ]; then
    echo "TRUE"
    provision
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ $CMD = "cm" ]; then
    echo "committing"
    $DIR/commit.sh
fi